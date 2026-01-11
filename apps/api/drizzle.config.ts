// drizzle.config.ts
import { parseDotenv } from "./utils/parse-dot-env.ts";

const deno = (globalThis as unknown as {
  Deno?: {
    readTextFileSync?: (path: URL | string) => string;
    env?: { get?: (k: string) => string | undefined };
  };
}).Deno;

const readLocalEnv = (): Record<string, string> => {
  try {
    const content = deno?.readTextFileSync?.(new URL("./local.env", import.meta.url));
    if (!content) return {};
    return parseDotenv(content);
  } catch {
    return {};
  }
};

const getDbUrl = (): string => {
  const fromRuntime = deno?.env?.get?.("DB_URL");
  if (fromRuntime) return fromRuntime;

  const fromFile = readLocalEnv().DB_URL;
  if (fromFile) return fromFile;

  throw new Error(
    "DB_URL is missing. Define it in apps/api/local.env (DB_URL=...) or export DB_URL in the environment.",
  );
};

export default {
  dialect: "postgresql",
  out: "../../packages/db-schema/src",
  dbCredentials: {
    url: getDbUrl(),
  },
};
