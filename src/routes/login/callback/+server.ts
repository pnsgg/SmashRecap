import { startgg } from '$lib/server/startgg';
import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { localizeHref } from '$lib/paraglide/runtime';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    error(400, 'Missing authorization code');
  }

  const token = await startgg.validateAuthorizationCode(code, ['user.identity', 'user.email']);
  if (!token) {
    error(400, 'Invalid authorization code');
  }

  const userId = await startgg.getAuthenticatedUserId(token.access_token);
  if (!userId) {
    error(400, 'Invalid user');
  }

  cookies.set('access_token', token.access_token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: token.expires_in
  });

  return redirect(302, localizeHref(`/user/${userId}`));
};
