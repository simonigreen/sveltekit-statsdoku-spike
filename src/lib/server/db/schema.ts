import { pgTable, integer, timestamp, serial } from 'drizzle-orm/pg-core';

export const puzzleCompletions = pgTable('puzzle-completions', {
	id: serial('id').primaryKey(),
	puzzle_date: timestamp('puzzle_date').defaultNow().notNull(),
	completionTime: integer('completion_time').notNull()
});
