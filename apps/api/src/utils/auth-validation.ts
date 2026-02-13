import type { Role } from "./auth-tokens";

export type AuthUserLike = {
  role: string | null;
  accountId: string | null;
  passwordHash: string | null;
};

export function isValidRole(role: string | null): role is Role {
  return role === "OWNER" || role === "ADMIN" || role === "USER";
}

export function hasAuthCredentials(
  user: AuthUserLike
): user is AuthUserLike & { accountId: string; passwordHash: string } {
  return Boolean(user.accountId && user.passwordHash);
}

export function parseRole(role: string | null): Role | null {
  return isValidRole(role) ? role : null;
}
