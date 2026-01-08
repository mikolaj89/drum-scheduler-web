import { relations } from "drizzle-orm/relations";
import { sessions, sessionexercises, exercises, categories } from "./schema.js";

export const sessionexercisesRelations = relations(sessionexercises, ({ one }) => ({
  session: one(sessions, {
    fields: [sessionexercises.sessionId],
    references: [sessions.id],
  }),
  exercise: one(exercises, {
    fields: [sessionexercises.exerciseId],
    references: [exercises.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ many }) => ({
  sessionexercises: many(sessionexercises),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  sessionexercises: many(sessionexercises),
  category: one(categories, {
    fields: [exercises.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  exercises: many(exercises),
}));
