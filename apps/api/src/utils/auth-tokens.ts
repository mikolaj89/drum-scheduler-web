import { SignJWT } from "jose";

export type Role = "OWNER" | "ADMIN" | "USER";

export async function signAccessToken(payload: {
  userId: string;
  accountId: string;
  role: Role;
}) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("Missing JWT_ACCESS_SECRET");

  const key = new TextEncoder().encode(secret);
  const ttlSeconds = Number(process.env.ACCESS_TOKEN_TTL_SECONDS ?? "900"); // 15min

  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ aid: payload.accountId, role: payload.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.userId)
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(key);
}
