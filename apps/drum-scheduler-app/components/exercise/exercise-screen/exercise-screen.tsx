import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Exercise } from '@drum-scheduler/contracts';
import { useExercise } from '../../../hooks/use-exercise';
import ActiveExerciseView from '../active-exercise-view/active-exercise-view';
import ExerciseControls from '../exercise-controls/exercise-controls';
import { TopBar } from '../../top-bar/top-bar';
import { styles } from './exercise-screen.style';

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
  const totalExercises = exercises.length;

  const {
    startExercise,
    pauseExercise,
    finishExercise,
    mode,
    timeFormatted,
    isPrevDisabled,
    isNextDisabled,
    handlePrev,
    handleNext,
    currentExercise,
    currentIndex,
  } = useExercise({ exercises: exercises, exerciseIndex });


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <TopBar title="Exercise" onBack={onBack} />

        {mode === 'active' || mode === 'paused' ? (
          <ActiveExerciseView
            name={currentExercise.name}
            bpm={currentExercise.bpm}
            timeFormatted={timeFormatted}
          />
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.sessionName}>{sessionName}</Text>
              <View style={styles.titleRow}>
                <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>
                <Text style={styles.exerciseProgress}>
                  Exercise {currentIndex} / {totalExercises}
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Notes</Text>
              <Text style={styles.cardValue}>
                {currentExercise.description}
              </Text>

              <View style={styles.row}>
                <View style={styles.kv}>
                  <Text style={styles.kLabel}>Duration</Text>
                  <Text style={styles.kValue}>
                    {currentExercise.durationMinutes} min
                  </Text>
                </View>
                <View style={styles.kv}>
                  <Text style={styles.kLabel}>BPM</Text>
                  <Text style={styles.kValue}>{currentExercise.bpm}</Text>
                </View>
              </View>
            </View>
          </>
        )}

        <ExerciseControls
          
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          
          onPrev={handlePrev}
          onNext={handleNext}
          onPlay={startExercise}
          onPause={pauseExercise}
          onFinish={finishExercise}
          mode={mode}
          
        />
      </View>
    </SafeAreaView>
  );
}
