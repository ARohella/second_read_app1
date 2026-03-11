export interface User {
  id: string;
  displayName: string;
  username?: string;
  identityPublicKey: string;
  createdAt: number;
}

export interface Contact {
  contactId: string;
  displayNameLocal: string;
  publicKey: string;
  addedAt: number;
  conversationId: string;
}

export interface Conversation {
  conversationId: string;
  contactId: string;
  secondReadMode: 'off' | 'gentle' | 'strict';
  replyAssistEnabled: boolean;
  aiEnabled: boolean;
  redactPii: boolean;
  readReceipts: boolean;
}

export type DeliveryState = 'sending' | 'sent' | 'delivered';

export interface Message {
  messageId: string;
  conversationId: string;
  sender: 'me' | 'them';
  ciphertext: string;
  nonce: string;
  timestamp: number;
  deliveryState: DeliveryState;
  plaintext?: string; // only in memory, never persisted
}

export interface SecondReadResult {
  riskLevel: 'low' | 'medium' | 'high';
  riskReason: string[];
  suggestions: string[];
}

export interface ReplyAssistResult {
  theirFeelings: string[];
  theirNeeds: string[];
  theirRequest: string;
  replyDrafts: {
    label: string;
    text: string;
  }[];
  avoidList: string[];
  includeList: string[];
}

export type ReplyIntent =
  | 'apologize'
  | 'clarify'
  | 'repair'
  | 'set_boundary'
  | 'de_escalate';

export type TonePreference = 'warmer' | 'balanced' | 'direct';

export interface ContactExchangePayload {
  publicKey: string;
  routingToken: string;
  displayName: string;
}
