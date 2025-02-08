import { db } from '$lib/server/db';
import { puzzleCompletions } from '$lib/server/db/schema';

export const load = async () => {
	return {
		puzzleCompletions: db.select().from(puzzleCompletions)
	};
};
