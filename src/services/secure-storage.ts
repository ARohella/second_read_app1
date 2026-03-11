import * as SecureStore from 'expo-secure-store';

const KEYS = {
  IDENTITY_PRIVATE_KEY: 'identity_private_key',
  IDENTITY_PUBLIC_KEY: 'identity_public_key',
  DB_ENCRYPTION_KEY: 'db_encryption_key',
  USER_ID: 'user_id',
  ONBOARDED: 'onboarded',
  GEMINI_API_KEY: 'gemini_api_key',
  AI_DISCLOSURE_SHOWN: 'ai_disclosure_shown',
} as const;

export async function storeIdentityKeys(publicKey: string, secretKey: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.IDENTITY_PUBLIC_KEY, publicKey);
  await SecureStore.setItemAsync(KEYS.IDENTITY_PRIVATE_KEY, secretKey);
}

export async function getIdentityPublicKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.IDENTITY_PUBLIC_KEY);
}

export async function getIdentityPrivateKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.IDENTITY_PRIVATE_KEY);
}

export async function storeSessionKey(conversationId: string, key: string): Promise<void> {
  await SecureStore.setItemAsync(`session_${conversationId}`, key);
}

export async function getSessionKey(conversationId: string): Promise<string | null> {
  return SecureStore.getItemAsync(`session_${conversationId}`);
}

export async function storeUserId(id: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.USER_ID, id);
}

export async function getUserId(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.USER_ID);
}

export async function setOnboarded(value: boolean): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ONBOARDED, value ? 'true' : 'false');
}

export async function isOnboarded(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(KEYS.ONBOARDED);
  return val === 'true';
}

export async function storeGeminiApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.GEMINI_API_KEY, key);
}

export async function getGeminiApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.GEMINI_API_KEY);
}

export async function setAiDisclosureShown(): Promise<void> {
  await SecureStore.setItemAsync(KEYS.AI_DISCLOSURE_SHOWN, 'true');
}

export async function hasAiDisclosureBeenShown(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(KEYS.AI_DISCLOSURE_SHOWN);
  return val === 'true';
}

export async function clearAllSecureData(): Promise<void> {
  for (const key of Object.values(KEYS)) {
    await SecureStore.deleteItemAsync(key);
  }
}
