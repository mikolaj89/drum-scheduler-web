import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
// If you don't want icons, remove these and replace <Icon .../> with <Text>...</Text>
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSessionsQuery } from '@drum-scheduler/sdk';
import { Session } from '@drum-scheduler/contracts';
import { SessionCard } from '../session-card/session-card';

const theme = {
  colors: {
    bg: '#F2F3F5',
    surface: '#FFFFFF',
    border: '#D6D9DE',
    text: '#1F2430',
    textMuted: '#6B7280',
    icon: '#4B5563',
    pillBg: '#E7E9ED',
    pillText: '#374151',
    primary: '#6B7280', // grayscale primary
    primaryText: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.12)',
  },
  radius: {
    xl: 18,
    lg: 14,
    md: 12,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
  },
  typography: {
    title: 22,
    cardTitle: 18,
    body: 14,
    small: 12,
  },
};

const TABS = ['All', 'Upcoming', 'Completed'] as const;
type Tab = (typeof TABS)[number];

export default function SessionsScreen({
  onOpenSession,
}: {
  onOpenSession?: (sessionId: number) => void;
}) {
  const [tab, setTab] = useState<Tab>('All');
  const [query, setQuery] = useState('');

  const sessionsResult = useSessionsQuery('http://10.0.2.2:8000');

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
        <TopBar title="Sessions" onBack={() => {}} onMenu={() => {}} />

        <SearchBar value={query} onChange={setQuery} />

        <SegmentedTabs value={tab} onChange={setTab} />

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

function TopBar({
  title,
  onBack,
  onMenu,
}: {
  title: string;
  onBack: () => void;
  onMenu: () => void;
}) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.iconBtn} onPress={onBack}>
        <Icon name="arrow-back" size={24} color={theme.colors.icon} />
      </Pressable>

      <Text style={styles.topBarTitle}>{title}</Text>

      <Pressable style={styles.iconBtn} onPress={onMenu}>
        <Icon name="more-vert" size={24} color={theme.colors.icon} />
      </Pressable>
    </View>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.searchWrap}>
      <Icon name="search" size={22} color={theme.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search sessions..."
        placeholderTextColor={theme.colors.textMuted}
        style={styles.searchInput}
      />
    </View>
  );
}

function SegmentedTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <View style={styles.tabsOuter}>
      {TABS.map(t => {
        const active = t === value;
        return (
          <Pressable
            key={t}
            onPress={() => onChange(t)}
            style={[styles.tabBtn, active && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
              {t}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.bg },
  screen: { flex: 1, backgroundColor: theme.colors.bg },

  topBar: {
    height: 56,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchWrap: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    height: 46,
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body,
  },

  tabsOuter: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    padding: 4,
    backgroundColor: theme.colors.pillBg,
    borderRadius: 999,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabBtn: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.pillText,
  },
  tabTextActive: {
    color: theme.colors.primaryText,
  },

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
