import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  exercisesSchema,
  categoriesSchema,
  usersSchema,
  sessionsSchema,
  sessionexercisesSchema,
  authSessionsSchema,
} from "./schema";
import { categoriesRelations, exercisesRelations } from "./relations";
import { tryReadFile } from "../utils/try-read-file";
import { parseDotenv } from "../utils/parse-dot-env";

const envFiles = ["local.env"];
let env = { ...process.env } as Record<string, string | undefined>;
let foundFrom: string | null = null;

if (!env.DB_URL) {
  for (const file of envFiles) {
    try {
      const content = await tryReadFile(file);
      if (!content) continue;
      const parsed = parseDotenv(content);
      if (parsed.DB_URL) {
        env.DB_URL = parsed.DB_URL;
        foundFrom = file + " (direct read)";
        break;
      }
    } catch (_e) {
      // ignore
    }
  }
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.DB_URL,
});

export const db = drizzle(pool, {
  schema: {
    exercisesSchema,
    exercisesRelations,
    categoriesRelations,
    categoriesSchema,
    usersSchema,
    sessionexercisesSchema,
    sessionsSchema,
    authSessionsSchema,
  },
});

if (foundFrom) {
  console.log(`DB_URL loaded from ${foundFrom}`);
}
