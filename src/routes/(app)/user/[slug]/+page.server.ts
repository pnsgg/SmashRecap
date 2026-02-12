import { fetchStartGG } from '$lib/startgg/fetch';
import { getUserBySlug } from '$lib/startgg/queries';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const slug = `user/${params.slug}`;
  const {
    data: { user }
  } = await fetchStartGG(getUserBySlug, { slug });

  if (!user || !user.slug) throw redirect(302, '/');

  return { userSlug: user.slug };
};
