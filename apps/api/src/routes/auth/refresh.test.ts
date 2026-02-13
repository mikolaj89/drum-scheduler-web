import Fastify from "fastify";
import cookie from "@fastify/cookie";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authRoutes from "../auth";
import {
  getAuthSessionByRefreshHash,
  createAuthSession,
  revokeAuthSession,
} from "../../db/auth-sessions";
import { getUserById } from "../../db/users";
import { signAccessToken } from "../../utils/auth-tokens";
import { randomToken, sha256Base64Url } from "../../utils/crypto";
import {
  ACCESS_TOKEN,
  ACCOUNT_ID,
  NEW_REFRESH_TOKEN,
  NEW_SESSION_ID,
  OTHER_ACCOUNT_ID,
  REFRESH_TOKEN,
  ROLE_UNKNOWN,
  SESSION_ID,
  USER_ID,
  futureDate,
  validSession,
  validUser,
} from "./refresh.test.utils";

vi.mock("../../db/auth-sessions", () => ({
  getAuthSessionByRefreshHash: vi.fn(),
  createAuthSession: vi.fn(),
  revokeAuthSession: vi.fn(),
}));

vi.mock("../../db/users", () => ({
  getUserById: vi.fn(),
}));

vi.mock("../../utils/auth-tokens", () => ({
  signAccessToken: vi.fn(),
}));

vi.mock("../../utils/crypto", () => ({
  randomToken: vi.fn(),
  sha256Base64Url: vi.fn(),
}));

const getAuthSessionByRefreshHashMock = vi.mocked(getAuthSessionByRefreshHash);
const createAuthSessionMock = vi.mocked(createAuthSession);
const revokeAuthSessionMock = vi.mocked(revokeAuthSession);
const getUserByIdMock = vi.mocked(getUserById);
const signAccessTokenMock = vi.mocked(signAccessToken);
const randomTokenMock = vi.mocked(randomToken);
const sha256Base64UrlMock = vi.mocked(sha256Base64Url);

const buildApp = async () => {
  const app = Fastify({ logger: false });
  await app.register(cookie);
  await app.register(authRoutes);
  return app;
};

describe("POST /auth/refresh", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    randomTokenMock.mockReturnValue(NEW_REFRESH_TOKEN);
    sha256Base64UrlMock.mockImplementation((value: string) => `${value}-hash`);
    signAccessTokenMock.mockResolvedValue(ACCESS_TOKEN);
    createAuthSessionMock.mockResolvedValue([
      {
        userId: USER_ID,
        id: NEW_SESSION_ID,
        refreshTokenHash: `${NEW_REFRESH_TOKEN}-hash`,
        accountId: ACCOUNT_ID,
        createdAt: new Date().toISOString(),
        expiresAt: futureDate(),
        revokedAt: null,
        replacedBySessionId: null,
        userAgent: null,
        ip: null,
      },
    ]);
    revokeAuthSessionMock.mockResolvedValue(
      {} as Awaited<ReturnType<typeof revokeAuthSession>>
    );
  });

  it("returns 401 when refresh cookie missing", async () => {
    const app = await buildApp();

    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
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
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when session expired", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([
      {
        ...validSession(),
        expiresAt: new Date(Date.now() - 1000).toISOString(),
      },
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when session revoked", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([
      { ...validSession(), revokedAt: new Date().toISOString() },
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when session accountId missing", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([
      { ...validSession(), accountId: null },
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when user inactive", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([validSession()]);
    getUserByIdMock.mockResolvedValue([validUser({ isActive: false })]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when account mismatch", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([validSession()]);
    getUserByIdMock.mockResolvedValue([
      validUser({ accountId: OTHER_ACCOUNT_ID }),
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when role invalid or credentials missing", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([validSession()]);
    getUserByIdMock.mockResolvedValue([
      validUser({ role: ROLE_UNKNOWN, passwordHash: null }),
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 200 with new access token and refresh cookie", async () => {
    getAuthSessionByRefreshHashMock.mockResolvedValue([validSession()]);
    getUserByIdMock.mockResolvedValue([validUser()]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/refresh",
      headers: { cookie: `refresh=${REFRESH_TOKEN}` },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.accessToken).toBe(ACCESS_TOKEN);

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toContain(`refresh=${NEW_REFRESH_TOKEN}`);

    expect(createAuthSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: USER_ID,
        accountId: ACCOUNT_ID,
        refreshTokenHash: `${NEW_REFRESH_TOKEN}-hash`,
      }),
    );

    expect(revokeAuthSessionMock).toHaveBeenCalledWith(
      SESSION_ID,
      NEW_SESSION_ID,
    );

    await app.close();
  });
});
