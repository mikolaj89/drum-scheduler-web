import Fastify from "fastify";
import cookie from "@fastify/cookie";
import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import authRoutes from "../auth";
import { createAuthSession } from "../../db/auth-sessions";
import { getUserByEmail } from "../../db/users";
import { signAccessToken } from "../../utils/auth-tokens";
import { randomToken, sha256Base64Url } from "../../utils/crypto";

vi.mock("../../db/users", () => ({
  getUserByEmail: vi.fn(),
}));

vi.mock("../../db/auth-sessions", () => ({
  createAuthSession: vi.fn(),
}));

vi.mock("../../utils/auth-tokens", () => ({
  signAccessToken: vi.fn(),
}));

vi.mock("../../utils/crypto", () => ({
  randomToken: vi.fn(),
  sha256Base64Url: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

const getUserByEmailMock = vi.mocked(getUserByEmail);
const createAuthSessionMock = vi.mocked(createAuthSession);
const signAccessTokenMock = vi.mocked(signAccessToken);
const randomTokenMock = vi.mocked(randomToken);
const sha256Base64UrlMock = vi.mocked(sha256Base64Url);
const bcryptCompareMock = vi.mocked(
  bcrypt.compare as unknown as (data: string, encrypted: string) => Promise<boolean>
);

const buildApp = async () => {
  const app = Fastify({ logger: false });
  await app.register(cookie);
  await app.register(authRoutes);
  return app;
};

describe("POST /auth/login", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    randomTokenMock.mockReturnValue("refresh-token");
    sha256Base64UrlMock.mockReturnValue("refresh-hash");
    signAccessTokenMock.mockResolvedValue("access-token");
    createAuthSessionMock.mockResolvedValue([]);
    bcryptCompareMock.mockResolvedValue(true);
  });

  it("returns 400 when email or password missing", async () => {
    const app = await buildApp();

    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: {},
    });

    expect(res.statusCode).toBe(400);
    const body = res.json();
    expect(body.error?.errorCode).toBe("BAD_REQUEST");

    await app.close();
  });

  it("returns 401 when user not found", async () => {
    getUserByEmailMock.mockResolvedValue([]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "test@example.com", password: "pass" },
    });

    expect(res.statusCode).toBe(401);
    const body = res.json();
    expect(body.error?.errorCode).toBe("UNAUTHORIZED");

    await app.close();
  });

  it("returns 401 when user inactive", async () => {
    getUserByEmailMock.mockResolvedValue([
      {
        id: "user-1",
        accountId: "account-1",
        email: "test@example.com",
        passwordHash: "hash",
        role: "ADMIN",
        isActive: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "test@example.com", password: "pass" },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when role invalid or auth credentials missing", async () => {
    getUserByEmailMock.mockResolvedValue([
      {
        id: "user-1",
        accountId: null,
        email: "test@example.com",
        passwordHash: null,
        role: "UNKNOWN",
        isActive: true,
         createdAt: new Date().toISOString(),
      },
    ]);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "test@example.com", password: "pass" },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 401 when password mismatch", async () => {
    getUserByEmailMock.mockResolvedValue([
      {
        id: "user-1",
        accountId: "account-1",
        email: "test@example.com",
        passwordHash: "hash",
        role: "USER",
        isActive: true,
            createdAt: new Date().toISOString(),
      },
    ]);
    bcryptCompareMock.mockResolvedValue(false);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "test@example.com", password: "pass" },
    });

    expect(res.statusCode).toBe(401);
    await app.close();
  });

  it("returns 200 with tokens and sets refresh cookie", async () => {
    getUserByEmailMock.mockResolvedValue([
      {
        id: "user-1",
        accountId: "account-1",
        email: "test@example.com",
        passwordHash: "hash",
        role: "ADMIN",
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ]);
    bcryptCompareMock.mockResolvedValue(true);

    const app = await buildApp();
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "test@example.com", password: "pass" },
      headers: { "user-agent": "vitest" },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.accessToken).toBe("access-token");
    expect(body.user).toEqual({
      id: "user-1",
      accountId: "account-1",
      role: "ADMIN",
    });

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toContain("refresh=refresh-token");

    expect(createAuthSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        accountId: "account-1",
        refreshTokenHash: "refresh-hash",
      })
    );

    await app.close();
  });
});
