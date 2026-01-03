import { query } from '$app/server';
import { fetchStartGG } from '$lib/startgg/fetch';
import { getUserInfo, searchPlayerByGamerTag } from '$lib/startgg/queries';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const searchPlayerQuery = query(v.pipe(v.string(), v.trim()), async (gamerTag) => {
  if (gamerTag.length === 0) return [];

  try {
    const res = await fetchStartGG(searchPlayerByGamerTag, {
      query: {
        filter: {
          gamerTag,
          isUser: true,
          hideTest: true
        }
      }
    });

    return (res.data.players?.nodes
      ?.map((player) => {
        // By design a user always have an id and a gamerTag
        // Typescript skill issue here
        if (!player?.user?.id || !player?.gamerTag) return null;

        return {
          id: parseInt(player.user.id),
          gamerTag: player.gamerTag,
          image: player.user.images?.[0]?.url || '',
          country: player.user.location?.country || ''
        };
      })
      .filter((player) => player !== null) || []) satisfies PlayerResult[];
  } catch (error) {
    console.error('Error searching player:', error);
    return [];
  }
});

export type PlayerResult = {
  id: number;
  gamerTag: string;
  image: string;
  country: string;
};

export const getPlayerStats = query(
  v.object({
    userId: v.pipe(v.number(), v.minValue(1)),
    year: v.pipe(v.number(), v.minValue(2000), v.maxValue(new Date().getFullYear()))
  }),
  async ({ userId, year }) => {
    // Get userinfo
    const {
      data: { user }
    } = await fetchStartGG(getUserInfo, { userId: userId.toString() });
    if (!user) error(404, 'User not found');

    return {
      year,
      user: {
        image: user.images?.[0]?.url || '',
        prefix: user.player?.prefix ?? undefined,
        gamerTag: user.player?.gamerTag as string,
        country: user.location?.country ?? undefined,
        pronouns: user.genderPronoun ?? undefined,
        socialMedias: {
          x:
            user.authorizations?.find((auth) => auth?.type === 'TWITTER')?.externalUsername ??
            undefined
        }
      }
    };
  }
);
