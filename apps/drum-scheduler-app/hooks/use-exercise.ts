import { useEffect, useState } from 'react';
import { ExerciseState } from '../components/exercise/exercise-screen/exercise-screen.types';
import { useTimer } from './use-time-countdown';
import { getFormattedTime } from '../utils/date-time';
import { useMetronome } from './use-metronome';
import { metronomeOptions } from './use-metronome.constants';
import { Exercise } from '@drum-scheduler/contracts';

type UseExercise = {
  exercises: Exercise[];
  exerciseIndex: number;
};

export const useExercise = ({ exercises, exerciseIndex }: UseExercise) => {
  const duration = exercises[exerciseIndex - 1]?.durationMinutes ?? 0;


  const [mode, setMode] = useState<ExerciseState>('preview');
  const metronome = useMetronome(metronomeOptions);
  const { secondsLeft, startCountdown, stopCountdown, resetCountdown } =
    useTimer(duration * 60);
  const isPauseDisabled = mode !== 'active';
  const isPlayDisabled = mode === 'active';
  const isPrevNextDisabled = mode !== 'preview';

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
    resetCountdown(duration * 60);
    metronome.stop();
  };

  useEffect(() => {
    setMode('preview');
    resetCountdown(duration * 60);
    metronome.stop();
  }, [duration]);

 

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
  };
};
