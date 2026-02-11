import crypto from "node:crypto";
import { eq } from "drizzle-orm";
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
  }).returning();
}

export async function getAuthSessionByRefreshHash(refreshTokenHash: string) {
  return await db
    .select()
    .from(authSessionsSchema)
    .where(eq(authSessionsSchema.refreshTokenHash, refreshTokenHash))
    .limit(1);
}

export async function revokeAuthSession(sessionId: string, replacedBySessionId: string | null = null) {
  const revokedAtValue = new Date().toISOString();

  return await db
    .update(authSessionsSchema)
    .set({ revokedAt: revokedAtValue, replacedBySessionId })
    .where(eq(authSessionsSchema.id, sessionId));
}