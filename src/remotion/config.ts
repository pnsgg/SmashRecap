import { calculateFavouriteCharactersDuration } from './FavouriteCharacter';
import { FAVOURITE_CHARACTERS } from './mock';

export const FPS = 30;

export const MAIN_COMPOSITION_WIDTH = 600;
export const MAIN_COMPOSITION_HEIGHT = 600;

export const THIS_IS_MY_RECAP_DURATION = FPS * 5;
export const TOURNAMENTS_DURATION = FPS * 4;
export const PERFORMANCES_DURATION = FPS * 4;
export const FAVOURITE_CHARACTER_DURATION = calculateFavouriteCharactersDuration(
  FAVOURITE_CHARACTERS.length
);
export const HIGHEST_UPSET_DURATION = FPS * 5;
export const GAME_5_WARRIOR_DURATION = FPS * 5;
export const CLEAN_SWEEP_DURATION = FPS * 5;

export const THE_GAUNTLET_DURATION = FPS * 7;
export const END_CARD_DURATION = FPS * 3;

export const totalDuration = ({
  characters,
  hasHighestUpset = true,
  hasGauntlet = true
}: {
  characters?: number;
  hasHighestUpset?: boolean;

  hasGauntlet?: boolean;
}): number => {
  const durations = [
    THIS_IS_MY_RECAP_DURATION,
    TOURNAMENTS_DURATION,
    PERFORMANCES_DURATION,
    GAME_5_WARRIOR_DURATION,
    CLEAN_SWEEP_DURATION,
    END_CARD_DURATION
  ];

  if (characters !== undefined) {
    durations.push(calculateFavouriteCharactersDuration(characters));
  } else {
    durations.push(FAVOURITE_CHARACTER_DURATION);
  }

  if (hasHighestUpset) {
    durations.push(HIGHEST_UPSET_DURATION);
  }



  if (hasGauntlet) {
    durations.push(THE_GAUNTLET_DURATION);
  }

  return durations.reduce((acc, duration) => acc + duration, 0);
};
