import crypto from "node:crypto";
import { db } from "./drizzle";
import { authSessionsSchema } from "./schema";

export async function createAuthSession(params: {
  userId: string;
  accountId: string | null;
  refreshTokenHash: string;
  expiresAt: Date | string;
  userAgent: string | null;
  ip: string | null;
}) {
  const { userId, accountId, refreshTokenHash, expiresAt, userAgent, ip } = params;
  const expiresAtValue =
    typeof expiresAt === "string" ? expiresAt : expiresAt.toISOString();
  const createdAtValue = new Date().toISOString();

  return await db.insert(authSessionsSchema).values({
    id: crypto.randomUUID(),
    userId,
    accountId,
    refreshTokenHash,
    createdAt: createdAtValue,
    expiresAt: expiresAtValue,
    revokedAt: null,
    replacedBySessionId: null,
    userAgent,
    ip,
  });
}
