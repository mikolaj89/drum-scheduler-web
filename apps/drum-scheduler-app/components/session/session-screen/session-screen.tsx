import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from '@tanstack/react-query';
import type { Exercise, Session } from '@drum-scheduler/contracts';

type SessionWithExercises = Session & {
  totalDuration: number;
  exercises: Exercise[];
};

type ApiErrorResponse = {
  error: { message: string; errorCode: string; fieldErrors?: Record<string, string> };
};

type ApiSuccessResponse<T> = { data: T; success?: boolean };

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

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
    primary: '#6B7280',
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

async function fetchSessionById(baseUrl: string, sessionId: number): Promise<SessionWithExercises> {
  const response = await fetch(`${baseUrl}/sessions/${sessionId}`);
  const json = (await response.json()) as ApiResponse<SessionWithExercises>;

  if (!response.ok) {
    if ('error' in json) {
      throw new Error(json.error.message);
    }
    throw new Error('Failed to load session');
  }

  if ('error' in json) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export default function SessionScreen({
  baseUrl,
  sessionId,
  onBack,
}: {
  baseUrl: string;
  sessionId: number;
  onBack: () => void;
}) {
  const sessionResult = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => fetchSessionById(baseUrl, sessionId),
  });

  const renderItem = ({ item }: ListRenderItemInfo<Exercise>) => {
    const duration = item.durationMinutes ?? 0;
    return (
      <View style={styles.exerciseCard}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseMeta}>{duration} min</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <TopBar title="Session" onBack={onBack} />

        {sessionResult.isLoading ? (
          <Text style={styles.sectionTitle}>Loading session…</Text>
        ) : sessionResult.error ? (
          <Text style={styles.sectionTitle}>
            {sessionResult.error instanceof Error
              ? sessionResult.error.message
              : 'Failed to load session'}
          </Text>
        ) : null}

        {sessionResult.data ? (
          <View style={styles.header}>
            <Text style={styles.sessionTitle}>{sessionResult.data.name}</Text>
            <Text style={styles.sessionMeta}>
              Total duration: {sessionResult.data.totalDuration ?? 0} min
            </Text>
          </View>
        ) : null}

        <Text style={styles.listTitle}>Exercises</Text>

        <FlatList
          data={sessionResult.data?.exercises ?? []}
          keyExtractor={e => e.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !sessionResult.isLoading && !sessionResult.error ? (
              <Text style={styles.emptyText}>No exercises in this session.</Text>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.iconBtn} onPress={onBack}>
        <Icon name="arrow-back" size={24} color={theme.colors.icon} />
      </Pressable>

      <Text style={styles.topBarTitle}>{title}</Text>

      <View style={styles.iconBtn} />
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

  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  sessionTitle: {
    fontSize: theme.typography.cardTitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sessionMeta: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },

  sectionTitle: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },

  listTitle: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },

  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  exerciseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  exerciseName: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  exerciseMeta: {
    fontSize: theme.typography.small,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },

  emptyText: {
    paddingTop: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
  },
});
