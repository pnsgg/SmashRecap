import { query } from '$app/server';
import { env } from '$env/dynamic/private';
import { makerRecapStatsKey, redis } from '$lib/server/redis';
import { fetchStartGG } from '$lib/startgg/fetch';
import {
  aggregateByMonth,
  computeAliasesFromEvents,
  computeBestPerformances,
  computeGauntlet,
  computeMostPlayedCharacters,
  computeTotalCleanSweeps,
  computeTotalDQs,
  computeTotalSets,
  computeTotalSetsToLastGame,
  findHighestUpset,
  getEvents,
  getThisYearEvents,
  notNullNorUndefined
} from '$lib/startgg/helpers';
import { getUserInfo, searchPlayerByGamerTag } from '$lib/startgg/queries';
import { getFighterInfo } from '$remotion/constants';
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
        },
        perPage: 50
      }
    });

    return (res.data.players?.nodes
      ?.map((player) => {
        // By design a user always has an id and a gamerTag
        // Typescript skill issue here
        if (!player?.user?.id || !player?.gamerTag) return null;

        return {
          id: parseInt(player.user.id),
          gamerTag: player.gamerTag,
          prefix: player.prefix,
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

type PlayerStats = {
  year: number;
  user: {
    gamerTag: string;
    image: string;
    country?: string;
    prefix?: string;
    pronouns?: string;
    socialMedias: {
      x?: string;
    };
  };
  gamerTagsThisYear: string[];
  tournamentsByMonth: { month: string; attendance: number }[];
  bestPerformances: {
    finalPlacement: number;
    initialSeed: number;
    tournament: {
      image: string | undefined;
      name: string;
      date: string;
      location: string;
      attendees: number;
    };
  }[];
  highestUpset:
    | {
        tournament: { name: string; date: string; image: string | undefined };
        opponent: { gamerTag: string; prefix: string | undefined; avatar: string | undefined };
        match: { score: string; factor: number; round: string };
      }
    | undefined;
  mostPlayedCharactersByPlayer: { image: string; name: string; count: number }[];
  gauntlet: {
    encountered: string[];
  };
  sets: {
    total: number;
    lastgames: number;
    cleansweeps: number;
  };
  dqs: number;
};

export const getPlayerStats = query(
  v.object({
    userId: v.pipe(v.number(), v.minValue(1)),
    year: v.pipe(v.number(), v.minValue(2000), v.maxValue(new Date().getFullYear()))
  }),
  async ({ userId, year }) => {
    const key = makerRecapStatsKey(year, userId);

    if (env.ALLOW_CACHING === 'true') {
      const cached = await redis.get(key);
      if (cached) return JSON.parse(cached) as PlayerStats;
    }

    // Get userinfo
    const {
      data: { user }
    } = await fetchStartGG(getUserInfo, { userId: userId.toString() });
    if (!user) error(404, 'User not found');

    const userInfo = {
      gamerTag: user.player?.gamerTag as string,
      image: user.images?.[0]?.url || '',
      country: user.location?.country ?? undefined,
      prefix: user.player?.prefix ?? undefined,
      pronouns: user.genderPronoun ?? undefined,
      socialMedias: {
        x:
          user.authorizations?.find((auth) => auth?.type === 'TWITTER')?.externalUsername ??
          undefined
      }
    };

    const stringUserId = userId.toString();

    // Get attended events
    const eventsIds = await getThisYearEvents(stringUserId, year);

    // Get events info
    const events = await getEvents(stringUserId, eventsIds);

    // Record all the gamer tags the user played as this year
    const gamerTagsThisYear = computeAliasesFromEvents(events);

    // Count the number of tournaments attended by month
    const tournaments = events.map((event) => event?.tournament).filter(notNullNorUndefined);
    const tournamentsStartAt = tournaments.map((t) => t?.startAt).filter(notNullNorUndefined);
    const tournamentsByMonth = aggregateByMonth(tournamentsStartAt);

    // Find the best performances
    const bestPerformances = computeBestPerformances(events, 5);

    // Find the highest upset factor dealt
    const highestUpset = await findHighestUpset(events);

    // Most played characters
    const mostPlayedCharactersByPlayer = computeMostPlayedCharacters(events, gamerTagsThisYear);

    const totalSets = computeTotalSets(events);

    // Count the number of sets that went to last games
    const totalSetsToLastGame = computeTotalSetsToLastGame(events, gamerTagsThisYear);

    // Count the number of cleen sweeps (i.e., 3-0 or 2-0 or X-0)
    const totalCleanSweeps = computeTotalCleanSweeps(events, gamerTagsThisYear);

    const encounteredCharacters = computeGauntlet(events);

    // Count the number of DQs
    const totalDQs = computeTotalDQs(events);

    const result: PlayerStats = {
      year,
      user: userInfo,
      gamerTagsThisYear: Array.from(gamerTagsThisYear),
      tournamentsByMonth,
      bestPerformances,
      highestUpset,
      mostPlayedCharactersByPlayer: mostPlayedCharactersByPlayer.map((character) => ({
        ...character,
        image: `/images/chara_1/${getFighterInfo(character.name).slug}.webp`
      })),
      gauntlet: {
        encountered: Array.from(encounteredCharacters.values())
      },
      sets: {
        total: totalSets,
        lastgames: totalSetsToLastGame,
        cleansweeps: totalCleanSweeps
      },
      dqs: totalDQs
    };

    if (env.ALLOW_CACHING === 'true') {
      await redis.set(key, JSON.stringify(result));
    }

    return result;
  }
);
