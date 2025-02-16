import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

interface User {
	id: number;
	googleId: string;
	name: string;
}

export async function createUser(googleId: string, name: string): Promise<User> {
	const [user] = await db
		.insert(users)
		.values({
			googleId,
			name
		})
		.returning();

	if (!user) {
		throw new Error('Failed to create user');
	}

	return user;
}

export async function getUserFromGoogleId(googleId: string): Promise<User | null> {
	return await db.query.users.findFirst({
		where: eq(users.googleId, googleId)
	});
}
