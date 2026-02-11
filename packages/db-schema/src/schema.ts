import { pgTable, foreignKey, unique, serial, integer, text, varchar, timestamp, uuid, index, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const sessionexercises = pgTable("sessionexercises", {
	id: serial().primaryKey().notNull(),
	sessionId: integer("session_id"),
	exerciseId: integer("exercise_id"),
	orderIndex: integer("order_index"),
	durationMinutes: integer("duration_minutes"),
	bpm: integer(),
	notes: text(),
}, (table) => [
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [sessions.id],
			name: "sessionexercises_session_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [exercises.id],
			name: "sessionexercises_exercise_id_fkey"
		}).onDelete("cascade"),
	unique("sessionexercises_session_id_exercise_id_key").on(table.sessionId, table.exerciseId),
]);

export const sessions = pgTable("sessions", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	sessionDate: timestamp("session_date", { mode: 'string' }).defaultNow(),
	totalDuration: integer("total_duration"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastFinishDate: timestamp("last_finish_date", { mode: 'string' }),
});

export const accounts = pgTable("accounts", {
	id: uuid().primaryKey().notNull(),
	name: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	accountId: uuid("account_id"),
	email: text(),
	passwordHash: text("password_hash"),
	role: text(),
	isActive: boolean("is_active"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("users_account_id_idx").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "users_account_id_fkey"
		}),
	unique("users_email_key").on(table.email),
]);

export const authSessions = pgTable("auth_sessions", {
	id: uuid().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	accountId: uuid("account_id"),
	refreshTokenHash: text("refresh_token_hash"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
	replacedBySessionId: uuid("replaced_by_session_id"),
	userAgent: text("user_agent"),
	ip: text(),
}, (table) => [
	index("idx_auth_sessions_account_id").using("btree", table.accountId.asc().nullsLast().op("uuid_ops")),
	index("idx_auth_sessions_expires_at").using("btree", table.expiresAt.asc().nullsLast().op("timestamp_ops")),
	index("idx_auth_sessions_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "auth_sessions_user_id_fkey"
		}),
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [accounts.id],
			name: "auth_sessions_account_id_fkey"
		}),
	foreignKey({
			columns: [table.replacedBySessionId],
			foreignColumns: [table.id],
			name: "auth_sessions_replaced_by_session_id_fkey"
		}),
	unique("auth_sessions_refresh_token_hash_key").on(table.refreshTokenHash),
]);

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("categories_name_key").on(table.name),
]);

export const exercises = pgTable("exercises", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	categoryId: integer("category_id"),
	description: text(),
	durationMinutes: integer("duration_minutes"),
	bpm: integer(),
	mp3Url: text("mp3_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "exercises_category_fk "
		}).onDelete("restrict"),
	unique("exercises_name_key").on(table.name),
]);
