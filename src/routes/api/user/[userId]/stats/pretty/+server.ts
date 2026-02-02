import { dev } from '$app/environment';
import { getPlayerStats } from '$lib/remotes/players.remote';
import type { MainProps } from '$remotion/Main';
import { fail, json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  if (!dev) return fail(404);

  const userId = parseInt(params.userId);
  const year = 2025;

  const stats = await getPlayerStats({ userId, year });

  const videoProps: MainProps = {
    thisIsMyRecapProps: {
      year: stats.year,
      user: stats.user
    },
    tournamentsProps: {
      year: stats.year,
      attendance: stats.tournamentsByMonth
    },
    performancesProps: {
      performances: stats.bestPerformances
    },
    favouriteCharactersProps: {
      characters: stats.mostPlayedCharactersByPlayer
    },
    highestUpsetProps: stats.highestUpset,
    game5WarriorProps: {
      totalSets: stats.sets.lastgames.count,
      wins: stats.sets.lastgames.winCount,
      winRate: stats.sets.lastgames.winRate
    },
    worstMatchupsProps: {
      matchups: stats.worstMatchups
    },
    gauntletProps: stats.gauntlet,
    cleanSweepProps: {
      totalSets: stats.sets.total,
      totalSweeps: stats.sets.cleansweeps
    },
    dqProps: {
      totalDQs: stats.dqs
    },
    dayOfWeekActivityProps: {
      activity: stats.dayOfWeekActivity
    },
    busterRunProps: stats.worstPerformance,
    rivalryProps: stats.rivalry,
    gameStats: stats.gameStats,
    setsPlayed: stats.sets.total
  };

  return json(videoProps);
};
