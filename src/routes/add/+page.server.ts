import { db } from '$lib/server/db';
import { puzzleCompletions } from '$lib/server/db/schema';
import type { Actions } from './$types';
import type { RequestEvent } from './$types';
import { startOfDay, endOfDay } from 'date-fns';
import { and, gte, lte } from 'drizzle-orm';

export const actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();
		const seconds = data.get('seconds');
		const minutes = data.get('minutes');

		const today = new Date();
		const existingCompletion = await db
			.select()
			.from(puzzleCompletions)
			.where(
				and(
					gte(puzzleCompletions.puzzle_date, startOfDay(today)),
					lte(puzzleCompletions.puzzle_date, endOfDay(today))
				)
			)
			.limit(1);

		if (existingCompletion.length > 0) {
			return {
				success: false,
				error: `You've already submitted a completion time today`
			};
		}

		const mins = minutes === '' ? 0 : parseInt(minutes?.toString() || '');
		const secs = seconds === '' ? 0 : parseInt(seconds?.toString() || '');
		const totalSeconds = mins * 60 + secs;

		const [newCompletion] = await db
			.insert(puzzleCompletions)
			.values({
				completionTime: totalSeconds
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
	}
} satisfies Actions;
