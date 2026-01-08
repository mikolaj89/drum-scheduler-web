import { z } from "zod";

export const ApiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    errorCode: z.string(),
    fieldErrors: z.record(z.string()).optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorSchema>;

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean().optional(),
  });

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([ApiSuccessSchema(dataSchema), ApiErrorSchema]);

export type ApiSuccessResponse<T> = { data: T; success?: boolean };
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
