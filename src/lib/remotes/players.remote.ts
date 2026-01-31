import { query } from '$app/server';
import { env } from '$env/dynamic/private';
import { makeRecapStatsKey, redis } from '$lib/server/redis';
import { fetchStartGG } from '$lib/startgg/fetch';
import {
  computeAliasesFromEvents,
  computeBestPerformances,
  computeGauntlet,
  computeGameStats,
  computeMostPlayedCharacters,
  computeRivalries,
  computeTotalCleanSweeps,
  computeTotalDQs,
  computeTotalSets,
  computeTotalSetsToLastGame,
  computeDayOfWeekActivity,
  computeWorstMatchups,
  computeWorstPerformance,
  findHighestUpset,
  getEvents,
  getThisYearEvents,
  type GameStats,
  type EventPerformance,
  type WeekActivity,
  type HighestUpset,
  type PlayedCharacter,
  aggregateTournamentsByMonth,
  type TournamentAttendanceByMonth,
  type BestPerformances,
  type WorstMatchup
} from '$lib/startgg/helpers';
import { getUserInfo, searchPlayerByGamerTag } from '$lib/startgg/queries';
import { getFighterInfo } from '$remotion/constants';
import type { Rivalry } from '$remotion/Rivalries';
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
        perPage: 200
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
  tournamentsByMonth: TournamentAttendanceByMonth;
  bestPerformances: BestPerformances;
  highestUpset: HighestUpset | undefined;
  mostPlayedCharactersByPlayer: (PlayedCharacter & {
    image: string;
  })[];
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
  worstMatchups: (WorstMatchup & {
    image: string;
  })[];
  dqs: number;
  rivalry: Rivalry;
  gameStats: GameStats;
  dayOfWeekActivity: WeekActivity;
  worstPerformance?: EventPerformance;
};

/**
 * Retrieves comprehensive statistics for a player for a specific year.
 *
 * This query fetches user profile data, tournament dates, and match history to compute a wide range of statistics:
 * - Tournament attendance by month
 * - Best performances (placements)
 * - Most played characters
 * - "Gauntlet" (unique characters encountered)
 * - Win/loss records (total sets, game win rate, clean sweeps, game 5s, DQs)
 * - Worst matchups
 * - Rivalries (most prevalent opponent and worst win rate)
 * - Day of the week activity
 * - "Buster" run (worst performance relative to seed)
 *
 * @param input - Object containing `userId` and `year`.
 * @returns A `PlayerStats` object with all calculated metrics.
 */
export const getPlayerStats = query(
  v.object({
    userId: v.pipe(v.number(), v.minValue(1)),
    year: v.pipe(v.number(), v.minValue(2000), v.maxValue(new Date().getFullYear()))
  }),
  async ({ userId, year }) => {
    const key = makeRecapStatsKey(year, userId);

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
    const tournamentsByMonth = aggregateTournamentsByMonth(events);

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
    const rivalries = computeRivalries(events);
    const gameStats = computeGameStats(events, gamerTagsThisYear);
    const dayOfWeekActivity = computeDayOfWeekActivity(events);
    const worstPerformance = computeWorstPerformance(events);

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
      dqs: totalDQs,
      rivalry: rivalries,
      gameStats,
      dayOfWeekActivity,
      worstPerformance
    };

    if (env.ALLOW_CACHING === 'true') {
      await redis.set(key, JSON.stringify(result));
    }

    return result;
  }
);
