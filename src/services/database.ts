import * as SQLite from 'expo-sqlite';
import { Message, Contact, Conversation, User, DeliveryState } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('secondread.db');
  await initDatabase(db);
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      username TEXT,
      identity_public_key TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      contact_id TEXT PRIMARY KEY,
      display_name_local TEXT NOT NULL,
      public_key TEXT NOT NULL,
      routing_token TEXT,
      added_at INTEGER NOT NULL,
      conversation_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      conversation_id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      second_read_mode TEXT DEFAULT 'off',
      reply_assist_enabled INTEGER DEFAULT 1,
      ai_enabled INTEGER DEFAULT 0,
      redact_pii INTEGER DEFAULT 0,
      read_receipts INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      message_id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      ciphertext TEXT NOT NULL,
      nonce TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      delivery_state TEXT DEFAULT 'sending'
    );

    CREATE INDEX IF NOT EXISTS idx_messages_conversation
      ON messages(conversation_id, timestamp DESC);
  `);
}

// User operations
export async function saveUser(user: User): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO users (id, display_name, username, identity_public_key, created_at) VALUES (?, ?, ?, ?, ?)',
    [user.id, user.displayName, user.username || null, user.identityPublicKey, user.createdAt]
  );
}

export async function getUser(): Promise<User | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>('SELECT * FROM users LIMIT 1');
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    username: row.username,
    identityPublicKey: row.identity_public_key,
    createdAt: row.created_at,
  };
}

// Contact operations
export async function saveContact(contact: Contact): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO contacts (contact_id, display_name_local, public_key, routing_token, added_at, conversation_id) VALUES (?, ?, ?, ?, ?, ?)',
    [contact.contactId, contact.displayNameLocal, contact.publicKey, (contact as any).routingToken || null, contact.addedAt, contact.conversationId]
  );
}

export async function getContacts(): Promise<Contact[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>('SELECT * FROM contacts ORDER BY added_at DESC');
  return rows.map(row => ({
    contactId: row.contact_id,
    displayNameLocal: row.display_name_local,
    publicKey: row.public_key,
    addedAt: row.added_at,
    conversationId: row.conversation_id,
  }));
}

export async function getContactById(contactId: string): Promise<Contact | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>('SELECT * FROM contacts WHERE contact_id = ?', [contactId]);
  if (!row) return null;
  return {
    contactId: row.contact_id,
    displayNameLocal: row.display_name_local,
    publicKey: row.public_key,
    addedAt: row.added_at,
    conversationId: row.conversation_id,
  };
}

// Conversation operations
export async function saveConversation(conv: Conversation): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO conversations (conversation_id, contact_id, second_read_mode, reply_assist_enabled, ai_enabled, redact_pii, read_receipts) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [conv.conversationId, conv.contactId, conv.secondReadMode, conv.replyAssistEnabled ? 1 : 0, conv.aiEnabled ? 1 : 0, conv.redactPii ? 1 : 0, conv.readReceipts ? 1 : 0]
  );
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>('SELECT * FROM conversations WHERE conversation_id = ?', [conversationId]);
  if (!row) return null;
  return {
    conversationId: row.conversation_id,
    contactId: row.contact_id,
    secondReadMode: row.second_read_mode,
    replyAssistEnabled: !!row.reply_assist_enabled,
    aiEnabled: !!row.ai_enabled,
    redactPii: !!row.redact_pii,
    readReceipts: !!row.read_receipts,
  };
}

export async function updateConversationSettings(
  conversationId: string,
  settings: Partial<Omit<Conversation, 'conversationId' | 'contactId'>>
): Promise<void> {
  const database = await getDatabase();
  const updates: string[] = [];
  const values: any[] = [];

  if (settings.secondReadMode !== undefined) {
    updates.push('second_read_mode = ?');
    values.push(settings.secondReadMode);
  }
  if (settings.replyAssistEnabled !== undefined) {
    updates.push('reply_assist_enabled = ?');
    values.push(settings.replyAssistEnabled ? 1 : 0);
  }
  if (settings.aiEnabled !== undefined) {
    updates.push('ai_enabled = ?');
    values.push(settings.aiEnabled ? 1 : 0);
  }
  if (settings.redactPii !== undefined) {
    updates.push('redact_pii = ?');
    values.push(settings.redactPii ? 1 : 0);
  }
  if (settings.readReceipts !== undefined) {
    updates.push('read_receipts = ?');
    values.push(settings.readReceipts ? 1 : 0);
  }

  if (updates.length === 0) return;
  values.push(conversationId);
  await database.runAsync(
    `UPDATE conversations SET ${updates.join(', ')} WHERE conversation_id = ?`,
    values
  );
}

// Message operations
export async function saveMessage(message: Omit<Message, 'plaintext'>): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT OR REPLACE INTO messages (message_id, conversation_id, sender, ciphertext, nonce, timestamp, delivery_state) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [message.messageId, message.conversationId, message.sender, message.ciphertext, message.nonce, message.timestamp, message.deliveryState]
  );
}

export async function getMessages(conversationId: string, limit = 50, offset = 0): Promise<Omit<Message, 'plaintext'>[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT ? OFFSET ?',
    [conversationId, limit, offset]
  );
  return rows.map(row => ({
    messageId: row.message_id,
    conversationId: row.conversation_id,
    sender: row.sender,
    ciphertext: row.ciphertext,
    nonce: row.nonce,
    timestamp: row.timestamp,
    deliveryState: row.delivery_state as DeliveryState,
  })).reverse();
}

export async function updateMessageDeliveryState(messageId: string, state: DeliveryState): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE messages SET delivery_state = ? WHERE message_id = ?', [state, messageId]);
}

export async function getLastMessage(conversationId: string): Promise<Omit<Message, 'plaintext'> | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp DESC LIMIT 1',
    [conversationId]
  );
  if (!row) return null;
  return {
    messageId: row.message_id,
    conversationId: row.conversation_id,
    sender: row.sender,
    ciphertext: row.ciphertext,
    nonce: row.nonce,
    timestamp: row.timestamp,
    deliveryState: row.delivery_state as DeliveryState,
  };
}

export async function getConversationsWithLastMessage(): Promise<Array<{
  conversation: Conversation;
  contact: Contact;
  lastMessage: Omit<Message, 'plaintext'> | null;
  unreadCount: number;
}>> {
  const database = await getDatabase();
  const conversations = await database.getAllAsync<any>('SELECT * FROM conversations');

  const results = [];
  for (const conv of conversations) {
    const contact = await getContactById(conv.contact_id);
    if (!contact) continue;

    const lastMsg = await getLastMessage(conv.conversation_id);

    // Simple unread count: messages from "them" that are delivered
    const unreadRow = await database.getFirstAsync<any>(
      'SELECT COUNT(*) as count FROM messages WHERE conversation_id = ? AND sender = ?',
      [conv.conversation_id, 'them']
    );

    results.push({
      conversation: {
        conversationId: conv.conversation_id,
        contactId: conv.contact_id,
        secondReadMode: conv.second_read_mode,
        replyAssistEnabled: !!conv.reply_assist_enabled,
        aiEnabled: !!conv.ai_enabled,
        redactPii: !!conv.redact_pii,
        readReceipts: !!conv.read_receipts,
      },
      contact,
      lastMessage: lastMsg,
      unreadCount: 0,
    });
  }

  results.sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || 0;
    const bTime = b.lastMessage?.timestamp || 0;
    return bTime - aTime;
  });

  return results;
}

export async function clearAllData(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    DELETE FROM messages;
    DELETE FROM conversations;
    DELETE FROM contacts;
    DELETE FROM users;
  `);
}
