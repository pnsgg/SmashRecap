export const FPS = 30;

export const MAIN_COMPOSITION_WIDTH = 600;
export const MAIN_COMPOSITION_HEIGHT = 600;

export const THIS_IS_MY_RECAP_DURATION = FPS * 5;
export const TOURNAMENTS_DURATION = FPS * 4;
export const END_CARD_DURATION = FPS * 3;

export const totalDuration = [
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION,
  END_CARD_DURATION
].reduce((acc, duration) => acc + duration, 0);
