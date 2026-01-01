import { startgg } from '$lib/server/startgg';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
  if (cookies.get('access_token')) {
    throw redirect(302, '/user/123');
  }

  const authorizationUrl = startgg.createAuthorizationURL(['user.identity', 'user.email']);

  throw redirect(302, authorizationUrl.toString());
};
