import type { Exercise, Session } from "@drum-scheduler/contracts";

export type CreateSessionResponse = { id: number };

export type SessionWithExercises = Session & {
  totalDuration: number;
  exercises: Exercise[];
};

export type SessionExercisesOrderInput = {
  exercises: Exercise[];
};
