// src/config/env.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32), // HS256 shared secret
  ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().default(15 * 60), // 15 min

  // Refresh
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(30),

  // Cookies
  COOKIE_SECURE: z
    .preprocess((v) => (v === undefined ? undefined : String(v)), z.enum(["true", "false"]))
    .optional(),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
  COOKIE_DOMAIN: z.string().optional(), // set only if you need cross-subdomain cookies
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // fail fast
    console.error(parsed.error.format());
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}
