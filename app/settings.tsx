import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useApp } from '../src/store/AppContext';
import { Colors, Spacing, FontSize } from '../src/lib/constants';
import {
  getGeminiApiKey,
  storeGeminiApiKey,
  clearAllSecureData,
} from '../src/services/secure-storage';
import { clearAllData as clearDbData } from '../src/services/database';

export default function Settings() {
  const { user, getUserExchangePayload } = useApp();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    loadApiKey();
  }, []);

  async function loadApiKey() {
    const key = await getGeminiApiKey();
    if (key) {
      setApiKey(key);
      setSavedKey(true);
    }
  }

  async function handleSaveKey() {
    if (!apiKey.trim()) return;
    await storeGeminiApiKey(apiKey.trim());
    setSavedKey(true);
    Alert.alert('Saved', 'Gemini API key saved securely.');
  }

  async function handleShowQR() {
    router.push('/qr-display');
  }

  async function handleClearData() {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all messages, contacts, and your identity. You cannot undo this.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearDbData();
            await clearAllSecureData();
            // Force restart by navigating to index
            router.replace('/');
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Identity Section */}
      <Text style={styles.sectionTitle}>Your Identity</Text>
      <View style={styles.card}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.displayName}>{user?.displayName || 'Unknown'}</Text>
            {user?.username && (
              <Text style={styles.username}>@{user.username}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.qrButton} onPress={handleShowQR}>
          <FontAwesome name="qrcode" size={16} color={Colors.primary} />
          <Text style={styles.qrButtonText}>Show QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* AI Settings */}
      <Text style={styles.sectionTitle}>AI Settings</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Gemini API Key</Text>
        <Text style={styles.cardDesc}>
          Required for Second Read and Reply Assist features.
          Get a key from Google AI Studio.
        </Text>
        <View style={styles.keyRow}>
          <TextInput
            style={styles.keyInput}
            value={apiKey}
            onChangeText={(v) => { setApiKey(v); setSavedKey(false); }}
            placeholder="Enter your Gemini API key"
            placeholderTextColor={Colors.textTertiary}
            secureTextEntry={!showKey}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowKey(!showKey)}>
            <FontAwesome
              name={showKey ? 'eye-slash' : 'eye'}
              size={16}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.saveKeyBtn, (!apiKey.trim() || savedKey) && styles.saveKeyBtnDisabled]}
          onPress={handleSaveKey}
          disabled={!apiKey.trim() || savedKey}
        >
          <Text style={styles.saveKeyBtnText}>
            {savedKey ? 'Saved' : 'Save Key'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Encryption */}
      <Text style={styles.sectionTitle}>About Encryption</Text>
      <View style={styles.card}>
        <Text style={styles.cardDesc}>
          Messages between you and your contacts are end-to-end encrypted using NaCl
          public-key cryptography. Messages are stored locally on your device as encrypted blobs.
          The relay server only routes encrypted payloads and does not store message content.
        </Text>
        <View style={styles.limitationBox}>
          <Text style={styles.limitationTitle}>MVP Limitations</Text>
          <Text style={styles.limitationText}>
            • Forward secrecy (Double Ratchet) is planned for a future version{'\n'}
            • Currently uses static key pairs per identity{'\n'}
            • No multi-device sync yet
          </Text>
        </View>
      </View>

      {/* AI Disclaimer */}
      <Text style={styles.sectionTitle}>AI Privacy</Text>
      <View style={styles.card}>
        <Text style={styles.cardDesc}>
          Messages are E2EE between users. AI suggestions are generated from the text you
          explicitly choose to analyze, and we don't store or log that text.
        </Text>
        <Text style={[styles.cardDesc, { marginTop: Spacing.sm }]}>
          • Second Read and Reply Assist are opt-in per conversation{'\n'}
          • Only the relevant message text is sent to Gemini{'\n'}
          • PII redaction can be enabled per conversation{'\n'}
          • Full chat history is never sent
        </Text>
      </View>

      {/* Danger Zone */}
      <Text style={styles.sectionTitle}>Data</Text>
      <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
        <FontAwesome name="trash" size={16} color={Colors.danger} />
        <Text style={styles.dangerButtonText}>Clear All Local Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.xxxl * 2,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  displayName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  username: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  qrButtonText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  cardLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  keyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  saveKeyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  saveKeyBtnDisabled: {
    backgroundColor: Colors.border,
  },
  saveKeyBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  limitationBox: {
    backgroundColor: Colors.warningLight,
    borderRadius: 8,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  limitationTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  limitationText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.danger,
  },
});
