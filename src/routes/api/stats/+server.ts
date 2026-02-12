import { dev } from '$app/environment';
import { getPlayerStats } from '$lib/remotes/players.remote';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  if (!dev) return json({ error: 'Not available in production' }, { status: 403 });

  const slug = url.searchParams.get('slug');
  if (!slug) {
    return json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const YEAR = 2025;
  const stats = await getPlayerStats({
    slug,
    year: YEAR
  });

  return json(stats);
};
