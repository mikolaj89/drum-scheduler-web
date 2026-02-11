// src/routes/auth/refresh.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { createAuthSession, getAuthSessionByRefreshHash, revokeAuthSession } from "../../db/auth-sessions";
import { randomToken, sha256Base64Url } from "../../utils/crypto";
import { getFormattedErrorBody } from "../../utils/response";
import { getUserById } from "../../db/users";
import { signAccessToken } from "../../utils/auth-tokens";
import { hasAuthCredentials, parseRole } from "../../utils/auth-validation";


export const refresh = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // 1) Read refresh token from cookie
  const refreshToken = (request.cookies as any)?.refresh as string | undefined;
  if (!refreshToken) {
    return reply.code(401).send(getFormattedErrorBody("Refresh token missing", "UNAUTHORIZED"));
  }

    // 2) Load session row by refresh token hash
    const refreshHash = sha256Base64Url(refreshToken);
    const sessions = await getAuthSessionByRefreshHash(refreshHash);
    const session = sessions[0];
    if (!session) {
      return reply.code(401).send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
    }

    // 3) Validate session state (expiry / revocation)
    const isExpired = new Date(session.expiresAt as string).getTime() <= Date.now();
    const isRevoked = !!session.revokedAt;

    if (isExpired || isRevoked) {
      // optional strict mode: if revoked AND replaced_by_session_id exists, treat as reuse
      return reply.code(401).send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
    }

    if (!session.accountId) {
      console.warn("auth.refresh: missing accountId on session", {
        sessionId: session.id,
        userId: session.userId,
      });
      return reply.code(401).send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
    }

    // 4) Load user and validate credentials/role
    const userRes = await getUserById(session.userId);

    const [user] = userRes;
    if (!user || !user.isActive) {
      return reply.code(401).send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
    }

    if (user.accountId !== session.accountId) {
      console.warn("auth.refresh: account mismatch", {
        userId: user.id,
        sessionAccountId: session.accountId,
        userAccountId: user.accountId,
      });
      return reply.code(401).send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
    }

    const parsedRole = parseRole(user.role);
    if (!parsedRole || !hasAuthCredentials(user)) {
      console.warn("auth.refresh: missing auth credentials or invalid role", {
        userId: user.id,
        hasAccountId: Boolean(user.accountId),
        hasPasswordHash: Boolean(user.passwordHash),
        role: user.role,
      });
      return reply.code(401).send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
    }

    // 5) Rotate refresh: create new session and revoke old one
    const newRefreshToken = randomToken(48);
    const newRefreshHash = sha256Base64Url(newRefreshToken);

    const refreshDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
    const newExpiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    const newSessionRes = await createAuthSession({
      userId: session.userId,
      accountId: session.accountId,
      refreshTokenHash: newRefreshHash,
      expiresAt: newExpiresAt,
      userAgent: (request.headers["user-agent"] ?? null) as string | null,
      ip: (request.ip ?? null) as string | null,
    });

    const newSessionId = newSessionRes[0]!.id;

    await revokeAuthSession(session.id, newSessionId);
   
    
    // 6) Issue new access token
    const accessToken = await signAccessToken({
      userId: session.userId,
      accountId: session.accountId,
      role: parsedRole,
    });
    // 7) Set new refresh cookie
    reply.setCookie("refresh", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/auth",
      expires: newExpiresAt,
    });

    return reply.code(200).send({ accessToken });
};
