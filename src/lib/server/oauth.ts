import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { dev } from '$app/environment';

const baseUrl = dev ? 'http://localhost:5173' : `https://sveltekit-statsdoku-spike.vercel.app`;

export const google = new Google(
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	`${baseUrl}/login/google/callback`
);
