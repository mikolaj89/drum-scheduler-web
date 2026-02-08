import { SelectOption } from "@/components/Common/Field/Select";
import type { Category, Exercise } from "@drum-scheduler/contracts";
import { z } from "zod";
import { useExerciseQuery as useExerciseQuerySDK } from "@drum-scheduler/sdk";

// react-query keys
export const EDITED_EXERCISE_ID_KEY = "editedExerciseId";

//validation constants
const MIN_BPM = 30;
const MAX_BPM = 350;
const MIN_DURATION = 1;
const MIN_NAME_LENGTH = 3;

function requireStr(schema: z.ZodString, fieldName: string) {
  return schema.refine(
    (val) => val !== undefined && val !== null && val.trim().length > 0,
    `${fieldName} cannot be empty`
  );
}

export const exerciseSchema = z.object({
  name: requireStr(z.string(), "Name").refine(
    (val) => val.length >= MIN_NAME_LENGTH,
    `Minimum name length is ${MIN_NAME_LENGTH}`
  ),

  description: z.string().nullable(),
  bpm: requireStr(z.string(), "BPM")
    .refine(
      (val) => !val || parseInt(val) >= MIN_BPM,
      `Minimum BPM is ${MIN_BPM}`
    )
    .refine(
      (val) => !val || parseInt(val) <= MAX_BPM,
      `Maximum BPM is ${MAX_BPM}`
    ),
  categoryId: requireStr(z.string(), "Category"),
  mp3Url: z
    .string()
    .nullable()
    .refine((val) => !val || val.startsWith("http"), "Invalid URL"),
  durationMinutes: requireStr(z.string(), "Duration").refine(
    (val) => !val || parseInt(val) >= MIN_DURATION,
    `Minimum duration is ${MIN_DURATION}`
  ),
});

export type ExerciseFormData = z.infer<typeof exerciseSchema>;
export type ExerciseSubmitData = Pick<
  Exercise,
  "name" | "description" | "mp3Url" | "categoryId" | "bpm" | "durationMinutes"
>;

export const getCategoryOpts = (categories: Category[]): SelectOption[] => {
  return categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));
};

export const getExercisesOpts = (exercises: Exercise[]): SelectOption[] => {
  return exercises.map((exercise) => ({
    value: exercise.id.toString(),
    label: exercise.name,
  }));
};

export const getExerciseSubmitFormat = (
  data: ExerciseFormData
): ExerciseSubmitData => {
  const { name, description, mp3Url, categoryId, bpm, durationMinutes } = data;

  return {
    name,
    description,
    mp3Url,
    categoryId: categoryId ? parseInt(categoryId) : null,
    bpm: parseInt(bpm),
    durationMinutes: parseInt(durationMinutes),
  };
};

export const getExerciseFormDataFormat = (exercise: Exercise): ExerciseFormData => {
  const { name, description, mp3Url, categoryId, bpm, durationMinutes } =
    exercise;

  return {
    name,
    description,
    mp3Url,
    categoryId: categoryId?.toString() ?? "",
    bpm: bpm?.toString() ?? "",
    durationMinutes: durationMinutes?.toString() ?? "",
  };
};

export const useExerciseQuery = (editedId: number | null) => {
  const API_BASE_URL = "http://localhost:8000";
  return useExerciseQuerySDK(
    API_BASE_URL,
    editedId ?? 0,
    { enabled: !!editedId }
  );
};
