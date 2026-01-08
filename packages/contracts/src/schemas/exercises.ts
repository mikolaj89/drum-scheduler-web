import { z } from "zod";
import { ApiResponseSchema } from "../response.js";
import { ExerciseSchema, ExerciseInsertSchema } from "./db.js";

const _GetExercisesResponseSchema = ApiResponseSchema(z.array(ExerciseSchema));
export type GetExercisesResponse = z.infer<typeof _GetExercisesResponseSchema>;
export const GetExercisesResponseSchema: z.ZodType<GetExercisesResponse> =
  _GetExercisesResponseSchema;

export const CreateExerciseBodySchema = ExerciseInsertSchema.pick({
  name: true,
  categoryId: true,
  description: true,
  durationMinutes: true,
  bpm: true,
}).extend({
  name: z.string(),
});
export type CreateExerciseBody = z.infer<typeof CreateExerciseBodySchema>;

// API returns `{ data: result, success: true }` where `result` is whatever Drizzle returns from insert.
// Today, `addExerciseDb()` returns the insert result (not `.returning()`), so keep this permissive.
const _CreateExerciseResponseSchema = ApiResponseSchema(z.unknown());
export type CreateExerciseResponse = z.infer<typeof _CreateExerciseResponseSchema>;
export const CreateExerciseResponseSchema: z.ZodType<CreateExerciseResponse> =
  _CreateExerciseResponseSchema;
