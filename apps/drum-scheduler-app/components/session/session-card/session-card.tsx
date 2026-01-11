import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Session } from '@drum-scheduler/contracts';
import { getFormattedMinutes, getLastFinishedDateFormatted } from '../session-utils';

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

export function SessionCard({
  session,
  onOpen,
  onStart: _onStart,
  onMenu: _onMenu,
}: {
  session: Session;
  onOpen: () => void;
  onStart: () => void;
  onMenu: () => void;
}) {
  return (
    <Pressable onPress={onOpen}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{session.name}</Text>

        <Text
          style={[
            styles.cardMeta,
            !session.lastFinishDate && styles.cardMetaLast,
          ]}
        >
          TotalDuration: {getFormattedMinutes(session.totalDuration ?? 0)}
        </Text>

        {session.lastFinishDate && (
          <Text style={[styles.cardMeta, styles.cardMetaLast]}>
            Last Finished at: {getLastFinishedDateFormatted(session.lastFinishDate)}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: theme.typography.cardTitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  cardMeta: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  cardMetaLast: {
    marginBottom: 0,
  },
});
