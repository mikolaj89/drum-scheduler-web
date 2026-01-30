import { useEffect, useState } from 'react';
import { ExerciseState } from '../components/exercise/exercise-screen/exercise-screen.types';
import { useTimer } from './use-time-countdown';
import { getFormattedTime } from '../utils/date-time';
import { useMetronome } from './use-metronome';
import { metronomeOptions } from './use-metronome.constants';
import { Exercise } from '@drum-scheduler/contracts';
import { getFormattedExercise } from '../components/exercise/exercise.utils';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type UseExercise = {
  exercises: Exercise[];
  exerciseIndex: number;
};

export const useExercise = ({ exercises, exerciseIndex }: UseExercise) => {
  const [currentIndex, setCurrentIndex] = useState(exerciseIndex);
  console.log('Current Index:', currentIndex);

  const currentExercise = getFormattedExercise(exercises[currentIndex - 1]);
  const durationSeconds = (currentExercise?.durationMinutes ?? 0) * 60; // in seconds
  const totalExercises = exercises.length;
  console.log('Total Exercises:', totalExercises);

  const [mode, setMode] = useState<ExerciseState>('preview');
  const metronome = useMetronome({...metronomeOptions,
    bpm: currentExercise.bpm
  });

  const onTimerFinish = () => {
   finishExercise();
    handleNext();

  }
  const { secondsLeft, startCountdown, stopCountdown, resetCountdown } =
    useTimer(durationSeconds, onTimerFinish);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const isPauseDisabled = mode !== 'active';
  const isPlayDisabled = mode === 'active';
  const isPrevNextDisabled = mode !== 'preview';

  const isPrevDisabled = currentIndex === 1 || isPrevNextDisabled;
  const isNextDisabled = isPrevNextDisabled;

  const timeFormatted = getFormattedTime(secondsLeft);

  const startExercise = () => {
    setMode('active');
    startCountdown();
    metronome.play();
  };

  const pauseExercise = () => {
    setMode('paused');
    stopCountdown();
    metronome.stop();
  };

  const finishExercise = () => {
    setMode('preview');
    resetCountdown(durationSeconds);
    metronome.stop();
  };

  useEffect(() => {
    setMode('preview');
    resetCountdown(durationSeconds);
    metronome.stop();
  }, [durationSeconds]);

  const handlePrev = () => {
    if (isPrevNextDisabled) return;
    setCurrentIndex(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    if (isPrevNextDisabled) return;
    if(currentIndex === totalExercises) {
      Alert.alert('You finished all exercises!', 'Go back to sessions screen?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to sessions', onPress: () => navigation.navigate('Sessions') },
          ]);
    }
    setCurrentIndex(prev => Math.min(totalExercises, prev + 1));
  };

   useEffect(() => {
    if (totalExercises === 0) return;
    if (currentIndex < 1) setCurrentIndex(1);
    if (currentIndex > totalExercises) setCurrentIndex(totalExercises);
  }, [currentIndex, totalExercises]);

  return {
    startExercise,
    pauseExercise,
    finishExercise,
    mode,
    setMode,
    timeFormatted,
    isPauseDisabled,
    isPlayDisabled,
    isPrevNextDisabled,
    handlePrev,
    handleNext,
    currentExercise,
    currentIndex,
    isPrevDisabled,
    isNextDisabled,
  };
};
