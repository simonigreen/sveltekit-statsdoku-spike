import { db } from '$lib/server/db';
import { puzzleCompletions } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/session';
import { startOfDay, endOfDay } from 'date-fns';
import { and, gte, lte, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.session === null || event.locals.user === null) {
		throw redirect(302, '/login');
	}
	return {
		user: event.locals.user
	};
};

export const actions: Actions = {
	add: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}

		const data = await event.request.formData();
		const seconds = data.get('seconds');
		const minutes = data.get('minutes');

		// Validate input types
		if (typeof seconds !== 'string' || typeof minutes !== 'string') {
			return {
				success: false,
				error: 'Invalid input types'
			};
		}

		const mins = minutes === '' ? 0 : parseInt(minutes);
		const secs = seconds === '' ? 0 : parseInt(seconds);

		// Validate number ranges
		if (isNaN(mins) || isNaN(secs) || mins < 0 || secs < 0 || mins > 60 || secs > 59) {
			return {
				success: false,
				error: 'Invalid time values. Minutes must be 0-60, seconds must be 0-59'
			};
		}

		const totalSeconds = mins * 60 + secs;

		// Validate reasonable completion time
		if (totalSeconds < 1 || totalSeconds > 7200) {
			return {
				success: false,
				error: 'Completion time must be between 1 second and 2 hours'
			};
		}

		const today = new Date();
		const existingCompletion = await db
			.select()
			.from(puzzleCompletions)
			.where(
				and(
					gte(puzzleCompletions.puzzle_date, startOfDay(today)),
					lte(puzzleCompletions.puzzle_date, endOfDay(today)),
					eq(puzzleCompletions.userId, event.locals.user.id) // Add user check
				)
			)
			.limit(1);

		if (existingCompletion.length > 0) {
			return {
				success: false,
				error: `You've already submitted a completion time today`
			};
		}

		const [newCompletion] = await db
			.insert(puzzleCompletions)
			.values({
				completionTime: totalSeconds,
				userId: event.locals.user.id // Associate completion with user
			})
			.returning();

		if (newCompletion) {
			return {
				success: true,
				message: 'Completion time saved successfully'
			};
		}

		return {
			success: false,
			error: 'Failed to save completion time'
		};
	},

	logout: async (event) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		throw redirect(302, '/login');
	}
};
