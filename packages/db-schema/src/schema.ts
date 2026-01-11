import { pgTable, unique, serial, varchar, timestamp, integer, text, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_username_key").on(table.username),
	unique("users_email_key").on(table.email),
]);

export const sessions = pgTable("sessions", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	sessionDate: timestamp("session_date", { mode: 'string' }).defaultNow(),
	totalDuration: integer("total_duration"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

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
