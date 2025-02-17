import { pgTable, integer, timestamp, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const puzzleCompletions = pgTable('puzzle-completions', {
	id: serial('id').primaryKey(),
	puzzle_date: timestamp('puzzle_date').defaultNow().notNull(),
	completionTime: integer('completion_time').notNull(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id)
});

export const users = pgTable('users', {
	id: integer('id').primaryKey(),
	googleId: text('google_id').notNull().unique(),
	name: text('name').notNull()
});

export const sessions = pgTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export const puzzleCompletionsRelations = relations(puzzleCompletions, ({ one }) => ({
	user: one(users, {
		fields: [puzzleCompletions.userId],
		references: [users.id]
	})
}));
