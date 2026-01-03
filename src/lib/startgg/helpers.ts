import { fetchStartGG } from '$lib/startgg/fetch';
import {
  getEvent,
  getPaginatedTournamentsEventsStartAt,
  getTournamentsEventsPageInfo
} from '$lib/startgg/queries';

export const notNullNorUndefined = <T>(value: T | null | undefined) => {
  return value !== null && value !== undefined;
};

export const unixToDate = (unix: number) => new Date(unix * 1000);

/**
 * Given an array of dates, counts the number of occurrences of each month and returns an
 * object with the month names as keys and the counts as values.
 */
export function aggregateByMonth(startAts: number[]) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const counts = new Array(12).fill(0);

  startAts.forEach((startAt) => {
    const tournamentDate = unixToDate(startAt);
    const monthIndex = tournamentDate.getMonth();

    if (!isNaN(monthIndex)) counts[monthIndex]++;
  });

  const result = monthNames.map((name, index) => ({
    month: name,
    attendance: counts[index]
  }));

  return result;
}

/**
 * Given a user ID and a year, fetches all events for that user in the specified year.
 * It retrieves the page info to determine the total number of pages and then fetches
 * each page of events until it reaches events from previous years.
 * @param userId The ID of the user whose events to fetch.
 * @param year The year for which to fetch events.
 * @returns An array of events for the specified user in the specified year.
 */
export const getThisYearEvents = async (userId: string, year: number) => {
  // Get page info
  const tournamentEventsPageInfoRes = await fetchStartGG(getTournamentsEventsPageInfo, {
    userId
  });

  const pages = tournamentEventsPageInfoRes.data?.user?.events?.pageInfo?.totalPages;
  if (!pages) return [];

  const events: string[] = [];
  let shouldContinue = true;

  for (let page = 1; page <= pages && shouldContinue; page++) {
    const paginatedTournamentsEventsRes = await fetchStartGG(getPaginatedTournamentsEventsStartAt, {
      page: page,
      userId
    });

    const pageEvents = paginatedTournamentsEventsRes?.data.user?.events?.nodes || [];

    // Check if we have reached events from previous years
    const hasOldEvents = pageEvents.some((e) => {
      if (e?.startAt) {
        const eventDate = unixToDate(e.startAt);
        return eventDate.getFullYear() < year;
      }
    });

    // Filter events from this year
    const thisYearEvents = pageEvents.filter((e) => {
      if (e?.startAt) {
        const eventDate = unixToDate(e.startAt);
        return eventDate.getFullYear() === year;
      }
    });

    events.push(...thisYearEvents.map((e) => e!.id!));

    // If we have reached events from previous years, stop fetching more pages
    if (hasOldEvents) shouldContinue = false;
  }

  return events;
};

export const getEvents = async (userId: string, ids: string[]) => {
  const promises = ids.map((id) => fetchStartGG(getEvent, { eventId: id, userId }));
  const results = await Promise.all(promises);

  return results.map(({ data }) => data.event);
};

/**
 * Compute the number of Rounds From Victory in a single-elimination bracket.
 * @see https://www.pgstats.com/articles/spr-uf-extra-mathematical-details
 * @see https://www.pgstats.com/articles/introducing-spr-and-uf
 * @param placement - The final placement of the player (1 = 1st place)
 * @returns The number of rounds from victory
 */
export const singleBracketRoundsFromVictory = (placement: number) => {
  return Math.ceil(Math.log2(placement));
};

/**
 * Compute the number of Rounds From Victory in a double-elimination bracket.
 * @see https://www.pgstats.com/articles/spr-uf-extra-mathematical-details
 * @see https://www.pgstats.com/articles/introducing-spr-and-uf
 * @param placement - The final placement of the player (1 = 1st place)
 * @returns The number of rounds from victory
 */
export const doubleBracketRoundsFromVictory = (placement: number) => {
  if (placement === 1) return 0;
  return Math.floor(Math.log2(placement - 1)) + Math.ceil(Math.log2((2 / 3) * placement));
};

export type BracketType = 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';

/**
 * Measures a player's performance in a bracket relative to their seed.
 * A positive value indicates that the player performed better than expected,
 * while a negative value indicates that the player performed worse than expected.
 * @see https://www.pgstats.com/articles/introducing-spr-and-uf
 * @param seed - The seed of the player
 * @param placement - The final placement of the player (1 = 1st place)
 * @param bracket - The type of bracket (single or double elimination)
 */
export const seedingPerformanceRating = (seed: number, placement: number, bracket: BracketType) => {
  const expectedRFV =
    bracket === 'SINGLE_ELIMINATION'
      ? singleBracketRoundsFromVictory(seed)
      : doubleBracketRoundsFromVictory(seed);

  const actualRFV =
    bracket === 'SINGLE_ELIMINATION'
      ? singleBracketRoundsFromVictory(placement)
      : doubleBracketRoundsFromVictory(placement);

  return expectedRFV - actualRFV;
};

/**
 * Calculates the most played characters by a player.
 * @param characters The characters played by the player
 * @param maxCharacters The maximum number of characters to return
 * @returns An array of objects containing the character and its count, sorted by count in descending order
 */
export const computeMostPlayedCharacters = (characters: string[], maxCharacters: number) => {
  const characterCounts = characters.reduce(
    (acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(characterCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([char, count]) => ({ name: char, count }))
    .slice(0, maxCharacters);
};
