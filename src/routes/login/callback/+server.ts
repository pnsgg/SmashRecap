import { startgg } from '$lib/server/startgg';
import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    throw error(400, 'Missing authorization code');
  }

  try {
    const token = await startgg.validateAuthorizationCode(code, ['user.identity', 'user.email']);

    cookies.set('access_token', token.access_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: token.expires_in
    });
  } catch (e) {
    console.error(e);
    throw error(500, 'Failed to validate authorization code');
  }

  throw redirect(302, '/user/123');
};
