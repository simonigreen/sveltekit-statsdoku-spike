import { google } from '$lib/server/oauth';
import { ObjectParser } from '@pilcrowjs/object-parser';
import { createUser, getUserFromGoogleId } from '$lib/server/user';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/session';
import { decodeIdToken } from 'arctic';

import type { RequestEvent } from './$types';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	if (storedState === null || codeVerifier === null || code === null || state === null) {
		return new Response('Please restart the process.', {
			status: 400
		});
	}
	if (storedState !== state) {
		return new Response('Please restart the process.', {
			status: 400
		});
	}

	try {
		const tokens: OAuth2Tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const claims = decodeIdToken(tokens.idToken());
		const claimsParser = new ObjectParser(claims);

		const googleId = claimsParser.getString('sub');
		if (!googleId) {
			throw new Error('No Google ID found in token');
		}

		const name = claimsParser.getString('name') ?? 'Unknown User';

		let user = await getUserFromGoogleId(googleId);

		if (!user) {
			user = await createUser(googleId, name);
			if (!user || !user.id) {
				throw new Error('Failed to create user');
			}
		}

		if (!user.id) {
			throw new Error('User ID is missing');
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);

		if (!session) {
			throw new Error('Failed to create session');
		}

		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// Clean up OAuth cookies
		event.cookies.delete('google_oauth_state', { path: '/' });
		event.cookies.delete('google_code_verifier', { path: '/' });

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (error) {
		console.error('Authentication error:', error);
		return new Response('Authentication failed: ' + (error as Error).message, {
			status: 500
		});
	}
}
