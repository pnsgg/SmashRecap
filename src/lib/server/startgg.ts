import {
  STARTGG_CLIENT_ID,
  STARTGG_CLIENT_SECRET,
  STARTGG_REDIRECT_URI
} from '$env/static/private';
import { Startgg } from '$lib/startgg/oauth2';

if (!STARTGG_CLIENT_ID || !STARTGG_CLIENT_SECRET || !STARTGG_REDIRECT_URI) {
  throw new Error('Missing Start.gg OAuth2 environment variables');
}

export const startgg = new Startgg(STARTGG_CLIENT_ID, STARTGG_CLIENT_SECRET, STARTGG_REDIRECT_URI);
