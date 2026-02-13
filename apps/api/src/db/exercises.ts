import { db } from "./drizzle";
import { exercisesSchema } from "./schema";
import { and, eq, ilike, SQL } from "drizzle-orm";
import type { ExerciseInput } from "./types";

export async function selectExercises() {
  return await db.select().from(exercisesSchema);
}

//one action to filter by exercise name and/or category
export const filterExercises = async ({
  name,
  categoryId,
}: {
  name: string | null;
  categoryId?: string | null;
}) => {
  const conditions: SQL[] = [];

  if (name !== null && name !== "") {
    conditions.push(ilike(exercisesSchema.name, `%${name}%`));
  }

  if (categoryId !== null && categoryId !== "") {
    conditions.push(eq(exercisesSchema.categoryId, Number(categoryId)));
  }

  // Zapytanie
  return await db
    .select()
    .from(exercisesSchema)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
};

export async function getExerciseById(id: number) {
  return await db
    .select()
    .from(exercisesSchema)
    .where(eq(exercisesSchema.id, id));
}

export const addExercise = async (exercise: ExerciseInput) => {
  return await db.insert(exercisesSchema).values(exercise);
};

export const editExercise = async (exerciseData: ExerciseInput, id: number) => {
  return await db
    .update(exercisesSchema)
    .set(exerciseData)
    .where(eq(exercisesSchema.id, id));
};

export const deleteExercise = async (id: number) => {
  return await db.delete(exercisesSchema).where(eq(exercisesSchema.id, id));
};

export const filterExercisesByName = async (name: string) => {
  return await db
    .select()
    .from(exercisesSchema)
    .where(eq(exercisesSchema.name, name));
};

export const filterExercisesByCategory = async (categoryId: number) => {
  return await db
    .select()
    .from(exercisesSchema)
    .where(eq(exercisesSchema.categoryId, categoryId));
};
