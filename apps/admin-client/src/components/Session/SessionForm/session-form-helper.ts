import { z } from "zod";
import { requireStr } from "@/utils/validation";
import type { Session } from "@drum-scheduler/contracts";
const MIN_NAME_LENGTH = 5;

export const sessionSchema = z.object({
  name: requireStr(z.string(), "Name").refine(
    (val) => val.length >= MIN_NAME_LENGTH,
    `Minimum name length is ${MIN_NAME_LENGTH}`
  ),

  notes: z.string().nullable(),
});

export type SessionFormData = Pick<Session, "name" | "notes">;
