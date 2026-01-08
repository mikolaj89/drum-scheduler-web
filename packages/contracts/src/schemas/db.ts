import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  categories,
  exercises,
  sessionexercises,
  sessions,
} from "@drum-scheduler/db-schema";

export type CategoryRow = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;
export type ExerciseRow = typeof exercises.$inferSelect;
export type ExerciseInsert = typeof exercises.$inferInsert;
export type SessionRow = typeof sessions.$inferSelect;
export type SessionInsert = typeof sessions.$inferInsert;
export type SessionExerciseRow = typeof sessionexercises.$inferSelect;
export type SessionExerciseInsert = typeof sessionexercises.$inferInsert;

export const CategoryRowSchema: z.ZodType<CategoryRow> = createSelectSchema(categories) as z.ZodType<CategoryRow>;
export const CategoryInsertSchema: z.AnyZodObject = createInsertSchema(categories);

export const ExerciseRowSchema: z.ZodType<ExerciseRow> = createSelectSchema(exercises) as z.ZodType<ExerciseRow>;
export const ExerciseInsertSchema: z.AnyZodObject = createInsertSchema(exercises);

export const SessionRowSchema: z.ZodType<SessionRow> = createSelectSchema(sessions) as z.ZodType<SessionRow>;
export const SessionInsertSchema: z.AnyZodObject = createInsertSchema(sessions);

export const SessionExerciseRowSchema: z.ZodType<SessionExerciseRow> =
  createSelectSchema(sessionexercises) as z.ZodType<SessionExerciseRow>;
export const SessionExerciseInsertSchema: z.AnyZodObject =
  createInsertSchema(sessionexercises);

// Common “narrowed” DTOs: keep shape stable for clients.
// You can evolve these independently from DB concerns (e.g. omit createdAt, hide internal fields).
export type Category = CategoryRow;
export type Exercise = ExerciseRow;
export type Session = SessionRow;
export type SessionExercise = SessionExerciseRow;

export const CategorySchema: z.ZodType<Category> = CategoryRowSchema;
export const ExerciseSchema: z.ZodType<Exercise> = ExerciseRowSchema;
export const SessionSchema: z.ZodType<Session> = SessionRowSchema;
export const SessionExerciseSchema: z.ZodType<SessionExercise> = SessionExerciseRowSchema;
