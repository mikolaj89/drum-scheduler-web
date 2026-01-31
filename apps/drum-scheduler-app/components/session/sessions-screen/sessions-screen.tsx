import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
// If you don't want icons, remove these and replace <Icon .../> with <Text>...</Text>
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSessionsQuery } from '@drum-scheduler/sdk';
import { Session } from '@drum-scheduler/contracts';
import { SessionCard } from '../session-card/session-card';
import { TopBar } from '../../top-bar/top-bar';
import { SearchBar } from '../../search-bar/search-bar';
import { API_BASE_URL } from '../../../config/api';
import { theme } from '../../../utils/theme';

const TABS = ['All', 'Upcoming', 'Completed'] as const;
type Tab = (typeof TABS)[number];

export default function SessionsScreen({
  onOpenSession,
}: {
  onOpenSession?: (sessionId: number) => void;
}) {
  const [query, setQuery] = useState('');

  const sessionsResult = useSessionsQuery(API_BASE_URL);

  const renderItem = ({ item }: ListRenderItemInfo<Session>) => (
    <SessionCard
      session={item}
      onOpen={() => onOpenSession?.(item.id)}
      onStart={() => {}}
      onMenu={() => {}}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <TopBar onMenu={() => {}}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search sessions..."
          />
        </TopBar>

        {sessionsResult?.isLoading ? (
          <Text style={styles.sectionTitle}>Loading sessions…</Text>
        ) : sessionsResult?.error ? (
          <Text style={styles.sectionTitle}>
            {sessionsResult.error.message || 'Failed to load sessions'}
          </Text>
        ) : sessionsResult?.data?.length === 0 ? (
          <Text style={styles.sectionTitle}>No sessions yet.</Text>
        ) : null}

        <FlatList
          data={sessionsResult?.data ?? []}
          keyExtractor={s => s.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={{ height: theme.spacing.xl }} />}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.ctaWrap}>
          <Pressable style={styles.ctaBtn} onPress={() => {}}>
            <Icon name="add" size={22} color={theme.colors.primaryText} />
            <Text style={styles.ctaText}>New Session</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  screen: { flex: 1, backgroundColor: theme.colors.bg },

  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: 110,
  },
  section: { gap: theme.spacing.md, marginBottom: theme.spacing.md },
  sectionTitle: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },

  ctaWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 22,
    height: 54,
    borderRadius: 999,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  ctaText: {
    color: theme.colors.primaryText,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
});
