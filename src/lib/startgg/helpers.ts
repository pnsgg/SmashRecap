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

export const computeMostPlayedCharacters = (
  events: Awaited<ReturnType<typeof getEvents>>,
  aliases: Set<string>
): Array<{ name: string; count: number }> => {
  const selections = events
    .flatMap(
      (event) =>
        event?.userEntrant?.paginatedSets?.nodes?.flatMap((set) =>
          set?.games?.flatMap((game) => game?.selections)
        ) || []
    )
    .filter(notNullNorUndefined)
    .filter((selection) => selection?.entrant?.name && aliases.has(selection?.entrant?.name));

  const characterCounts = selections.reduce(
    (acc, selection) => {
      const charName = selection.character?.name;
      if (charName) {
        acc[charName] = (acc[charName] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(characterCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))
    .slice(0, 3);
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
  // Filter out sets won where an upset occurred
  const winningUpsetSets = events
    .flatMap((event) => {
      const userEntrantId = event?.userEntrant?.id;
      if (!userEntrantId) return [];

      return (
        event.userEntrant?.paginatedSets?.nodes
          ?.filter((set) => {
            if (!set?.winnerId || set.winnerId.toString() !== userEntrantId.toString())
              return false;

            const firstGame = set.games?.[0];
            if (!firstGame?.selections) return false;

            const userSeed = firstGame.selections.find(
              (s) => s?.entrant?.id && s.entrant.id.toString() === userEntrantId.toString()
            )?.entrant?.checkInSeed?.seedNum;

            const opponentSeed = firstGame.selections.find(
              (s) => s?.entrant?.id && s.entrant.id.toString() !== userEntrantId.toString()
            )?.entrant?.checkInSeed?.seedNum;

            return (
              notNullNorUndefined(userSeed) &&
              notNullNorUndefined(opponentSeed) &&
              userSeed > opponentSeed
            );
          })
          .filter(notNullNorUndefined)
          // Map to include necessary data for upset factor calculation
          .map((set) => {
            const firstGame = set.games?.[0];
            if (!firstGame?.selections) return null;

            const userSelection = firstGame.selections.find(
              (s) => s?.entrant?.id && s.entrant.id.toString() === userEntrantId.toString()
            );

            const opponentSelection = firstGame.selections.find(
              (s) => s?.entrant?.id && s.entrant.id.toString() !== userEntrantId.toString()
            );

            if (!userSelection || !opponentSelection) return null;

            const userSeed = userSelection.entrant?.checkInSeed?.seedNum;
            const opponentSeed = opponentSelection.entrant?.checkInSeed?.seedNum;

            if (!notNullNorUndefined(userSeed) || !notNullNorUndefined(opponentSeed)) return null;

            // Determine bracket type
            const rawBracketType = event.userEntrant?.phaseGroups?.[0]?.bracketType;
            if (
              rawBracketType !== 'SINGLE_ELIMINATION' &&
              rawBracketType !== 'DOUBLE_ELIMINATION'
            ) {
              return null;
            }

            if (!notNullNorUndefined(opponentSelection?.entrant?.id)) return null;

            return {
              set,
              tournament: event.tournament!,
              factor: upsetFactor(userSeed, opponentSeed, rawBracketType),
              opponentEntrantId: opponentSelection?.entrant?.id
            };
          })
          .filter(notNullNorUndefined)
      );
    })
    .filter(notNullNorUndefined);

  // Sort by factor descending
  winningUpsetSets.sort((a, b) => b.factor - a.factor);
  const bestUpset = winningUpsetSets[0];

  if (bestUpset) {
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
            avatar: opponentParticipant?.user?.images?.[0]?.url ?? undefined
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

/**
 * Compute the characters encountered in a set of events
 *
 * @param events - The events to compute the gauntlet for
 * @returns A set of characters encountered in the events
 */
export const computeGauntlet = (events: Awaited<ReturnType<typeof getEvents>>): Set<string> => {
  const encounteredCharacters = new Set<string>();

  events.forEach((event) => {
    const userEntrantId = event?.userEntrant?.id;
    if (!userEntrantId) return;

    event?.userEntrant?.paginatedSets?.nodes?.forEach((set) => {
      set?.games?.forEach((game) => {
        game?.selections?.forEach((selection) => {
          if (
            selection?.entrant?.id &&
            selection.entrant.id !== userEntrantId &&
            selection?.character?.name
          ) {
            encounteredCharacters.add(selection.character.name);
          }
        });
      });
    });
  });

  return encounteredCharacters;
};
