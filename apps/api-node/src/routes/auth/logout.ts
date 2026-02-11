// src/routes/auth/logout.ts
import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuthSessionByRefreshHash, revokeAuthSession } from "../../db/auth-sessions";
import { getAuthCookieOptions } from "../../utils/auth-cookies";
import { sha256Base64Url } from "../../utils/crypto";
import { getFormattedErrorBody } from "../../utils/response";

export const logout = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const refreshToken = (request.cookies as any)?.refresh as string | undefined;
  if (!refreshToken) {
    return reply
      .code(401)
      .send(getFormattedErrorBody("Refresh token missing", "UNAUTHORIZED"));
  }

  const refreshHash = sha256Base64Url(refreshToken);
  const sessions = await getAuthSessionByRefreshHash(refreshHash);
  const session = sessions[0];
  if (!session) {
    return reply
      .code(401)
      .send(getFormattedErrorBody("Invalid refresh token", "UNAUTHORIZED"));
  }

  await revokeAuthSession(session.id, null);

  reply.clearCookie("refresh", {
    ...getAuthCookieOptions(),
  });

  return reply.code(204).send();
};
