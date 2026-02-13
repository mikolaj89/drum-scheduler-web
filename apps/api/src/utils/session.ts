import type { Exercise, Session } from "../db/types";

export type SessionWithExercises = Session & {
  totalDuration: number;
  exercises: Exercise[];
};

// should return a formatted session, which includes
// 1) total duration base on the exercises it contains
// 2) basic session data
// 3) exercises
export const getFormattedSession = (
  session: Session,
  exercises: Exercise[]
): SessionWithExercises => {
  const totalDuration = exercises.reduce(
    (acc, exercise) => acc + (exercise.durationMinutes ?? 0),
    0
  );

  return {
    ...session,
    totalDuration,
    exercises,
  };
};
