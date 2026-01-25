import { dev } from '$app/environment';
import { searchPlayerQuery } from '$lib/remotes/players.remote';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  if (!dev) return json({ error: 'Not available in production' }, { status: 403 });

  const gamerTag = url.searchParams.get('gamerTag');
  if (!gamerTag) {
    return json({ error: 'Missing gamerTag parameter' }, { status: 400 });
  }

  const players = await searchPlayerQuery(gamerTag);

  return json(players);
};
