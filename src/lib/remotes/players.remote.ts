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
  computeWorstMatchups,
  findHighestUpset,
  getEvents,
  getThisYearEvents,
  notNullNorUndefined
} from '$lib/startgg/helpers';
import { getUserInfo, searchPlayerByGamerTag } from '$lib/startgg/queries';
import { getFighterInfo } from '$remotion/constants';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

/**
 * Search for a player by gamer tag.
 *
 * This query searches for a player on start.gg given a gamer tag and a year.
 * It filters the results to only include players who have attended a tournament at least once.
 * The results are sorted by attendance (higher first).
 *
 * @param input - The gamer tag to search for.
 * @returns A list of `PlayerResult` objects matching the criteria.
 */
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
        perPage: 100
      }
    });

    return (
      res.data.players?.nodes
        ?.map((player) => {
          // By design a user always has an id and a gamerTag
          // Typescript skill issue here
          if (!player?.user?.id || !player?.gamerTag) return null;

          return {
            id: parseInt(player.user.id),
            gamerTag: player.gamerTag,
            prefix: player.prefix,
            image: player.user.images?.[0]?.url || '',
            country: player.user.location?.country || '',
            nbEvent: player.user.events?.pageInfo?.total ?? 0
          };
        })
        .filter((p) => p !== null && p.nbEvent > 0)
        .toSorted((p1, p2) => p2!.nbEvent - p1!.nbEvent)
        .filter((p) => p !== null) || ([] satisfies PlayerResult[])
    );
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
  nbEvent: number;
  lastEvent: number;
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
    lastgames: {
      count: number;
      winCount: number;
      winRate: number;
    };
    cleansweeps: number;
  };
  worstMatchups: {
    characterName: string;
    image: string;
    count: number;
    lossCount: number;
    looseRate: number;
  }[];
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
    const events = await getEvents(stringUserId, eventsIds);

    // Count the number of tournaments attended by month
    const tournaments = events.map((event) => event?.tournament).filter(notNullNorUndefined);
    const tournamentsStartAt = tournaments.map((t) => t?.startAt).filter(notNullNorUndefined);
    const tournamentsByMonth = aggregateByMonth(tournamentsStartAt);

    // Compute stats
    const gamerTagsThisYear = computeAliasesFromEvents(events);
    const bestPerformances = computeBestPerformances(events, 5);
    const mostPlayedCharactersByPlayer = computeMostPlayedCharacters(events, gamerTagsThisYear);
    const totalSets = computeTotalSets(events);
    const totalSetsToLastGame = computeTotalSetsToLastGame(events, gamerTagsThisYear);
    const totalCleanSweeps = computeTotalCleanSweeps(events, gamerTagsThisYear);
    const encounteredCharacters = computeGauntlet(events);
    const totalDQs = computeTotalDQs(events);
    const worstMatchups = computeWorstMatchups(events, 3);
    const highestUpset = await findHighestUpset(events);

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
      worstMatchups: worstMatchups.map((matchup) => ({
        ...matchup,
        image: `/images/chara_1/${getFighterInfo(matchup.characterName).slug}.webp`
      })),
      dqs: totalDQs
    };

    if (env.ALLOW_CACHING === 'true') {
      await redis.set(key, JSON.stringify(result));
    }

    return result;
  }
);
