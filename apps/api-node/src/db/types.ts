import {
  categoriesSchema,
  exercisesSchema,
  sessionexercisesSchema,
  sessionsSchema,
} from "./schema";

export type Category = typeof categoriesSchema.$inferSelect;
export type CategoryInput = typeof categoriesSchema.$inferInsert;

export type Exercise = typeof exercisesSchema.$inferSelect;
export type ExerciseInput = typeof exercisesSchema.$inferInsert;

export type SessionExercise = typeof sessionexercisesSchema.$inferSelect;
export type SessionExerciseInput = typeof sessionexercisesSchema.$inferInsert;

export type Session = typeof sessionsSchema.$inferSelect;
export type SessionInput = typeof sessionsSchema.$inferInsert;
