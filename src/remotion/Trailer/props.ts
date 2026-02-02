import {
    ATTENDANCE,
    BUSTER_RUN_STATS,
    CLEAN_SWEEP_STATS,
    DAY_OF_WEEK_STATS,
    DQ_STATS,
    FAVOURITE_CHARACTERS,
    GAME_5_STATS,
    GAME_STATS,
    GAUNTLET_STATS,
    HIGHEST_UPSET,
    ME,
    PERFORMANCES,
    RIVALRY_STATS,
    TOTAL_SETS_MOCK,
    WORST_MATCHUPS,
    YEAR
} from '../mock';
import type { MainProps } from '../lib/schemas/stats';

export const mockMainProps: MainProps = {
    thisIsMyRecapProps: {
        user: ME,
        year: YEAR
    },
    tournamentsProps: {
        attendance: ATTENDANCE,
        year: YEAR
    },
    performancesProps: {
        performances: PERFORMANCES
    },
    favouriteCharactersProps: {
        characters: FAVOURITE_CHARACTERS
    },
    highestUpsetProps: HIGHEST_UPSET,
    rivalryProps: RIVALRY_STATS,
    gauntletProps: GAUNTLET_STATS,
    game5WarriorProps: GAME_5_STATS,
    cleanSweepProps: CLEAN_SWEEP_STATS,
    dqProps: DQ_STATS,
    worstMatchupsProps: {
        matchups: WORST_MATCHUPS
    },
    dayOfWeekActivityProps: DAY_OF_WEEK_STATS,
    busterRunProps: BUSTER_RUN_STATS,
    gameStats: GAME_STATS,
    setsPlayed: TOTAL_SETS_MOCK
};
