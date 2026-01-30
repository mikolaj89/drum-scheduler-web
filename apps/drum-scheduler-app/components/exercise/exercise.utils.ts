import { Exercise } from "@drum-scheduler/contracts";

export type FormattedExercise = Omit<Exercise, 'durationMinutes' | 'bpm' | 'description'> & {
  durationMinutes: number;
  bpm: number;
  description: string;
  name: string;
};

export const getFormattedExercise = (exercise: Exercise): FormattedExercise => {
  const duration = exercise.durationMinutes ?? 0;
  const bpm = exercise.bpm ?? 0;
  const description = exercise.description?.trim() || '—';

  
  return {
    ...exercise,
    durationMinutes: duration,
    bpm,
    description,
  };
}