import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useApp } from '../../src/store/AppContext';
import { Conversation } from '../../src/types';
import { Colors, Spacing, FontSize } from '../../src/lib/constants';

type SecondReadMode = 'off' | 'gentle' | 'strict';

export default function ConversationSettings() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getConversation, updateConversationSettings } = useApp();

  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    if (id) loadConversation();
  }, [id]);

  async function loadConversation() {
    const conv = await getConversation(id!);
    setConversation(conv);
  }

  async function updateSetting(key: keyof Conversation, value: any) {
    if (!id) return;
    await updateConversationSettings(id, { [key]: value });
    setConversation(prev => prev ? { ...prev, [key]: value } : null);
  }

  if (!conversation) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Second Read Section */}
      <Text style={styles.sectionTitle}>Second Read</Text>
      <Text style={styles.sectionSubtitle}>
        Analyze your drafts for potential misinterpretation before sending.
      </Text>

      <View style={styles.optionGroup}>
        {(['off', 'gentle', 'strict'] as SecondReadMode[]).map(mode => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.modeOption,
              conversation.secondReadMode === mode && styles.modeOptionActive,
            ]}
            onPress={() => updateSetting('secondReadMode', mode)}
          >
            <View>
              <Text
                style={[
                  styles.modeLabel,
                  conversation.secondReadMode === mode && styles.modeLabelActive,
                ]}
              >
                {mode === 'off' ? 'Off' : mode === 'gentle' ? 'Gentle' : 'Strict'}
              </Text>
              <Text style={styles.modeDesc}>
                {mode === 'off'
                  ? 'No analysis'
                  : mode === 'gentle'
                  ? 'Only high-risk flags'
                  : 'Medium + high risk flags'}
              </Text>
            </View>
            {conversation.secondReadMode === mode && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Reply Assist Section */}
      <Text style={styles.sectionTitle}>Reply Assist</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>Help me reply</Text>
          <Text style={styles.rowDesc}>Show reply suggestions for emotionally heavy messages</Text>
        </View>
        <Switch
          value={conversation.replyAssistEnabled}
          onValueChange={(v) => updateSetting('replyAssistEnabled', v)}
          trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
          thumbColor={conversation.replyAssistEnabled ? Colors.primary : Colors.textTertiary}
        />
      </View>

      {/* AI Settings Section */}
      <Text style={styles.sectionTitle}>AI Settings</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>AI assistance</Text>
          <Text style={styles.rowDesc}>Enable Gemini-powered analysis for this chat</Text>
        </View>
        <Switch
          value={conversation.aiEnabled}
          onValueChange={(v) => updateSetting('aiEnabled', v)}
          trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
          thumbColor={conversation.aiEnabled ? Colors.primary : Colors.textTertiary}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>Redact PII before AI</Text>
          <Text style={styles.rowDesc}>Remove names, emails, and phone numbers before sending to AI</Text>
        </View>
        <Switch
          value={conversation.redactPii}
          onValueChange={(v) => updateSetting('redactPii', v)}
          trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
          thumbColor={conversation.redactPii ? Colors.primary : Colors.textTertiary}
        />
      </View>

      {/* Privacy Section */}
      <Text style={styles.sectionTitle}>Privacy</Text>
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>Read receipts</Text>
          <Text style={styles.rowDesc}>Let them know when you've read messages</Text>
        </View>
        <Switch
          value={conversation.readReceipts}
          onValueChange={(v) => updateSetting('readReceipts', v)}
          trackColor={{ false: Colors.border, true: Colors.primary + '60' }}
          thumbColor={conversation.readReceipts ? Colors.primary : Colors.textTertiary}
        />
      </View>

      <View style={styles.aiDisclaimer}>
        <Text style={styles.disclaimerText}>
          AI features use Google Gemini. Message text you explicitly choose to analyze is sent to Gemini.
          We do not store or log your messages. Messages between you and your contact remain end-to-end encrypted.
        </Text>
      </View>
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
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  optionGroup: {
    gap: Spacing.sm,
  },
  modeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeOptionActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  modeLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  modeLabelActive: {
    color: Colors.primary,
  },
  modeDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  rowContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  rowDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  aiDisclaimer: {
    marginTop: Spacing.xxl,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  disclaimerText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
});
