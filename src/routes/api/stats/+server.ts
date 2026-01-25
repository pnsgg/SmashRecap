import { dev } from '$app/environment';
import { getPlayerStats } from '$lib/remotes/players.remote';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  if (!dev) return json({ error: 'Not available in production' }, { status: 403 });

  const userId = url.searchParams.get('userId');
  if (!userId) {
    return json({ error: 'Missing userId parameter' }, { status: 400 });
  }

  const YEAR = 2025;
  const stats = await getPlayerStats({
    userId: parseInt(userId),
    year: YEAR
  });

  return json(stats);
};
