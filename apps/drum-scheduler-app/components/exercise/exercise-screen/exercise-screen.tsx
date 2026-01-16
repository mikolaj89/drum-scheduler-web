import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Exercise } from '@drum-scheduler/contracts';

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

export default function ExerciseScreen({
  exercise,
  sessionName,
  onBack,
}: {
  exercise: Exercise;
  sessionName: string;
  onBack: () => void;
}) {
  const duration = exercise.durationMinutes ?? 0;
  const bpm = exercise.bpm ?? 0;
  const notes = exercise.description?.trim() || '—';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <TopBar title="Exercise" onBack={onBack} />

        <View style={styles.header}>
          <Text style={styles.sessionName}>{sessionName}</Text>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Notes</Text>
          <Text style={styles.cardValue}>{notes}</Text>

          <View style={styles.row}>
            <View style={styles.kv}>
              <Text style={styles.kLabel}>Duration</Text>
              <Text style={styles.kValue}>{duration} min</Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kLabel}>BPM</Text>
              <Text style={styles.kValue}>{bpm}</Text>
            </View>
          </View>
        </View>

        <View style={styles.controlsWrap}>
          <View style={styles.controlsBar}>
            <Pressable
              style={styles.controlBtn}
              onPress={() => {}}
              accessibilityLabel="Previous"
            >
              <Icon
                name="skip-previous"
                size={26}
                color={theme.colors.primaryText}
              />
            </Pressable>

            <Pressable
              style={styles.controlBtn}
              onPress={() => {}}
              accessibilityLabel="Play"
            >
              <Icon name="play-arrow" size={26} color={theme.colors.primaryText} />
            </Pressable>

            <Pressable
              style={styles.controlBtn}
              onPress={() => {}}
              accessibilityLabel="Pause"
            >
              <Icon name="pause" size={26} color={theme.colors.primaryText} />
            </Pressable>

            <Pressable
              style={styles.controlBtn}
              onPress={() => {}}
              accessibilityLabel="Next"
            >
              <Icon name="skip-next" size={26} color={theme.colors.primaryText} />
            </Pressable>
          </View>
        </View>
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
  },
  exerciseTitle: {
    fontSize: theme.typography.cardTitle,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sessionName: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },

  card: {
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: theme.typography.small,
    fontWeight: '800',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  },
  kv: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  kLabel: {
    fontSize: theme.typography.small,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  kValue: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.text,
  },

  controlsWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    alignItems: 'center',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
});
