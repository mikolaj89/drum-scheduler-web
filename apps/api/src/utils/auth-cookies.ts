export function getAuthCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // true on HTTPS prod
    sameSite: "lax" as const,
    path: "/",
  };
}
