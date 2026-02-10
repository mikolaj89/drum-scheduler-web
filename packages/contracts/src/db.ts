import {
  categories,
  exercises,
  sessionexercises,
  sessions,
  users
} from "@drum-scheduler/db-schema";

export type CategoryRow = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;
export type ExerciseRow = typeof exercises.$inferSelect;
export type ExerciseInsert = typeof exercises.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
export type SessionInsert = typeof sessions.$inferInsert;
export type SessionExerciseRow = typeof sessionexercises.$inferSelect;
export type SessionExerciseInsert = typeof sessionexercises.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

// Common “narrowed” DTOs: keep shape stable for clients.
// You can evolve these independently from DB concerns (e.g. omit createdAt, hide internal fields).
export type Category = CategoryRow;
export type Exercise = ExerciseRow;
export type Session = SessionRow;
export type SessionExercise = SessionExerciseRow;
export type User = UserRow;
