// src/config/auth.ts
import type { Env } from "./env";

export function authConfig(env: Env) {
  const isProd = env.NODE_ENV === "production";

  // allow override (useful behind proxies / local https)
  const cookieSecure =
    env.COOKIE_SECURE !== undefined ? env.COOKIE_SECURE === "true" : isProd;

  return {
    accessTtlSeconds: env.ACCESS_TOKEN_TTL_SECONDS,
    refreshTtlDays: env.REFRESH_TOKEN_TTL_DAYS,

    cookie: {
      name: "refresh",
      httpOnly: true,
      secure: cookieSecure,
      sameSite: env.COOKIE_SAMESITE,
      domain: env.COOKIE_DOMAIN, // usually undefined
      path: "/auth",
    },
  };
}
