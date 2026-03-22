import { startgg } from '$lib/server/startgg';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
  const accessToken = cookies.get('access_token');
  if (accessToken) {
    const userSlug = await startgg.getAuthenticatedUserSlug(accessToken, fetch);
    if (userSlug) {
      throw redirect(302, `/user/${userSlug}`);
    }
  }

  const authorizationUrl = startgg.createAuthorizationURL(['user.identity', 'user.email']);
  redirect(303, authorizationUrl.toString());
};
