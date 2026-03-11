import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors, Spacing, FontSize, DEMO_MODE } from '../../src/lib/constants';
import { DEMO_MESSAGES, DEMO_SECOND_READ, DEMO_REPLY_ASSIST } from '../../src/lib/demo-data';
import SecondReadCard from '../../src/components/second-read/SecondReadCard';
import ReplyAssistSheet from '../../src/components/reply-assist/ReplyAssistSheet';
import { analyzeSecondRead, analyzeReplyAssist, isSensitiveMessage } from '../../src/services/ai';
import { SecondReadResult, ReplyAssistResult } from '../../src/types';

interface DemoMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: number;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [text, setText] = useState('');
  const [contactName, setContactName] = useState('');
  const [showSecondRead, setShowSecondRead] = useState(false);
  const [secondReadResult, setSecondReadResult] = useState<SecondReadResult | null>(null);
  const [secondReadLoading, setSecondReadLoading] = useState(false);
  const [showReplyAssist, setShowReplyAssist] = useState(false);
  const [replyAssistResult, setReplyAssistResult] = useState<ReplyAssistResult | null>(null);
  const [replyAssistLoading, setReplyAssistLoading] = useState(false);
  const [replyIntent, setReplyIntent] = useState<any>('de_escalate');
  const [replyTone, setReplyTone] = useState<any>('balanced');
  const [selectedMessageForReply, setSelectedMessageForReply] = useState<string>('');

  const flatListRef = useRef<FlatList>(null);
  const aiCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load demo messages on mount
  useEffect(() => {
    if (id) {
      if (id === 'emma-girlfriend') {
        setMessages(DEMO_MESSAGES['emma-girlfriend']);
        setContactName('Emma');
      } else if (id === 'alex-coworker') {
        setMessages(DEMO_MESSAGES['alex-coworker']);
        setContactName('Alex Rivera');
      }
    }
  }, [id]);

  // Analyze text for Second Read as user types (with debounce)
  useEffect(() => {
    if (aiCheckTimer.current) {
      clearTimeout(aiCheckTimer.current);
    }

    if (text.trim().length > 10) {
      aiCheckTimer.current = setTimeout(async () => {
        setSecondReadLoading(true);
        try {
          let result;
          if (DEMO_MODE) {
            // Use demo response for certain trigger phrases
            const lowerText = text.toLowerCase();

            // Alex (coworker) triggers: defensive/blunt phrases
            if (id === 'alex-coworker' && (
              lowerText.includes('finish') ||
              lowerText.includes('stop') ||
              lowerText.includes('can') ||
              lowerText.includes('later') ||
              lowerText.includes('busy')
            )) {
              result = DEMO_SECOND_READ;
            }

            // Emma (girlfriend) triggers: dismissive/short phrases
            if (id === 'emma-girlfriend' && (
              lowerText.includes('fine') ||
              lowerText.includes('whatever') ||
              lowerText.includes('not now') ||
              lowerText.includes('deal with it') ||
              lowerText.includes('overreacting')
            )) {
              result = DEMO_SECOND_READ;
            }
          } else {
            result = await analyzeSecondRead(text, 'gentle', false);
          }

          if (result) {
            setSecondReadResult(result);
            setShowSecondRead(true);
          } else {
            setShowSecondRead(false);
            setSecondReadResult(null);
          }
        } catch (error) {
          console.error('Second Read error:', error);
          Alert.alert('AI Error', 'Failed to analyze message. Please try again.');
        }
        setSecondReadLoading(false);
      }, 1000); // 1 second debounce
    } else {
      setShowSecondRead(false);
      setSecondReadResult(null);
    }

    return () => {
      if (aiCheckTimer.current) {
        clearTimeout(aiCheckTimer.current);
      }
    };
  }, [text]);

  function handleSend() {
    if (!text.trim()) return;
    const newMsg: DemoMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: text.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMsg]);
    setText('');
    setShowSecondRead(false);
    setSecondReadResult(null);
  }

  async function handleHelpReply(messageText: string) {
    setSelectedMessageForReply(messageText);
    setShowReplyAssist(true);
    setReplyAssistLoading(true);

    try {
      let result;
      if (DEMO_MODE) {
        // Use demo response for emotional messages
        result = DEMO_REPLY_ASSIST;
      } else {
        result = await analyzeReplyAssist(messageText, replyIntent, replyTone, false);
      }
      setReplyAssistResult(result);
    } catch (error) {
      console.error('Reply Assist error:', error);
      Alert.alert('AI Error', 'Failed to generate reply suggestions. Please try again.');
    }
    setReplyAssistLoading(false);
  }

  async function handleRegenerateReply() {
    if (!selectedMessageForReply) return;
    setReplyAssistLoading(true);

    try {
      let result;
      if (DEMO_MODE) {
        // Use demo response for emotional messages
        result = DEMO_REPLY_ASSIST;
      } else {
        result = await analyzeReplyAssist(selectedMessageForReply, replyIntent, replyTone, false);
      }
      setReplyAssistResult(result);
    } catch (error) {
      console.error('Reply Assist error:', error);
      Alert.alert('AI Error', 'Failed to generate reply suggestions.');
    }
    setReplyAssistLoading(false);
  }

  function handleSelectDraft(draftText: string) {
    setText(draftText);
    setShowReplyAssist(false);
  }

  function renderMessage({ item }: { item: DemoMessage }) {
    const isMe = item.sender === 'me';

    // Show "Help me reply" button on the last incoming message if it's sensitive
    const showHelpButton =
      !isMe &&
      messages.indexOf(item) === messages.length - 1 &&
      isSensitiveMessage(item.text);

    return (
      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
            {item.text}
          </Text>
          <Text style={[styles.timestamp, isMe && styles.timestampMe]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {showHelpButton && (
          <TouchableOpacity style={styles.helpReplyBtn} onPress={() => handleHelpReply(item.text)}>
            <FontAwesome name="magic" size={12} color={Colors.primary} />
            <Text style={styles.helpReplyText}>Help me reply</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome name="chevron-left" size={16} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerName} numberOfLines={1}>
            {contactName}
          </Text>
          <View style={styles.encryptedBadge}>
            <FontAwesome name="lock" size={10} color={Colors.primary} />
            <Text style={styles.encryptedText}>E2EE</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Chat Settings', 'AI tone analysis enabled')}>
          <FontAwesome name="ellipsis-v" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {showSecondRead && secondReadResult && (
          <SecondReadCard
            result={secondReadResult}
            onSendAnyway={handleSend}
            onApplyEdit={(suggestion) => setText(suggestion)}
            onDismiss={() => setShowSecondRead(false)}
            onTurnOff={() => {
              setShowSecondRead(false);
              Alert.alert('Second Read Disabled', 'Tone analysis disabled for this chat.');
            }}
          />
        )}

        {secondReadLoading && (
          <View style={styles.aiLoadingCard}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.aiLoadingText}>Analyzing tone...</Text>
          </View>
        )}

        <View style={styles.composer}>
          <TouchableOpacity style={styles.attachBtn}>
            <FontAwesome name="plus-circle" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Message"
              placeholderTextColor={Colors.textSecondary}
              multiline
              maxLength={5000}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <FontAwesome name="arrow-up" size={18} color={Colors.sentText} />
          </TouchableOpacity>
        </View>

        <View style={styles.homeIndicator} />
      </KeyboardAvoidingView>

      <Modal
        visible={showReplyAssist}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReplyAssist(false)}
      >
        <ReplyAssistSheet
          result={replyAssistResult}
          isLoading={replyAssistLoading}
          selectedIntent={replyIntent}
          selectedTone={replyTone}
          onIntentChange={(newIntent) => {
            setReplyIntent(newIntent);
            handleRegenerateReply();
          }}
          onToneChange={(newTone) => {
            setReplyTone(newTone);
            handleRegenerateReply();
          }}
          onSelectDraft={handleSelectDraft}
          onClose={() => setShowReplyAssist(false)}
          onRegenerate={handleRegenerateReply}
        />
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: {
    paddingRight: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  encryptedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  messageRow: {
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  messageRowMe: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  bubbleMe: {
    backgroundColor: Colors.sent,
    borderBottomRightRadius: 6,
  },
  bubbleThem: {
    backgroundColor: Colors.received,
    borderBottomLeftRadius: 6,
  },
  bubbleText: {
    fontSize: FontSize.md,
    lineHeight: 21,
  },
  bubbleTextMe: {
    color: Colors.sentText,
  },
  bubbleTextThem: {
    color: Colors.receivedText,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampMe: {
    color: Colors.sentText + 'B3',
  },
  helpReplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    backgroundColor: Colors.assistBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.assistBorder,
  },
  helpReplyText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
  },
  aiLoadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  aiLoadingText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  attachBtn: {
    paddingBottom: Spacing.xs,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border + '80',
  },
  input: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.surface,
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 128,
    height: 4,
    backgroundColor: Colors.textTertiary + '40',
    borderRadius: 2,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
});
