import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const theme = {
  colors: {
    bg: '#F2F3F5',
    surface: '#FFFFFF',
    border: '#D6D9DE',
    text: '#1F2430',
    textMuted: '#6B7280',
    icon: '#4B5563',
    primary: '#3B82F6',
    primaryText: '#FFFFFF',
    shadow: 'rgba(0,0,0,0.12)',
  },
  spacing: {
    lg: 18,
  },
  typography: {
    cardTitle: 18,
    body: 14,
  },
};

export default function ActiveExerciseView({
  name,
  bpm,
  timeFormatted,
}: {
  name: string;
  bpm: number;
  timeFormatted: string;
}) {
  return (
    <View style={styles.activeWrap}>
      <Text style={styles.activeTitle}>{name}</Text>
      <Text style={styles.activeMeta}>BPM {bpm}</Text>
      <Text style={styles.activeTimer}>{timeFormatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  activeWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
    gap: 8,
  },
  activeTitle: {
    fontSize: theme.typography.cardTitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  activeMeta: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  activeTimer: {
    fontSize: 64,
    fontWeight: '300',
    color: theme.colors.text,
    letterSpacing: 2,
    marginTop: 10,
  },
});
