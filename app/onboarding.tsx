import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useApp } from '../src/store/AppContext';
import { Colors, Spacing, FontSize } from '../src/lib/constants';

export default function Onboarding() {
  const { createIdentity } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    if (!displayName.trim()) {
      Alert.alert('Display name required', 'Please enter a display name.');
      return;
    }

    setIsCreating(true);
    try {
      await createIdentity(displayName.trim(), username.trim() || undefined);
      // Skip QR screen for demo, go straight to chats
      router.replace('/(main)');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create identity.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome name="shield" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.logo}>Create Your Identity</Text>
            <Text style={styles.subtitle}>
              Choose how you appear to others. Your data is protected by E2EE and AI-powered tone safety.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Display Name (Required)</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="e.g., Jane Doe"
              placeholderTextColor={Colors.textSecondary}
              autoFocus
              maxLength={30}
            />

            <Text style={styles.label}>Username (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <FontAwesome name="at" size={16} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIconText}
                value={username}
                onChangeText={setUsername}
                placeholder="unique_handle"
                placeholderTextColor={Colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>

            <Text style={styles.privacyNote}>
              <FontAwesome name="info-circle" size={10} color={Colors.textSecondary} /> Usernames help people find you without your phone number.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !displayName.trim() && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={!displayName.trim() || isCreating}
          >
            <Text style={styles.buttonText}>
              {isCreating ? 'Creating identity...' : 'Create Identity'}
            </Text>
            <FontAwesome name="arrow-right" size={16} color={Colors.sentText} />
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.privacyLink}>
              <FontAwesome name="lock" size={12} color={Colors.primary} />
              <Text style={styles.privacyLinkText}>Privacy details</Text>
            </TouchableOpacity>
            <View style={styles.e2eeBadge}>
              <View style={styles.badgeLine} />
              <Text style={styles.e2eeText}>END-TO-END ENCRYPTED</Text>
              <View style={styles.badgeLine} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
    paddingBottom: Spacing.xxxl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    marginBottom: Spacing.xxxl,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingLeft: Spacing.lg,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  inputWithIconText: {
    flex: 1,
    paddingVertical: Spacing.md + 2,
    paddingRight: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  privacyNote: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    lineHeight: 16,
    marginLeft: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.sentText,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  footer: {
    marginTop: Spacing.xxxl,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  privacyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  privacyLinkText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  e2eeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    opacity: 0.6,
  },
  badgeLine: {
    width: 32,
    height: 1,
    backgroundColor: Colors.border,
  },
  e2eeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
  },
});
