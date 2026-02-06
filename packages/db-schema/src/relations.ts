import { relations } from "drizzle-orm/relations";
import { sessions, sessionexercises, exercises, accounts, users, authSessions, categories } from "./schema";

export const sessionexercisesRelations = relations(sessionexercises, ({one}) => ({
	session: one(sessions, {
		fields: [sessionexercises.sessionId],
		references: [sessions.id]
	}),
	exercise: one(exercises, {
		fields: [sessionexercises.exerciseId],
		references: [exercises.id]
	}),
}));

export const sessionsRelations = relations(sessions, ({many}) => ({
	sessionexercises: many(sessionexercises),
}));

export const exercisesRelations = relations(exercises, ({one, many}) => ({
	sessionexercises: many(sessionexercises),
	category: one(categories, {
		fields: [exercises.categoryId],
		references: [categories.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	account: one(accounts, {
		fields: [users.accountId],
		references: [accounts.id]
	}),
	authSessions: many(authSessions),
}));

export const accountsRelations = relations(accounts, ({many}) => ({
	users: many(users),
	authSessions: many(authSessions),
}));

export const authSessionsRelations = relations(authSessions, ({one, many}) => ({
	user: one(users, {
		fields: [authSessions.userId],
		references: [users.id]
	}),
	account: one(accounts, {
		fields: [authSessions.accountId],
		references: [accounts.id]
	}),
	authSession: one(authSessions, {
		fields: [authSessions.replacedBySessionId],
		references: [authSessions.id],
		relationName: "authSessions_replacedBySessionId_authSessions_id"
	}),
	authSessions: many(authSessions, {
		relationName: "authSessions_replacedBySessionId_authSessions_id"
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	exercises: many(exercises),
}));