import { type MainProps } from '../../lib/schemas/stats';
import { calculateFavouriteCharactersDuration } from '../FavouriteCharacter';
import { calculateWorstMatchupsDuration } from '../WorstMatchups';
import {
  BUSTER_RUN_DURATION,
  CLEAN_SWEEP_DURATION,
  DAY_OF_WEEK_ACTIVITY_DURATION,
  DQ_DURATION,
  END_CARD_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  FPS,
  GAME_5_WARRIOR_DURATION,
  HIGHEST_UPSET_DURATION,
  RIVALRIES_DURATION,
  PERFORMANCES_DURATION,
  THE_GAUNTLET_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION,
  WORST_MATCHUPS_DURATION
} from '../config';
import { colors } from '../styles';

export type Frame = {
  from: number;
  duration: number;
};

/**
 * Calculates the timeline for all video segments.
 *
 * @param props - The main properties object (MainProps).
 * @returns An object containing the totalDuration and the calculated frames for each segment.
 */
export const calculateTimeline = (props: MainProps) => {
  let currentFrame = 0;

  const fromThisIsMyRecap = currentFrame;
  const durationThisIsMyRecap = THIS_IS_MY_RECAP_DURATION;
  currentFrame += durationThisIsMyRecap;

  const fromTournaments = currentFrame;
  const durationTournaments = TOURNAMENTS_DURATION;
  currentFrame += durationTournaments;

  const fromPerformances = currentFrame;
  const durationPerformances = PERFORMANCES_DURATION;
  currentFrame += durationPerformances;

  const fromFavouriteCharacters = currentFrame;
  const durationFavouriteCharacters = FAVOURITE_CHARACTER_DURATION;
  currentFrame += durationFavouriteCharacters;

  const fromDayOfWeekActivity =
    props.dayOfWeekActivityProps !== undefined ? currentFrame : currentFrame;
  const durationDayOfWeekActivity =
    props.dayOfWeekActivityProps !== undefined ? DAY_OF_WEEK_ACTIVITY_DURATION : 0;
  currentFrame += durationDayOfWeekActivity;

  const fromHighestUpset = props.highestUpsetProps !== undefined ? currentFrame : currentFrame;
  const durationHighestUpset = props.highestUpsetProps !== undefined ? HIGHEST_UPSET_DURATION : 0;
  currentFrame += durationHighestUpset;

  const fromRivalries = props.rivalryProps !== undefined ? currentFrame : currentFrame;
  const durationRivalries = props.rivalryProps !== undefined ? RIVALRIES_DURATION : 0;
  currentFrame += durationRivalries;

  const fromBusterRun = props.busterRunProps !== undefined ? currentFrame : currentFrame;
  const durationBusterRun = props.busterRunProps !== undefined ? BUSTER_RUN_DURATION : 0;
  currentFrame += durationBusterRun;

  const fromGame5Warrior = currentFrame;
  const durationGame5Warrior = GAME_5_WARRIOR_DURATION;
  currentFrame += durationGame5Warrior;

  const fromCleanSweep = currentFrame;
  const durationCleanSweep = CLEAN_SWEEP_DURATION;
  currentFrame += durationCleanSweep;

  const fromWorstMatchups = currentFrame;
  const durationWorstMatchups = WORST_MATCHUPS_DURATION;
  currentFrame += durationWorstMatchups;

  const fromDQ = currentFrame;
  const durationDQ = DQ_DURATION;
  currentFrame += durationDQ;

  const fromGauntlet = currentFrame;
  const durationGauntlet = THE_GAUNTLET_DURATION;
  currentFrame += durationGauntlet;

  const fromEndCard = currentFrame;
  const durationEndCard = END_CARD_DURATION;
  currentFrame += durationEndCard;

  const totalDuration = currentFrame;

  const frames: Record<string, Frame> = {
    thisIsMyRecap: { from: fromThisIsMyRecap, duration: durationThisIsMyRecap },
    tournaments: { from: fromTournaments, duration: durationTournaments },
    performances: { from: fromPerformances, duration: durationPerformances },
    favouriteCharacters: { from: fromFavouriteCharacters, duration: durationFavouriteCharacters },
    dayOfWeekActivity: { from: fromDayOfWeekActivity, duration: durationDayOfWeekActivity },
    highestUpset: { from: fromHighestUpset, duration: durationHighestUpset },
    rivalries: { from: fromRivalries, duration: durationRivalries },
    busterRun: { from: fromBusterRun, duration: durationBusterRun },
    game5Warrior: { from: fromGame5Warrior, duration: durationGame5Warrior },
    cleanSweep: { from: fromCleanSweep, duration: durationCleanSweep },
    worstMatchups: { from: fromWorstMatchups, duration: durationWorstMatchups },
    dq: { from: fromDQ, duration: durationDQ },
    gauntlet: { from: fromGauntlet, duration: durationGauntlet },
    endCard: { from: fromEndCard, duration: durationEndCard }
  };

  return {
    totalDuration,
    frames
  };
};

/**
 * Calculates the background and logo color interpolation points.
 *
 * @param frames - The frames object returned by calculateTimeline.
 * @param props - The main properties object.
 * @returns An object containing arrays for bgPoints, bgColors, logoPoints, and logoColors.
 */
export const calculateColorTimeline = (frames: Record<string, Frame>, props: MainProps) => {
  const bgPoints: number[] = [];
  const bgColors: string[] = [];
  const logoPoints: number[] = [];
  const logoColors: string[] = [];

  // Define the base color for each segment
  const segmentConfig = [
    { key: 'thisIsMyRecap', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'tournaments', color: colors.reallyWhite, logo: colors.nearlyBlack },
    { key: 'performances', color: colors.reallyWhite, logo: colors.nearlyBlack },
    { key: 'favouriteCharacters', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'dayOfWeekActivity', color: colors.reallyWhite, logo: colors.nearlyBlack },
    { key: 'highestUpset', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'rivalries', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'busterRun', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'game5Warrior', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'cleanSweep', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'worstMatchups', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'dq', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'gauntlet', color: colors.nearlyBlack, logo: colors.reallyWhite },
    { key: 'endCard', color: colors.nearlyBlack, logo: colors.reallyWhite }
  ];

  let currentBg = colors.nearlyBlack;
  let currentLogo = colors.reallyWhite;

  segmentConfig.forEach((config) => {
    const frame = frames[config.key];
    // Skip segments that don't exist or have no duration
    if (!frame || frame.duration === 0) return;

    // Transition AT the start of the segment if color changed from previous visible segment
    if (config.color !== currentBg) {
      bgPoints.push(frame.from - FPS / 2, frame.from);
      bgColors.push(currentBg, config.color);
      currentBg = config.color;
    }

    if (config.logo !== currentLogo) {
      logoPoints.push(frame.from - FPS / 2, frame.from);
      logoColors.push(currentLogo, config.logo);
      currentLogo = config.logo;
    }
  });

  return { bgPoints, bgColors, logoPoints, logoColors };
};

/**
 * Calculates the opacity interpolation points for the Stocks background pattern.
 *
 * @param frames - The frames object returned by calculateTimeline (Record<string, Frame>).
 * @param props - The main properties object.
 * @returns An object containing arrays for opacity interpolation (points and values).
 */
export const calculateStocksOpacityTimeline = (
  frames: Record<string, Frame>,
  props: MainProps
) => {
  const { gauntlet, endCard } = frames;

  const opacityPoints = [0];
  const opacityValues = [0.04];

  if (props.gauntletProps !== undefined) {
    opacityPoints.push(gauntlet.from - FPS / 2, gauntlet.from);
    opacityValues.push(0.04, 0.02);

    opacityPoints.push(endCard.from, endCard.from + FPS / 2);
    opacityValues.push(0.02, 0.04);
  }

  return { opacityPoints, opacityValues };
};
