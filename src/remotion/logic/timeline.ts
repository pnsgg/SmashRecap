import { type MainProps } from '../../lib/schemas/stats';
import { calculateFavouriteCharactersDuration } from '../FavouriteCharacter';
import { calculateWorstMatchupsDuration } from '../WorstMatchups';
import {
    CLEAN_SWEEP_DURATION,
    DQ_DURATION,
    END_CARD_DURATION,
    GAME_5_WARRIOR_DURATION,
    HIGHEST_UPSET_DURATION,
    PERFORMANCES_DURATION,
    THE_GAUNTLET_DURATION,
    THIS_IS_MY_RECAP_DURATION,
    TOURNAMENTS_DURATION
} from '../config';

export const calculateTimeline = (props: MainProps) => {
    let currentFrame = 0;

    const fromThisIsMyRecap = currentFrame;
    const durationThisIsMyRecap = THIS_IS_MY_RECAP_DURATION;
    currentFrame += durationThisIsMyRecap;

    const fromTournaments = currentFrame;
    const durationTournaments = TOURNAMENTS_DURATION + PERFORMANCES_DURATION;

    const fromPerformances = currentFrame + TOURNAMENTS_DURATION;
    const durationPerformances = PERFORMANCES_DURATION;
    currentFrame += durationTournaments;

    const fromFavouriteCharacters = currentFrame;
    const durationFavouriteCharacters = calculateFavouriteCharactersDuration(
        props.favouriteCharactersProps.characters.length
    );
    currentFrame += durationFavouriteCharacters;

    const fromHighestUpset = currentFrame;
    const durationHighestUpset = HIGHEST_UPSET_DURATION;
    if (props.highestUpsetProps !== undefined) {
        currentFrame += durationHighestUpset;
    }

    const fromGame5Warrior = currentFrame;
    const durationGame5Warrior = GAME_5_WARRIOR_DURATION;
    currentFrame += durationGame5Warrior;

    const fromCleanSweep = currentFrame;
    const durationCleanSweep = CLEAN_SWEEP_DURATION;
    currentFrame += durationCleanSweep;

    const fromWorstMatchups = currentFrame;
    const durationWorstMatchups = calculateWorstMatchupsDuration(
        props.worstMatchupsProps.matchups.length
    );
    if (props.worstMatchupsProps !== undefined) {
        currentFrame += durationWorstMatchups;
    }

    const fromDQ = currentFrame;
    const durationDQ = DQ_DURATION;
    currentFrame += durationDQ;

    const fromGauntlet = currentFrame;
    const durationGauntlet = THE_GAUNTLET_DURATION;
    if (props.gauntletProps !== undefined) {
        currentFrame += durationGauntlet;
    }

    const fromEndCard = currentFrame;
    const durationEndCard = END_CARD_DURATION;
    currentFrame += durationEndCard;

    const totalDuration = currentFrame;

    return {
        totalDuration,
        frames: {
            thisIsMyRecap: { from: fromThisIsMyRecap, duration: durationThisIsMyRecap },
            tournaments: { from: fromTournaments, duration: durationTournaments },
            performances: { from: fromPerformances, duration: durationPerformances },
            favouriteCharacters: { from: fromFavouriteCharacters, duration: durationFavouriteCharacters },
            highestUpset: { from: fromHighestUpset, duration: durationHighestUpset },
            game5Warrior: { from: fromGame5Warrior, duration: durationGame5Warrior },
            cleanSweep: { from: fromCleanSweep, duration: durationCleanSweep },
            worstMatchups: { from: fromWorstMatchups, duration: durationWorstMatchups },
            dq: { from: fromDQ, duration: durationDQ },
            gauntlet: { from: fromGauntlet, duration: durationGauntlet },
            endCard: { from: fromEndCard, duration: durationEndCard }
        }
    };
};
