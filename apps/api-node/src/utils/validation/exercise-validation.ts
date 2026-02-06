import type { ExerciseInput } from "../../db/types";

export const getExerciseErrors = (body: ExerciseInput): string[] => {
  const errors: string[] = [];

  if (!body.name || typeof body.name !== "string") {
    errors.push("Name is required and must be a string.");
  }

  if (!body.categoryId || typeof body.categoryId !== "number") {
    errors.push("Category ID is required and must be a number.");
  }
  if (
    !body.durationMinutes ||
    typeof body.durationMinutes !== "number" ||
    body.durationMinutes <= 0
  ) {
    errors.push("Duration (minutes) is required and must be a positive number.");
  }
  if (body.bpm !== undefined && (typeof body.bpm !== "number" || body.bpm <= 0)) {
    errors.push("BPM must be a positive number if provided.");
  }

  return errors;
};
