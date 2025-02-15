import { db } from '$lib/server/db';
import { puzzleCompletions } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		puzzleCompletions: db.select().from(puzzleCompletions)
	};
};
