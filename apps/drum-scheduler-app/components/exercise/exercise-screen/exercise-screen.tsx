import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Exercise } from '@drum-scheduler/contracts';
import { useExercise } from '../../../hooks/use-exercise';
import ActiveExerciseView from '../active-exercise-view/active-exercise-view';
import ExerciseControls from '../exercise-controls/exercise-controls';
import { styles, theme } from './exercise-screen.style';
export default function ExerciseScreen({
  exercises,
  sessionName,
  exerciseIndex,
  onBack,
}: {
  exercises: Exercise[];
  sessionName: string;
  exerciseIndex: number;
  onBack: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(exerciseIndex);
  const totalExercises = exercises.length;

  useEffect(() => {
    if (totalExercises === 0) return;
    if (currentIndex < 1) setCurrentIndex(1);
    if (currentIndex > totalExercises) setCurrentIndex(totalExercises);
  }, [currentIndex, totalExercises]);

  const currentExercise = exercises[currentIndex - 1];
  const duration = currentExercise?.durationMinutes ?? 0;
  const bpm = currentExercise?.bpm ?? 0;
  const notes = currentExercise?.description?.trim() || '—';
  const {
    startExercise,
    pauseExercise,
    finishExercise,
    mode,
    timeFormatted,
    isPauseDisabled,
    isPlayDisabled,
    isPrevNextDisabled,
  } = useExercise({ exercises: exercises, exerciseIndex });

  const handlePrev = () => {
    if (isPrevNextDisabled) return;
    setCurrentIndex(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (isPrevNextDisabled) return;
    setCurrentIndex(prev => Math.min(totalExercises, prev + 1));
  };

  

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <TopBar title="Exercise" onBack={onBack} />

        {mode === 'active' || mode === 'paused' ? (
          <ActiveExerciseView
            name={currentExercise?.name ?? ''}
            bpm={bpm}
            timeFormatted={timeFormatted}
          />
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.sessionName}>{sessionName}</Text>
              <View style={styles.titleRow}>
                <Text style={styles.exerciseTitle}>
                  {currentExercise?.name ?? ''}
                </Text>
                <Text style={styles.exerciseProgress}>
                  Exercise {currentIndex} / {totalExercises}
                </Text>
              </View>
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
          </>
        )}

        <ExerciseControls
          isPrevNextDisabled={isPrevNextDisabled}
          isPlayDisabled={isPlayDisabled}
          isPauseDisabled={isPauseDisabled}
          onPrev={handlePrev}
          onPlay={startExercise}
          onPause={pauseExercise}
          onFinish={finishExercise}

          onNext={handleNext}
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
