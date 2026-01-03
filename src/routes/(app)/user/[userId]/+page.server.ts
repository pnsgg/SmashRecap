import { fetchStartGG } from '$lib/startgg/fetch';
import { getUserById } from '$lib/startgg/queries';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const {
    data: { user }
  } = await fetchStartGG(getUserById, { id: params.userId });

  if (!user || !user.id) throw redirect(302, '/');

  return { userId: parseInt(user.id) };
};
