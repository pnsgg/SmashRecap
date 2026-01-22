import { query } from '$app/server';
import { redis } from '$lib/server/redis';
import { fetchStartGG } from '$lib/startgg/fetch';
import {
  aggregateByMonth,
  type BracketType,
  computeMostPlayedCharacters,
  findHighestUpset,
  findRivals,
  getEvents,
  getThisYearEvents,
  notNullNorUndefined,
  seedingPerformanceRating,
  unixToDate
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

export const getPlayerStats = query(
  v.object({
    userId: v.pipe(v.number(), v.minValue(1)),
    year: v.pipe(v.number(), v.minValue(2000), v.maxValue(new Date().getFullYear()))
  }),
  async ({ userId, year }) => {
    const key = `recap:${userId}:${year}`;
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

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

    // Count the number of tournaments attended by month
    const tournaments = events.map((event) => event?.tournament).filter(notNullNorUndefined);
    const tournamentsStartAt = tournaments.map((t) => t?.startAt).filter(notNullNorUndefined);
    const tournamentsByMonth = aggregateByMonth(tournamentsStartAt);

    // Find the best performances
    const bestPerformances = events
      .map((event) => ({
        tournament: event?.tournament,
        // First element is always the main event
        bracketType: event?.userEntrant?.phaseGroups?.[0]?.bracketType,
        initialSeed: event?.userEntrant?.checkInSeed?.seedNum,
        finalPlacement: event?.userEntrant?.standing?.placement
      }))
      .filter(
        (event) =>
          event.initialSeed &&
          event.finalPlacement &&
          event.tournament?.city &&
          event.tournament?.startAt &&
          event.tournament?.numAttendees &&
          (event.bracketType === 'SINGLE_ELIMINATION' || event.bracketType === 'DOUBLE_ELIMINATION')
      )
      .sort((a, b) => {
        const sprA = seedingPerformanceRating(
          a.initialSeed!,
          a.finalPlacement!,
          a.bracketType as BracketType
        );
        const sprB = seedingPerformanceRating(
          b.initialSeed!,
          b.finalPlacement!,
          b.bracketType as BracketType
        );
        return sprB - sprA;
      })
      .map((event) => {
        const date = unixToDate(event.tournament?.startAt as number).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit'
        });

        return {
          finalPlacement: event.finalPlacement!,
          initialSeed: event.initialSeed!,
          tournament: {
            image: event.tournament?.images?.[0]?.url ?? undefined,
            name: event.tournament?.name as string,
            date,
            location: event.tournament?.city as string,
            attendees: event.tournament?.numAttendees as number
          }
        };
      })
      .slice(0, 5);

    // Find the highest upset factor dealt
    const highestUpset = await findHighestUpset(events);

    // Most played characters
    const charactersPlayedByPlayerAndOpponent = events?.map((event) => ({
      entrantId: event?.userEntrant?.id,
      sets: event?.userEntrant?.paginatedSets?.nodes?.map((set) => ({
        winnerId: set?.winnerId,
        selections: set?.games?.flatMap((game) =>
          game?.selections?.map((selection) => ({
            entrantId: selection?.entrant?.id,
            character: selection?.character?.name
          }))
        )
      }))
    }));
    const charactersPlayedByPlayer = charactersPlayedByPlayerAndOpponent
      .flatMap((event) =>
        event.sets?.flatMap((set) => set.selections?.map((selection) => selection?.character))
      )
      .filter(notNullNorUndefined);
    const mostPlayedCharactersByPlayer = computeMostPlayedCharacters(charactersPlayedByPlayer, 3);

    // Find rivals
    const rivals = await findRivals(events);

    const result = {
      year,
      user: userInfo,
      tournamentsByMonth,
      bestPerformances,
      highestUpset,
      rivals,
      mostPlayedCharactersByPlayer: mostPlayedCharactersByPlayer.map((character) => ({
        ...character,
        image: `/images/chara_1/${getFighterInfo(character.name).slug}.png`
      }))
    };

    await redis.set(key, JSON.stringify(result));
    await redis.incr('total_recaps');

    return result;
  }
);
