import { eq } from "drizzle-orm";
import { db } from "./drizzle";
import { usersSchema } from "./schema";

export async function getUserByEmail(email: string) {
  return await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.email, email))
    .limit(1);
}
