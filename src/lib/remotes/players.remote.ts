import { query } from '$app/server';
import { fetchStartGG } from '$lib/startgg/fetch';
import {
  aggregateByMonth,
  type BracketType,
  getEvents,
  getThisYearEvents,
  notNullNorUndefined,
  seedingPerformanceRating
} from '$lib/startgg/helpers';
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
        const date = new Date(event.tournament?.startAt as number).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit'
        });

        return {
          finalPlacement: event.finalPlacement!,
          initialSeed: event.initialSeed!,
          tournament: {
            image: event.tournament?.images?.[0]?.url as string,
            name: event.tournament?.name as string,
            date,
            location: event.tournament?.city as string,
            attendees: event.tournament?.numAttendees as number
          }
        };
      })
      .slice(0, 5);

    return {
      year,
      user: userInfo,
      tournamentsByMonth,
      bestPerformances
    };
  }
);
