import type { Role } from "./auth-tokens";

export type AuthUserLike = {
  role: string | null;
  accountId: string | null;
  passwordHash: string | null;
};

export function getValidAuthRole(user: AuthUserLike): Role | null {
  if (!user.accountId || !user.passwordHash) return null;

  if (user.role === "OWNER" || user.role === "ADMIN" || user.role === "USER") {
    return user.role;
  }

  return null;
}
