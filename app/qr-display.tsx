import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useApp } from '../src/store/AppContext';
import { Colors, Spacing, FontSize } from '../src/lib/constants';

export default function QRDisplay() {
  const { getUserExchangePayload } = useApp();
  const [payload, setPayload] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadPayload();
  }, []);

  async function loadPayload() {
    const data = await getUserExchangePayload();
    if (data) {
      setPayload(JSON.stringify(data));
    }
  }

  async function handleCopy() {
    await Clipboard.setStringAsync(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Add me on Second Read: ${payload}`,
      });
    } catch (e) {
      // User cancelled
    }
  }

  function handleContinue() {
    router.replace('/(main)');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Contact</Text>
      <Text style={styles.subtitle}>
        Others can scan this QR code or use your contact link to message you.
      </Text>

      <View style={styles.qrContainer}>
        {payload ? (
          <QRCode value={payload} size={200} backgroundColor="white" color={Colors.text} />
        ) : (
          <Text style={styles.loading}>Generating...</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionButtonText}>Share Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonOutline} onPress={handleCopy}>
          <Text style={styles.actionButtonOutlineText}>
            {copied ? 'Copied!' : 'Copy Code'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue to Chats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
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
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    lineHeight: 20,
  },
  qrContainer: {
    padding: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  loading: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xxxl,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  actionButtonOutline: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  actionButtonOutlineText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  continueButton: {
    paddingVertical: Spacing.md,
  },
  continueText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
});
