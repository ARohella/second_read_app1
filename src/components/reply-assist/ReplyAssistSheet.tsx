import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReplyAssistResult, ReplyIntent, TonePreference } from '../../types';
import { Colors, Spacing, FontSize } from '../../lib/constants';

interface Props {
  result: ReplyAssistResult | null;
  isLoading: boolean;
  selectedIntent: ReplyIntent;
  selectedTone: TonePreference;
  onIntentChange: (intent: ReplyIntent) => void;
  onToneChange: (tone: TonePreference) => void;
  onSelectDraft: (text: string) => void;
  onClose: () => void;
  onRegenerate: () => void;
}

const INTENTS: { value: ReplyIntent; label: string; icon: string }[] = [
  { value: 'de_escalate', label: 'Validate', icon: 'heart' },
  { value: 'apologize', label: 'Apologize', icon: 'hand-peace-o' },
  { value: 'clarify', label: 'Clarify', icon: 'search' },
  { value: 'set_boundary', label: 'Boundary', icon: 'shield' },
];

type Tab = 'summary' | 'drafts' | 'checklist';

export default function ReplyAssistSheet({
  result,
  isLoading,
  selectedIntent,
  selectedTone,
  onIntentChange,
  onToneChange,
  onSelectDraft,
  onClose,
  onRegenerate,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <FontAwesome name="lock" size={18} color={Colors.primary} />
        <Text style={styles.title}>Reply Assist</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <FontAwesome name="close" size={18} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.intentRow} contentContainerStyle={styles.intentContent}>
        {INTENTS.map(intent => (
          <TouchableOpacity
            key={intent.value}
            style={[
              styles.intentChip,
              selectedIntent === intent.value && styles.intentChipActive,
            ]}
            onPress={() => onIntentChange(intent.value)}
          >
            {selectedIntent === intent.value ? (
              <FontAwesome name={intent.icon as any} size={14} color={Colors.sentText} />
            ) : (
              <FontAwesome name={intent.icon as any} size={14} color={Colors.primary} />
            )}
            <Text
              style={[
                styles.intentText,
                selectedIntent === intent.value && styles.intentTextActive,
              ]}
            >
              {intent.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.tabs}>
        {(['summary', 'drafts', 'checklist'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'summary' ? 'Summary' : tab === 'drafts' ? 'Drafts' : 'Checklist'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.loadingText}>Analyzing message...</Text>
          </View>
        ) : result ? (
          <>
            {activeTab === 'summary' && (
              <View>
                <View style={styles.sectionHeader}>
                  <FontAwesome name="lightbulb-o" size={16} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>Emotional Landscape</Text>
                </View>
                <Text style={styles.sectionSubtitle}>Detected from the received message</Text>

                <View style={styles.chipRow}>
                  {result.theirFeelings.map((feeling, i) => (
                    <View key={i} style={[styles.feelingChip, i === 0 ? styles.feelingChipRed : i === 1 ? styles.feelingChipOrange : styles.feelingChipBlue]}>
                      <View style={[styles.dot, i === 0 ? styles.dotRed : i === 1 ? styles.dotOrange : styles.dotBlue]} />
                      <Text style={[styles.feelingText, i === 0 ? styles.feelingTextRed : i === 1 ? styles.feelingTextOrange : styles.feelingTextBlue]}>{feeling}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.needsBox}>
                  <View style={styles.needsHeader}>
                    <FontAwesome name="flash" size={14} color={Colors.primary} />
                    <Text style={styles.needsTitle}>UNDERLYING NEEDS</Text>
                  </View>
                  {result.theirNeeds.map((need, i) => (
                    <View key={i} style={styles.needRow}>
                      <FontAwesome name="check-circle" size={14} color={Colors.primary} style={styles.checkIcon} />
                      <Text style={styles.needText}>
                        <Text style={styles.needBold}>{need.split(':')[0]}:</Text>
                        {need.includes(':') ? need.split(':').slice(1).join(':') : need}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'drafts' && (
              <View>
                <Text style={styles.draftsTitle}>Draft Options</Text>
                {result.replyDrafts.map((draft, i) => (
                  <View key={i} style={styles.draftCard}>
                    <View style={styles.draftHeader}>
                      <View style={[styles.draftBadge, i === 0 ? styles.draftBadgeBlue : i === 1 ? styles.draftBadgePurple : styles.draftBadgeGreen]}>
                        <Text style={[styles.draftBadgeText, i === 0 ? styles.draftBadgeTextBlue : i === 1 ? styles.draftBadgeTextPurple : styles.draftBadgeTextGreen]}>
                          {draft.label.toUpperCase()}
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.copyBtn}>
                        <FontAwesome name="copy" size={12} color={Colors.primary} />
                        <Text style={styles.copyText}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.draftText}>"{draft.text}"</Text>
                    <TouchableOpacity
                      style={styles.useDraftBtn}
                      onPress={() => onSelectDraft(draft.text)}
                    >
                      <Text style={styles.useDraftText}>Use this draft</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'checklist' && (
              <View>
                <Text style={styles.checklistTitle}>Do / Don't</Text>
                <View style={styles.checklistSection}>
                  <Text style={styles.checklistSectionTitle}>Avoid</Text>
                  {result.avoidList.map((item, i) => (
                    <View key={i} style={styles.checklistItem}>
                      <FontAwesome name="close" size={14} color={Colors.danger} style={styles.checklistIcon} />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.checklistSection}>
                  <Text style={styles.checklistSectionTitle}>Include</Text>
                  {result.includeList.map((item, i) => (
                    <View key={i} style={styles.checklistItem}>
                      <FontAwesome name="check" size={14} color={Colors.success} style={styles.checklistIcon} />
                      <Text style={styles.checklistText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.loadingText}>Select your intent and tap regenerate to start.</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.e2eeBadge}>
          <FontAwesome name="shield" size={10} color={Colors.primary} />
          <Text style={styles.e2eeText}>END-TO-END ENCRYPTED ANALYSIS</Text>
        </View>
      </View>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  handle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    position: 'absolute',
    right: Spacing.lg,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  intentRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    flexGrow: 0,
  },
  intentContent: {
    gap: Spacing.sm,
  },
  intentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intentChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  intentText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  intentTextActive: {
    color: Colors.sentText,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl * 2,
  },
  loadingText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  feelingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  feelingChipRed: {
    backgroundColor: '#3d1a1a',
    borderColor: '#5a2020',
  },
  feelingChipOrange: {
    backgroundColor: '#3d2d1a',
    borderColor: '#5a4420',
  },
  feelingChipBlue: {
    backgroundColor: '#1a2d3d',
    borderColor: '#20445a',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotRed: {
    backgroundColor: Colors.danger,
  },
  dotOrange: {
    backgroundColor: Colors.warning,
  },
  dotBlue: {
    backgroundColor: '#60A5FA',
  },
  feelingText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  feelingTextRed: {
    color: '#FCA5A5',
  },
  feelingTextOrange: {
    color: '#FCD34D',
  },
  feelingTextBlue: {
    color: '#93C5FD',
  },
  needsBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  needsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  needsTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  needRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  checkIcon: {
    marginTop: 2,
    marginRight: Spacing.sm,
  },
  needText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  needBold: {
    fontWeight: '700',
    color: Colors.text,
  },
  draftsTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  draftCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  draftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  draftBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  draftBadgeBlue: {
    backgroundColor: '#1e3a8a20',
  },
  draftBadgePurple: {
    backgroundColor: '#5b21b620',
  },
  draftBadgeGreen: {
    backgroundColor: Colors.primaryLight,
  },
  draftBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  draftBadgeTextBlue: {
    color: '#60A5FA',
  },
  draftBadgeTextPurple: {
    color: '#C084FC',
  },
  draftBadgeTextGreen: {
    color: Colors.primary,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  copyText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  draftText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  useDraftBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  useDraftText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  checklistTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  checklistSection: {
    marginBottom: Spacing.xxl,
  },
  checklistSectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  checklistIcon: {
    marginTop: 2,
    marginRight: Spacing.sm,
  },
  checklistText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  e2eeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    opacity: 0.6,
  },
  e2eeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.5,
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 128,
    height: 4,
    backgroundColor: Colors.textTertiary + '40',
    borderRadius: 2,
    marginBottom: Spacing.sm,
  },
});
