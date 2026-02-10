// src/routes/auth.ts
import type { FastifyPluginAsync } from "fastify";
import bcrypt from "bcryptjs";
import { createAuthSession } from "../../db/auth-sessions";
import { getUserByEmail } from "../../db/users";
import { getAuthCookieOptions } from "../../utils/auth-cookies";
import { signAccessToken, type Role } from "../../utils/auth-tokens";
import { randomToken, sha256Base64Url } from "../../utils/crypto";
import { getValidAuthRole } from "../../utils/auth-validation";
import { getFormattedErrorBody } from "../../utils/response";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/auth/login", async (req, reply) => {
    // 1) Parse input
    const body = req.body as { email?: string; password?: string };
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password ?? "";

    if (!email || !password) {
        
      return reply.code(400).send(getFormattedErrorBody("Email and password are required", "BAD_REQUEST"));
    }

    // 2) Load user
    const users = await getUserByEmail(email);
    const user = users[0];
    if (!user || !user.isActive) {
      // avoid leaking whether user exists
      return reply.code(401).send(getFormattedErrorBody("Invalid credentials", "UNAUTHORIZED"));
    }

    const roleValue = getValidAuthRole(user);
    if (!roleValue) {
      return reply.code(401).send(getFormattedErrorBody("Invalid credentials", "UNAUTHORIZED"));
    }

    // 3) Verify password (bcrypt)
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
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
      userAgent: (req.headers["user-agent"] ?? null) as string | null,
      ip: (req.ip ?? null) as string | null,
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
      user: { id: user.id, accountId: user.accountId, role: user.role as Role },
    });
  });
};
