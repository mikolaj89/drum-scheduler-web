export const USER_ID = "user-1";
export const ACCOUNT_ID = "account-1";
export const OTHER_ACCOUNT_ID = "account-2";
export const SESSION_ID = "session-1";
export const NEW_SESSION_ID = "new-session-id";
export const REFRESH_TOKEN = "refresh-token";
export const NEW_REFRESH_TOKEN = "new-refresh-token";
export const ACCESS_TOKEN = "access-token";
export const ROLE_ADMIN = "ADMIN";
export const ROLE_UNKNOWN = "UNKNOWN";
export const PASSWORD_HASH = "hash";
export const EMAIL = "test@example.com";

export const futureDate = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

export const validSession = () => ({
  id: SESSION_ID,
  userId: USER_ID,
  accountId: ACCOUNT_ID,
  refreshTokenHash: `${REFRESH_TOKEN}-hash`,
  createdAt: new Date().toISOString(),
  expiresAt: futureDate(),
  revokedAt: null,
  replacedBySessionId: null,
  userAgent: null,
  ip: null,
});

export const validUser = (overrides?: Partial<{
  id: string;
  accountId: string | null;
  email: string;
  role: string | null;
  isActive: boolean;
  passwordHash: string | null;
  createdAt: string | null;
}>) => ({
  id: USER_ID,
  accountId: ACCOUNT_ID,
  email: EMAIL,
  role: ROLE_ADMIN,
  isActive: true,
  passwordHash: PASSWORD_HASH,
  createdAt: new Date().toISOString(),
  ...overrides,
});
