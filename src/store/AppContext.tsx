import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { generateId as uuidv4 } from '../lib/id';
import { User, Contact, Conversation, Message } from '../types';
import * as db from '../services/database';
import * as secure from '../services/secure-storage';
import * as crypto from '../lib/crypto';

interface ChatListItem {
  conversation: Conversation;
  contact: Contact;
  lastMessage: Omit<Message, 'plaintext'> | null;
  lastMessagePreview?: string;
  unreadCount: number;
}

interface AppState {
  user: User | null;
  isOnboarded: boolean;
  isLoading: boolean;
  chatList: ChatListItem[];
}

interface AppActions {
  createIdentity: (displayName: string, username?: string) => Promise<void>;
  addContact: (displayName: string, publicKey: string, routingToken: string) => Promise<string>;
  loadChatList: () => Promise<void>;
  getMessages: (conversationId: string) => Promise<Message[]>;
  sendMessage: (conversationId: string, plaintext: string) => Promise<void>;
  receiveMessage: (conversationId: string, ciphertext: string, nonce: string, senderId: string) => Promise<void>;
  updateConversationSettings: (conversationId: string, settings: Partial<Conversation>) => Promise<void>;
  getConversation: (conversationId: string) => Promise<Conversation | null>;
  getContact: (contactId: string) => Promise<Contact | null>;
  getUserExchangePayload: () => Promise<{ publicKey: string; routingToken: string; displayName: string } | null>;
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);

  useEffect(() => {
    loadInitialState();
  }, []);

  async function loadInitialState() {
    try {
      const onboarded = await secure.isOnboarded();
      setIsOnboarded(onboarded);
      if (onboarded) {
        const existingUser = await db.getUser();
        setUser(existingUser);
        await loadChatListInternal();
      }
    } catch (e) {
      console.error('Failed to load initial state:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadChatListInternal() {
    try {
      const items = await db.getConversationsWithLastMessage();
      const privateKey = await secure.getIdentityPrivateKey();

      const enriched: ChatListItem[] = items.map(item => {
        let preview = '';
        if (item.lastMessage && privateKey) {
          try {
            const decrypted = crypto.decryptMessage(
              item.lastMessage.ciphertext,
              item.lastMessage.nonce,
              item.contact.publicKey,
              privateKey
            );
            preview = decrypted.length > 50 ? decrypted.slice(0, 50) + '...' : decrypted;
          } catch {
            preview = '[Encrypted message]';
          }
        }
        return { ...item, lastMessagePreview: preview };
      });

      setChatList(enriched);
    } catch (e) {
      console.error('Failed to load chat list:', e);
    }
  }

  const createIdentity = useCallback(async (displayName: string, username?: string) => {
    const keyPair = crypto.generateKeyPair();
    const routingToken = crypto.generateRoutingToken();
    const userId = uuidv4();

    await secure.storeIdentityKeys(keyPair.publicKey, keyPair.secretKey);
    await secure.storeUserId(userId);

    const newUser: User = {
      id: userId,
      displayName,
      username,
      identityPublicKey: keyPair.publicKey,
      createdAt: Date.now(),
    };

    await db.saveUser(newUser);
    await secure.setOnboarded(true);

    // Store routing token
    const { registerRoutingToken } = await import('../services/firebase');
    await registerRoutingToken(userId, routingToken);
    await secure.storeSessionKey('routing_token', routingToken);

    setUser(newUser);
    setIsOnboarded(true);
  }, []);

  const addContact = useCallback(async (displayName: string, publicKey: string, routingToken: string): Promise<string> => {
    const conversationId = uuidv4();
    const contactId = uuidv4();

    const contact: Contact = {
      contactId,
      displayNameLocal: displayName,
      publicKey,
      addedAt: Date.now(),
      conversationId,
    };

    const conversation: Conversation = {
      conversationId,
      contactId,
      secondReadMode: 'off',
      replyAssistEnabled: true,
      aiEnabled: false,
      redactPii: false,
      readReceipts: false,
    };

    await db.saveContact({ ...contact, routingToken } as any);
    await db.saveConversation(conversation);
    await secure.storeSessionKey(conversationId, routingToken);
    await loadChatListInternal();

    return conversationId;
  }, []);

  const loadChatList = useCallback(async () => {
    await loadChatListInternal();
  }, []);

  const getMessages = useCallback(async (conversationId: string): Promise<Message[]> => {
    const encrypted = await db.getMessages(conversationId);
    const privateKey = await secure.getIdentityPrivateKey();
    const conv = await db.getConversation(conversationId);
    if (!conv || !privateKey) return [];

    const contact = await db.getContactById(conv.contactId);
    if (!contact) return [];

    return encrypted.map(msg => {
      let plaintext = '';
      try {
        plaintext = crypto.decryptMessage(
          msg.ciphertext,
          msg.nonce,
          contact.publicKey,
          privateKey
        );
      } catch {
        plaintext = '[Unable to decrypt]';
      }
      return { ...msg, plaintext };
    });
  }, []);

  const sendMessage = useCallback(async (conversationId: string, plaintext: string) => {
    const privateKey = await secure.getIdentityPrivateKey();
    const conv = await db.getConversation(conversationId);
    if (!conv || !privateKey) throw new Error('Cannot send: missing keys or conversation');

    const contact = await db.getContactById(conv.contactId);
    if (!contact) throw new Error('Contact not found');

    const { ciphertext, nonce } = crypto.encryptMessage(plaintext, contact.publicKey, privateKey);
    const messageId = uuidv4();

    const message = {
      messageId,
      conversationId,
      sender: 'me' as const,
      ciphertext,
      nonce,
      timestamp: Date.now(),
      deliveryState: 'sending' as const,
    };

    await db.saveMessage(message);

    // Send via relay
    try {
      const { sendMessageRelay } = await import('../services/firebase');
      const routingToken = await secure.getSessionKey(conversationId);
      if (routingToken && user) {
        await sendMessageRelay(user.id, routingToken, ciphertext, nonce, messageId);
      }
      await db.updateMessageDeliveryState(messageId, 'sent');
    } catch (e) {
      console.error('Failed to send via relay:', e);
    }

    await loadChatListInternal();
  }, [user]);

  const receiveMessage = useCallback(async (conversationId: string, ciphertext: string, nonce: string, senderId: string) => {
    const messageId = uuidv4();
    const message = {
      messageId,
      conversationId,
      sender: 'them' as const,
      ciphertext,
      nonce,
      timestamp: Date.now(),
      deliveryState: 'delivered' as const,
    };
    await db.saveMessage(message);
    await loadChatListInternal();
  }, []);

  const updateConversationSettings = useCallback(async (conversationId: string, settings: Partial<Conversation>) => {
    await db.updateConversationSettings(conversationId, settings);
  }, []);

  const getConversation = useCallback(async (conversationId: string) => {
    return db.getConversation(conversationId);
  }, []);

  const getContact = useCallback(async (contactId: string) => {
    return db.getContactById(contactId);
  }, []);

  const getUserExchangePayload = useCallback(async () => {
    if (!user) return null;
    const routingToken = await secure.getSessionKey('routing_token');
    if (!routingToken) return null;
    return {
      publicKey: user.identityPublicKey,
      routingToken,
      displayName: user.displayName,
    };
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        isOnboarded,
        isLoading,
        chatList,
        createIdentity,
        addContact,
        loadChatList,
        getMessages,
        sendMessage,
        receiveMessage,
        updateConversationSettings,
        getConversation,
        getContact,
        getUserExchangePayload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
