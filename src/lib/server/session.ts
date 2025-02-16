import { addDays, isBefore, addMonths } from 'date-fns';
import { db } from './db';
import { sessions } from './db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import type { RequestEvent } from '@sveltejs/kit';

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const expiresAt = addMonths(new Date(), 1);

	const [session] = await db
		.insert(sessions)
		.values({
			id: sessionId,
			userId,
			expiresAt
		})
		.returning();

	if (!session) {
		throw new Error('Failed to create session');
	}

	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session = await db.query.sessions.findFirst({
		where: eq(sessions.id, sessionId),
		with: {
			user: {
				columns: {
					id: true,
					googleId: true,
					name: true
				}
			}
		}
	});

	if (!session) {
		return { session: null, user: null };
	}

	const now = new Date();

	if (isBefore(session.expiresAt, now)) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	const fifteenDaysBeforeExpiry = addDays(session.expiresAt, -15);
	if (isBefore(fifteenDaysBeforeExpiry, now)) {
		const newExpiresAt = addMonths(now, 1);
		await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, session.id));
		session.expiresAt = newExpiresAt;
	}

	return {
		session: {
			id: session.id,
			userId: session.userId,
			expiresAt: session.expiresAt
		},
		user: session.user
			? {
					id: session.user.id,
					googleId: session.user.googleId,
					name: session.user.name
				}
			: null
	};
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateUserSessions(userId: number): Promise<void> {
	await db.delete(sessions).where(eq(sessions.userId, userId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}
