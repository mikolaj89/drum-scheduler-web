import { z } from "zod";
import { ApiResponseSchema } from "../response.js";
import { CategorySchema } from "./db.js";

const _GetCategoriesResponseSchema = ApiResponseSchema(z.array(CategorySchema));
export type GetCategoriesResponse = z.infer<typeof _GetCategoriesResponseSchema>;
export const GetCategoriesResponseSchema: z.ZodType<GetCategoriesResponse> =
	_GetCategoriesResponseSchema;
