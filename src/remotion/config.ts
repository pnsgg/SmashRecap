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
export const RIVALS_DURATION = FPS * 6;
export const END_CARD_DURATION = FPS * 3;

export const totalDuration = [
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION,
  PERFORMANCES_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  HIGHEST_UPSET_DURATION,
  RIVALS_DURATION,
  END_CARD_DURATION
].reduce((acc, duration) => acc + duration, 0);
