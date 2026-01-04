import { fetchStartGG } from '$lib/startgg/fetch';
import {
  getEntrant,
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

/**
 * Calculates the upset factor for a match between two players.
 * @param playerSeed - The seed of the player
 * @param opponentSeed - The seed of the opponent
 * @param bracket - The type of bracket (single or double elimination)
 */
export const upsetFactor = (playerSeed: number, opponentSeed: number, bracket: BracketType) => {
  const playerRFV =
    bracket === 'SINGLE_ELIMINATION'
      ? singleBracketRoundsFromVictory(playerSeed)
      : doubleBracketRoundsFromVictory(playerSeed);

  const opponentRFV =
    bracket === 'SINGLE_ELIMINATION'
      ? singleBracketRoundsFromVictory(opponentSeed)
      : doubleBracketRoundsFromVictory(opponentSeed);

  return playerRFV - opponentRFV;
};

export type ParsedMatch = {
  name: string;
  score: number;
}[];

/**
 * Parse the display score from the match
 * @param match A string containing the match score (e.g. "ARK | Licane 1 - PNS | Clembs 2" or "DQ")
 * @returns An array of objects containing the player name and score (e.g. [{ name: 'ARK | Licane', score: 1 }, { name: 'PNS | Clembs', score: 2 }] or 'DQ')
 */
export const parseMatch = (match: string): ParsedMatch | 'DQ' => {
  if (match.match(/^DQ$/)) return 'DQ';

  const parts = match.split(' - ');
  return parts.map((part) => {
    part = part.trim();
    const lastSpaceIndex = part.lastIndexOf(' ');

    const name = part.slice(0, lastSpaceIndex);
    const score = parseInt(part.slice(lastSpaceIndex + 1, part.length), 10);

    return {
      name,
      score
    };
  });
};

export const findHighestUpset = async (events: Awaited<ReturnType<typeof getEvents>>) => {
  // Find highest upset
  // Filter events and sets within events won by the user
  // Also filter for sets where the player seed was higher (worse) than the opponent seed (upset)
  const eventsWithWinningSets = events
    ?.map((event) => {
      const userEntrantId = event?.userEntrant?.id;
      if (!userEntrantId) return null;

      const winningSets = event.userEntrant?.paginatedSets?.nodes?.filter((set) => {
        if (!set?.winnerId || set.winnerId.toString() !== userEntrantId.toString()) return false;

        const firstGame = set.games?.[0];
        if (!firstGame?.selections) return false;

        const userSeed = firstGame.selections.find(
          (s) => s?.entrant?.id && s.entrant.id.toString() === userEntrantId.toString()
        )?.entrant?.checkInSeed?.seedNum;
        const opponentSeed = firstGame.selections.find(
          (s) => s?.entrant?.id && s.entrant.id.toString() !== userEntrantId.toString()
        )?.entrant?.checkInSeed?.seedNum;

        if (userSeed && opponentSeed) {
          return userSeed > opponentSeed;
        }

        return false;
      });

      if (!winningSets || winningSets.length === 0) return null;

      return {
        ...event,
        winningSets
      };
    })
    .filter(notNullNorUndefined);

  // Flatten the sets to find the single highest upset match
  const flattenedSets = eventsWithWinningSets.flatMap((event) =>
    event
      .winningSets!.map((set) => {
        const userEntrantId = event.userEntrant?.id;
        if (!userEntrantId || !set?.games) return null;

        const firstGame = set.games[0];
        if (!firstGame?.selections) return null;

        const userSelection = firstGame.selections.find(
          (s) => s?.entrant?.id && s.entrant.id.toString() === userEntrantId.toString()
        );
        const userSeed = userSelection?.entrant?.checkInSeed?.seedNum;

        const opponentSelection = firstGame.selections.find(
          (s) => s?.entrant?.id && s.entrant.id.toString() !== userEntrantId.toString()
        );
        const opponentSeed = opponentSelection?.entrant?.checkInSeed?.seedNum;

        if (!userSeed || !opponentSeed) return null;

        // Determine bracket type, default to DOUBLE
        const bracketType: BracketType =
          (event.userEntrant?.phaseGroups?.[0]?.bracketType as BracketType) === 'SINGLE_ELIMINATION'
            ? 'SINGLE_ELIMINATION'
            : 'DOUBLE_ELIMINATION';

        return {
          set,
          tournament: event.tournament!,
          factor: upsetFactor(userSeed, opponentSeed, bracketType),
          opponentEntrantId: opponentSelection?.entrant?.id
        };
      })
      .filter(notNullNorUndefined)
  );

  // Sort by factor descending
  flattenedSets.sort((a, b) => b.factor - a.factor);

  const bestUpset = flattenedSets[0];

  if (bestUpset && bestUpset.opponentEntrantId) {
    try {
      const oppRes = await fetchStartGG(getEntrant, { entrantId: bestUpset.opponentEntrantId });
      const opponentParticipant = oppRes.data?.entrant?.players?.[0];

      if (opponentParticipant) {
        const match = parseMatch(bestUpset.set.displayScore!);
        return {
          tournament: {
            name: bestUpset.tournament.name!,
            date: bestUpset.tournament.startAt
              ? unixToDate(bestUpset.tournament.startAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              : '',
            image: bestUpset.tournament.images?.[0]?.url ?? undefined
          },
          opponent: {
            gamerTag: opponentParticipant.gamerTag!,
            prefix: opponentParticipant.prefix ?? undefined,
            avatar: opponentParticipant?.user?.images?.[0]?.url
          },
          match: {
            score:
              match !== 'DQ'
                ? match
                    .map((m) => m.score)
                    .sort((a, b) => b - a)
                    .join(' - ')
                : 'DQ',
            factor: bestUpset.factor,
            round: bestUpset.set.fullRoundText!
          }
        };
      }
    } catch (e) {
      console.error('Failed to fetch opponent for upset:', e);
    }
  }
};
