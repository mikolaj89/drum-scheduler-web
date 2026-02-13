import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authRoutes from "../auth";
import { getAuthSessionByRefreshHash, revokeAuthSession } from "../../db/auth-sessions";
import {
  ACCOUNT_ID,
  REFRESH_TOKEN,
  SESSION_ID,
  USER_ID,
} from "./refresh.test.utils";

vi.mock("../../db/auth-sessions", () => ({
  getAuthSessionByRefreshHash: vi.fn(),
  revokeAuthSession: vi.fn(),
}));

const getAuthSessionByRefreshHashMock = vi.mocked(getAuthSessionByRefreshHash);
const revokeAuthSessionMock = vi.mocked(revokeAuthSession);

const buildApp = async () => {
  const app = Fastify({ logger: false });
  await app.register(cookie);
  await app.register(authRoutes);
  return app;
};

describe("POST /auth/logout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    revokeAuthSessionMock.mockResolvedValue(
      {} as Awaited<ReturnType<typeof revokeAuthSession>>
    );
  });

  it("returns 401 when refresh cookie missing", async () => {
    const app = await buildApp();

    const res = await app.inject({
      method: "POST",
      url: "/auth/logout",
    });

    expect(res.statusCode).toBe(401);
    const body = res.json();
    expect(body.error?.errorCode).toBe("UNAUTHORIZED");

    await app.close();
  });

  it("returns 401 when session not found", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/logout",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("revokes session and clears cookie", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([
      {
        id: SESSION_ID,
        userId: USER_ID,
        accountId: ACCOUNT_ID,
        refreshTokenHash: "refresh-token-hash",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        revokedAt: null,
        replacedBySessionId: null,
        userAgent: null,
        ip: null,
      },
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/logout",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(204);
    expect(revokeAuthSessionMock).toHaveBeenCalledWith(SESSION_ID, null);

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toContain("refresh=");

    await app.close();
  });
});
