import { db } from '$lib/server/db';
import { puzzleCompletions } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Check for authenticated session
	if (!event.locals.session || !event.locals.user) {
		throw redirect(302, '/login');
	}

	// Type guard for user ID
	if (!event.locals.user.id) {
		throw error(500, 'User ID is missing');
	}

	return {
		puzzleCompletions: await db
			.select()
			.from(puzzleCompletions)
			.where(eq(puzzleCompletions.userId, event.locals.user.id))
			.orderBy(desc(puzzleCompletions.puzzle_date)),
		user: event.locals.user
	};
};
