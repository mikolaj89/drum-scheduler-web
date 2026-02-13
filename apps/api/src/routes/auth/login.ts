// src/routes/auth/login.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { createAuthSession } from "../../db/auth-sessions";
import { getUserByEmail } from "../../db/users";
import { getAuthCookieOptions } from "../../utils/auth-cookies";
import { signAccessToken, type Role } from "../../utils/auth-tokens";
import { randomToken, sha256Base64Url } from "../../utils/crypto";
import { hasAuthCredentials, parseRole } from "../../utils/auth-validation";
import { getFormattedErrorBody } from "../../utils/response";

type Body = { email?: string; password?: string };

export const login = async (
  request: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply
) => {
  // 1) Parse input
  const body = request.body as Body;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return reply
      .code(400)
      .send(getFormattedErrorBody("Email and password are required", "BAD_REQUEST"));
  }

  // 2) Load user
  const users = await getUserByEmail(email);
  const user = users[0];
  if (!user || !user.isActive) {
    console.warn("auth.login: invalid user or inactive", {
      email,
      hasUser: Boolean(user),
      isActive: user?.isActive ?? null,
    });
    // avoid leaking whether user exists
    return reply.code(401).send(getFormattedErrorBody("Invalid credentials", "UNAUTHORIZED"));
  }

  const roleValue = parseRole(user.role);
  if (!roleValue || !hasAuthCredentials(user)) {
    console.warn("auth.login: missing auth credentials or invalid role", {
      userId: user.id,
      hasAccountId: Boolean(user.accountId),
      hasPasswordHash: Boolean(user.passwordHash),
      role: user.role,
    });
    return reply.code(401).send(getFormattedErrorBody("Invalid credentials", "UNAUTHORIZED"));
  }

  // 3) Verify password (bcrypt)
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    console.warn("auth.login: password mismatch", { userId: user.id });
    return reply.code(401).send(getFormattedErrorBody("Invalid credentials", "UNAUTHORIZED"));
  }

  // 4) Create access JWT
  const accessToken = await signAccessToken({
    userId: user.id,
    accountId: user.accountId,
    role: roleValue as Role,
  });

  // 5) Create refresh token + DB session row (store only hash)
  const refreshToken = randomToken(48);
  const refreshHash = sha256Base64Url(refreshToken);

  const refreshDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? "30");
  const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

  await createAuthSession({
    userId: user.id,
    accountId: user.accountId,
    refreshTokenHash: refreshHash,
    expiresAt,
    userAgent: (request.headers["user-agent"] ?? null) as string | null,
    ip: (request.ip ?? null) as string | null,
  });

  // 6) Set refresh cookie
  // Option A: store raw refresh token in cookie (server stores hash in DB)
  reply.setCookie("refresh", refreshToken, {
    ...getAuthCookieOptions(),
    expires: expiresAt,
  });

  // 7) Return access token
  return reply.code(200).send({
    accessToken,
    user: { id: user.id, accountId: user.accountId, role: roleValue },
  });
};
