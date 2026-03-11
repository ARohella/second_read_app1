import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SecondReadResult } from '../../types';
import { Colors, Spacing, FontSize } from '../../lib/constants';

interface Props {
  result: SecondReadResult;
  onSendAnyway: () => void;
  onApplyEdit: (suggestion: string) => void;
  onDismiss: () => void;
  onTurnOff: () => void;
}

export default function SecondReadCard({
  result,
  onSendAnyway,
  onApplyEdit,
  onDismiss,
  onTurnOff,
}: Props) {
  const riskColors = {
    high: { bg: Colors.riskHighBg, text: Colors.riskHigh, label: 'Might sound blunt' },
    medium: { bg: Colors.riskMediumBg, text: Colors.riskMedium, label: 'Could be misinterpreted' },
    low: { bg: Colors.riskLowBg, text: Colors.riskLow, label: 'Looks fine' },
  };

  const risk = riskColors[result.riskLevel];

  return (
    <View style={[styles.container, { backgroundColor: risk.bg, borderColor: risk.text + '40' }]}>
      <View style={styles.header}>
        <FontAwesome name="magic" size={14} color={Colors.primary} style={styles.icon} />
        <Text style={styles.aiLabel}>SECOND READ AI</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.dismiss}>×</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.riskTitle}>{risk.label}</Text>

      {result.riskReason.length > 0 && (
        <View style={styles.reasons}>
          <Text style={styles.reasonLabel}>
            <Text style={styles.reasonLabelBold}>Why:</Text>{' '}
            {result.riskReason.join('. ')}
          </Text>
        </View>
      )}

      {result.suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {result.suggestions.map((suggestion, i) => (
              <TouchableOpacity
                key={i}
                style={styles.chip}
                onPress={() => onApplyEdit(suggestion)}
              >
                <Text style={styles.chipText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onTurnOff}>
          <Text style={styles.turnOffText}>Turn off for this chat</Text>
        </TouchableOpacity>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.sendAnywayBtn} onPress={onSendAnyway}>
            <Text style={styles.sendAnywayText}>Send anyway</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={() => result.suggestions[0] && onApplyEdit(result.suggestions[0])}>
            <Text style={styles.applyText}>Apply Suggestion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  icon: {
    marginRight: 6,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  dismiss: {
    fontSize: 24,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontWeight: '300',
  },
  riskTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reasons: {
    marginBottom: Spacing.md,
  },
  reasonLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  reasonLabelBold: {
    fontWeight: '700',
    color: Colors.primary,
  },
  suggestions: {
    marginBottom: Spacing.md,
  },
  chipScroll: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  actions: {
    marginTop: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  sendAnywayBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendAnywayText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  applyText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.sentText,
  },
  turnOffText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
