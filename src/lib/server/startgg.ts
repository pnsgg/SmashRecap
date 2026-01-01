import { Startgg } from '$lib/startgg/oauth2';
import { env } from '$env/dynamic/private';

if (!env.STARTGG_CLIENT_ID || !env.STARTGG_CLIENT_SECRET || !env.STARTGG_REDIRECT_URI) {
    throw new Error('Missing Start.gg OAuth2 environment variables');
}

export const startgg = new Startgg(
    env.STARTGG_CLIENT_ID,
    env.STARTGG_CLIENT_SECRET,
    env.STARTGG_REDIRECT_URI
);
