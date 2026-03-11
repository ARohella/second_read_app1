import { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useApp } from '../../src/store/AppContext';
import { Colors, Spacing, FontSize, DEMO_MODE } from '../../src/lib/constants';
import { DEMO_CONTACTS, DEMO_MESSAGES } from '../../src/lib/demo-data';

export default function ChatList() {
  const { chatList, loadChatList } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Always show demo contacts for demo purposes
  const demoChats = [
    {
      id: 'emma-girlfriend',
      name: 'Emma',
      initials: 'EM',
      lastMessage: DEMO_MESSAGES['emma-girlfriend'][DEMO_MESSAGES['emma-girlfriend'].length - 1].text.slice(0, 60) + '...',
      timestamp: Date.now() - 300000,
      unread: 1,
    },
    {
      id: 'alex-coworker',
      name: 'Alex Rivera',
      initials: 'AR',
      lastMessage: DEMO_MESSAGES['alex-coworker'][DEMO_MESSAGES['alex-coworker'].length - 1].text,
      timestamp: Date.now() - 1800000,
      unread: 0,
    },
  ];

  const displayList = demoChats;

  useFocusEffect(
    useCallback(() => {
      // Demo mode - no need to load real chat list
    }, [])
  );

  function formatTime(timestamp: number | undefined): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function renderDemoItem({ item }: { item: typeof demoChats[0] }) {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, item.unread > 0 && styles.avatarUnread]}>
            <Text style={styles.avatarText}>{item.initials}</Text>
          </View>
          {item.unread > 0 && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <View style={styles.nameRow}>
              <Text style={[styles.chatName, item.unread > 0 && styles.chatNameUnread]} numberOfLines={1}>
                {item.name}
              </Text>
              <FontAwesome name="lock" size={12} color={Colors.primary} style={styles.lockIcon} />
            </View>
            <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeUnread]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          <View style={styles.chatPreviewRow}>
            <Text style={[styles.chatPreview, item.unread > 0 && styles.chatPreviewUnread]} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function renderRealItem({ item }: { item: typeof chatList[0] }) {
    const initials = item.contact.displayNameLocal
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item.conversation.conversationId}`)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>
              {item.contact.displayNameLocal}
            </Text>
            <Text style={styles.chatTime}>
              {formatTime(item.lastMessage?.timestamp)}
            </Text>
          </View>
          <View style={styles.chatPreviewRow}>
            <Text style={styles.chatPreview} numberOfLines={1}>
              {item.lastMessagePreview || 'No messages yet'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
        >
          <FontAwesome name="cog" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      {/* List */}
      {displayList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="comments-o" size={48} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap + to add a contact and start chatting
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayList as any}
          keyExtractor={item => item.id}
          renderItem={renderDemoItem as any}
          contentContainerStyle={styles.list}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-contact')}
      >
        <FontAwesome name="edit" size={24} color={Colors.sentText} />
      </TouchableOpacity>

      {/* Home indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  list: {
    paddingBottom: Spacing.xxxl * 3,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarUnread: {
    borderColor: Colors.primary + '40',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: Spacing.lg,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.primary,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatName: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  chatNameUnread: {
    color: Colors.text,
    fontWeight: '700',
  },
  lockIcon: {
    marginLeft: 6,
  },
  chatTime: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  chatTimeUnread: {
    color: Colors.primary,
    fontWeight: '700',
  },
  chatPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatPreview: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  chatPreviewUnread: {
    color: Colors.text,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: Spacing.sm,
  },
  badgeText: {
    color: Colors.sentText,
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xxxl * 3,
    right: Spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -64,
    width: 128,
    height: 4,
    backgroundColor: Colors.textTertiary + '40',
    borderRadius: 2,
  },
});
