import { db } from "./drizzle";
import {
  exercisesSchema,
  sessionexercisesSchema,
  sessionsSchema,
} from "./schema";
import { eq, sql } from "drizzle-orm";
import type { SessionInput } from "./types";

export async function getSession(id: number) {
  return await db
    .select()
    .from(sessionsSchema)
    .where(eq(sessionsSchema.id, id));
}

export async function getSessions() {
  // Derive totalDuration from the session's exercises.
  // Prefer per-session override duration (sessionexercises.durationMinutes),
  // falling back to the base exercise duration (exercises.durationMinutes).
  return await db
    .select({
      id: sessionsSchema.id,
      name: sessionsSchema.name,
      sessionDate: sessionsSchema.sessionDate,
      notes: sessionsSchema.notes,
      createdAt: sessionsSchema.createdAt,
      totalDuration:
        sql<number>`COALESCE(SUM(COALESCE(${sessionexercisesSchema.durationMinutes}, ${exercisesSchema.durationMinutes}, 0)), 0)`
          .mapWith(Number),
    })
    .from(sessionsSchema)
    .leftJoin(
      sessionexercisesSchema,
      eq(sessionexercisesSchema.sessionId, sessionsSchema.id)
    )
    .leftJoin(
      exercisesSchema,
      eq(sessionexercisesSchema.exerciseId, exercisesSchema.id)
    )
    .groupBy(
      sessionsSchema.id,
      sessionsSchema.name,
      sessionsSchema.sessionDate,
      sessionsSchema.notes,
      sessionsSchema.createdAt
    );
}

export const addSession = async (session: SessionInput) => {
  return await db.insert(sessionsSchema).values(session).returning();
};

export const deleteSession = async (id: number) => {
  return await db.delete(sessionsSchema).where(eq(sessionsSchema.id, id));
};
