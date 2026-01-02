import { startgg } from '$lib/server/startgg';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
  const accessToken = cookies.get('access_token');
  if (accessToken) {
    const user = await startgg.getAuthenticatedUserId(accessToken);
    if (user) {
      redirect(302, `/user/${user}`);
    }
  }

  const authorizationUrl = startgg.createAuthorizationURL(['user.identity', 'user.email']);

  redirect(302, authorizationUrl.toString());
};
