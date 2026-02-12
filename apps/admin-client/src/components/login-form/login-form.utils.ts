
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@drum-scheduler/config";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password cannot be empty")
    .min(
      MIN_PASSWORD_LENGTH,
      `Minimum password length is ${MIN_PASSWORD_LENGTH}`
    ),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;