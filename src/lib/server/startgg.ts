import { env } from '$env/dynamic/private';
import { Startgg } from '$lib/startgg/oauth2';

export const startgg = new Startgg(
  env.STARTGG_CLIENT_ID,
  env.STARTGG_CLIENT_SECRET,
  env.STARTGG_REDIRECT_URI
);
