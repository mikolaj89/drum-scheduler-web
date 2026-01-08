import { z } from "zod";
import { ApiResponseSchema } from "../response.js";
import { SessionSchema, SessionInsertSchema } from "./db.js";

const _GetSessionsResponseSchema = ApiResponseSchema(z.array(SessionSchema));
export type GetSessionsResponse = z.infer<typeof _GetSessionsResponseSchema>;
export const GetSessionsResponseSchema: z.ZodType<GetSessionsResponse> =
  _GetSessionsResponseSchema;

export const CreateSessionBodySchema = SessionInsertSchema.pick({
  name: true,
  notes: true,
}).extend({
  // API currently requires both fields to be strings
  name: z.string(),
  notes: z.string(),
});
export type CreateSessionBody = z.infer<typeof CreateSessionBodySchema>;

export const CreateSessionDataSchema = z.object({ id: z.number() });
const _CreateSessionResponseSchema = ApiResponseSchema(CreateSessionDataSchema);
export type CreateSessionResponse = z.infer<typeof _CreateSessionResponseSchema>;
export const CreateSessionResponseSchema: z.ZodType<CreateSessionResponse> =
  _CreateSessionResponseSchema;
