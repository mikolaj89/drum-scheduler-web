import { db } from "./drizzle";
import { sessionexercisesSchema, exercisesSchema } from "./schema";
import type { Exercise, SessionExerciseInput } from "./types";
import { and, eq, sql } from "drizzle-orm";

const SESSION_EXERCISES_TABLE = "sessionexercises";

export async function reorderSessionExercises(
  sessionId: number,
  exercises: Exercise[]
) {
  if (exercises.length === 0) return;

  const valuesClause = exercises
    .map((exercise, index) => `WHEN '${exercise.id}' THEN ${index}`)
    .join(" ");

  const exerciseIds = exercises.map((ex) => `'${ex.id}'`).join(", ");

  const sql = `
    UPDATE ${SESSION_EXERCISES_TABLE}
    SET order_index = CASE exercise_id
      ${valuesClause}
    END
    WHERE session_id = '${sessionId}'
      AND exercise_id IN (${exerciseIds});
  `;

  return await db.execute(sql);
}

export async function getSessionExercises(sessionId: number) {
  return await db
    .select({
      id: exercisesSchema.id,
      name: exercisesSchema.name,
      bpm: exercisesSchema.bpm,
      durationMinutes: sql<number | null>`COALESCE(${sessionexercisesSchema.durationMinutes}, ${exercisesSchema.durationMinutes})`,
      description: exercisesSchema.description,
      createdAt: exercisesSchema.createdAt,
      mp3Url: exercisesSchema.mp3Url,
      categoryId: exercisesSchema.categoryId,
    })
    .from(sessionexercisesSchema)
    .innerJoin(
      exercisesSchema,
      eq(sessionexercisesSchema.exerciseId, exercisesSchema.id)
    )
    .where(eq(sessionexercisesSchema.sessionId, sessionId))
    .orderBy(sessionexercisesSchema.orderIndex); // 👈 here!
}

export const addSessionExercise = async (
  sessionExercise: SessionExerciseInput
) => {
  return await db.insert(sessionexercisesSchema).values(sessionExercise);
};

// delete sessionExercise

export const deleteSessionExercise = async (
  sessionId: number,
  exerciseId: number
) => {
  return await db
    .delete(sessionexercisesSchema)
    .where(
      and(
        eq(sessionexercisesSchema.sessionId, sessionId),
        eq(sessionexercisesSchema.exerciseId, exerciseId)
      )
    );
};
