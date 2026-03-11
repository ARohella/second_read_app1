import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

export function generateSessionKey(): string {
  const key = nacl.randomBytes(nacl.secretbox.keyLength);
  return naclUtil.encodeBase64(key);
}

export function encryptMessage(
  plaintext: string,
  theirPublicKey: string,
  mySecretKey: string
): { ciphertext: string; nonce: string } {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageBytes = naclUtil.decodeUTF8(plaintext);
  const theirPubKeyBytes = naclUtil.decodeBase64(theirPublicKey);
  const mySecKeyBytes = naclUtil.decodeBase64(mySecretKey);

  const encrypted = nacl.box(messageBytes, nonce, theirPubKeyBytes, mySecKeyBytes);
  if (!encrypted) throw new Error('Encryption failed');

  return {
    ciphertext: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptMessage(
  ciphertext: string,
  nonce: string,
  theirPublicKey: string,
  mySecretKey: string
): string {
  const ciphertextBytes = naclUtil.decodeBase64(ciphertext);
  const nonceBytes = naclUtil.decodeBase64(nonce);
  const theirPubKeyBytes = naclUtil.decodeBase64(theirPublicKey);
  const mySecKeyBytes = naclUtil.decodeBase64(mySecretKey);

  const decrypted = nacl.box.open(ciphertextBytes, nonceBytes, theirPubKeyBytes, mySecKeyBytes);
  if (!decrypted) throw new Error('Decryption failed');

  return naclUtil.encodeUTF8(decrypted);
}

export function encryptLocal(plaintext: string, keyBase64: string): { ciphertext: string; nonce: string } {
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageBytes = naclUtil.decodeUTF8(plaintext);
  const keyBytes = naclUtil.decodeBase64(keyBase64);

  const encrypted = nacl.secretbox(messageBytes, nonce, keyBytes);
  if (!encrypted) throw new Error('Local encryption failed');

  return {
    ciphertext: naclUtil.encodeBase64(encrypted),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

export function decryptLocal(ciphertext: string, nonce: string, keyBase64: string): string {
  const ciphertextBytes = naclUtil.decodeBase64(ciphertext);
  const nonceBytes = naclUtil.decodeBase64(nonce);
  const keyBytes = naclUtil.decodeBase64(keyBase64);

  const decrypted = nacl.secretbox.open(ciphertextBytes, nonceBytes, keyBytes);
  if (!decrypted) throw new Error('Local decryption failed');

  return naclUtil.encodeUTF8(decrypted);
}

export function generateRoutingToken(): string {
  return naclUtil.encodeBase64(nacl.randomBytes(16));
}
