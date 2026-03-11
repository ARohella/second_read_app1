// Firebase relay service
// This module handles message routing through Firestore.
// The server is a "dumb pipe" — it only routes encrypted payloads.

// NOTE: Firebase requires native configuration files (google-services.json / GoogleService-Info.plist).
// For MVP development, we use a lightweight Firestore REST-like approach.
// Replace with @react-native-firebase/firestore when building with EAS.

import AsyncStorage from '@react-native-async-storage/async-storage';

// For MVP without native Firebase config, we use a simple polling approach
// with AsyncStorage as a local message queue simulation.
// In production, replace this with actual Firestore listeners.

interface RelayMessage {
  id: string;
  senderId: string;
  recipientId: string;
  ciphertext: string;
  nonce: string;
  timestamp: number;
}

type MessageListener = (message: RelayMessage) => void;

let listeners: Map<string, MessageListener[]> = new Map();

// Store for routing tokens -> user IDs
const ROUTING_KEY = 'routing_tokens';
const PENDING_KEY = 'pending_messages';

export async function registerRoutingToken(userId: string, routingToken: string): Promise<void> {
  const existing = await AsyncStorage.getItem(ROUTING_KEY);
  const tokens = existing ? JSON.parse(existing) : {};
  tokens[routingToken] = userId;
  await AsyncStorage.setItem(ROUTING_KEY, JSON.stringify(tokens));
}

export async function sendMessageRelay(
  senderId: string,
  recipientRoutingToken: string,
  ciphertext: string,
  nonce: string,
  messageId: string
): Promise<void> {
  const message: RelayMessage = {
    id: messageId,
    senderId,
    recipientId: recipientRoutingToken,
    ciphertext,
    nonce,
    timestamp: Date.now(),
  };

  // Store in pending messages (simulates Firestore write)
  const existing = await AsyncStorage.getItem(PENDING_KEY);
  const pending: RelayMessage[] = existing ? JSON.parse(existing) : [];
  pending.push(message);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending));

  // Notify local listeners (for same-device testing)
  const recipientListeners = listeners.get(recipientRoutingToken) || [];
  recipientListeners.forEach(listener => listener(message));
}

export function subscribeToMessages(
  routingToken: string,
  callback: MessageListener
): () => void {
  const existing = listeners.get(routingToken) || [];
  existing.push(callback);
  listeners.set(routingToken, existing);

  // Also check for any pending messages
  checkPendingMessages(routingToken, callback);

  return () => {
    const current = listeners.get(routingToken) || [];
    listeners.set(
      routingToken,
      current.filter(l => l !== callback)
    );
  };
}

async function checkPendingMessages(routingToken: string, callback: MessageListener) {
  try {
    const existing = await AsyncStorage.getItem(PENDING_KEY);
    if (!existing) return;

    const pending: RelayMessage[] = JSON.parse(existing);
    const mine = pending.filter(m => m.recipientId === routingToken);
    const rest = pending.filter(m => m.recipientId !== routingToken);

    if (mine.length > 0) {
      await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(rest));
      mine.forEach(msg => callback(msg));
    }
  } catch (e) {
    console.error('Error checking pending messages:', e);
  }
}

export async function getPendingMessages(routingToken: string): Promise<RelayMessage[]> {
  const existing = await AsyncStorage.getItem(PENDING_KEY);
  if (!existing) return [];
  const pending: RelayMessage[] = JSON.parse(existing);
  const mine = pending.filter(m => m.recipientId === routingToken);
  const rest = pending.filter(m => m.recipientId !== routingToken);
  await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(rest));
  return mine;
}
