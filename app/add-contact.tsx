import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useApp } from '../src/store/AppContext';
import { Colors, Spacing, FontSize } from '../src/lib/constants';
import { ContactExchangePayload } from '../src/types';

export default function AddContact() {
  const { addContact } = useApp();
  const [mode, setMode] = useState<'paste' | 'scan'>('paste');
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd() {
    if (!code.trim()) {
      Alert.alert('Missing code', 'Please paste a contact code.');
      return;
    }

    setIsAdding(true);
    try {
      const payload: ContactExchangePayload = JSON.parse(code.trim());
      if (!payload.publicKey || !payload.routingToken) {
        throw new Error('Invalid contact code');
      }

      const displayName = nickname.trim() || payload.displayName || 'Unknown';
      const conversationId = await addContact(displayName, payload.publicKey, payload.routingToken);
      router.dismiss();
      router.push(`/chat/${conversationId}`);
    } catch (e: any) {
      Alert.alert('Invalid code', 'The contact code is not valid. Make sure you copied the full code.');
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add Contact</Text>
        <Text style={styles.subtitle}>
          Paste a contact code shared by the person you want to message.
        </Text>

        {/* Mode tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'paste' && styles.modeTabActive]}
            onPress={() => setMode('paste')}
          >
            <FontAwesome name="clipboard" size={14} color={mode === 'paste' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.modeTabText, mode === 'paste' && styles.modeTabTextActive]}>
              Paste Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'scan' && styles.modeTabActive]}
            onPress={() => setMode('scan')}
          >
            <FontAwesome name="qrcode" size={14} color={mode === 'scan' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.modeTabText, mode === 'scan' && styles.modeTabTextActive]}>
              Scan QR
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'paste' ? (
          <>
            <Text style={styles.label}>Contact Code</Text>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              placeholder='Paste the contact code here...'
              placeholderTextColor={Colors.textTertiary}
              multiline
              numberOfLines={4}
              autoCorrect={false}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Nickname (optional, local only)</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="How you want to see this contact"
              placeholderTextColor={Colors.textTertiary}
              maxLength={30}
            />

            <TouchableOpacity
              style={[styles.addButton, (!code.trim() || isAdding) && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={!code.trim() || isAdding}
            >
              <Text style={styles.addButtonText}>
                {isAdding ? 'Adding...' : 'Add Contact'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.scanPlaceholder}>
            <FontAwesome name="camera" size={48} color={Colors.textTertiary} />
            <Text style={styles.scanText}>
              Camera QR scanning requires a development build.{'\n'}
              Use "Paste Code" for now.
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
    lineHeight: 20,
  },
  modeTabs: {
    flexDirection: 'row',
    marginBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeTabActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  modeTabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: Spacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.xxl,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  scanPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
  },
  scanText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 20,
  },
});
