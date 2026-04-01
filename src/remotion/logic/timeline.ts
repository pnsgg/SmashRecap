import { type MainProps } from '../../lib/schemas/stats';
import { calculateFavouriteCharactersDuration } from '../FavouriteCharacter';
import { calculateWorstMatchupsDuration } from '../WorstMatchups';
import {
  BUSTER_RUN_DURATION,
  CLEAN_SWEEP_DURATION,
  DAY_OF_WEEK_ACTIVITY_DURATION,
  DQ_DURATION,
  END_CARD_DURATION,
  FPS,
  GAME_5_WARRIOR_DURATION,
  HIGHEST_UPSET_DURATION,
  RIVALRIES_DURATION,
  PERFORMANCES_DURATION,
  THE_GAUNTLET_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
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
  const durationFavouriteCharacters = calculateFavouriteCharactersDuration(
    props.favouriteCharactersProps.characters.length
  );
  currentFrame += durationFavouriteCharacters;

  const hasDayOfWeekActivity = props.dayOfWeekActivityProps.activity.some((a) => a.count > 0);
  const fromDayOfWeekActivity = currentFrame;
  const durationDayOfWeekActivity = hasDayOfWeekActivity ? DAY_OF_WEEK_ACTIVITY_DURATION : 0;
  currentFrame += durationDayOfWeekActivity;

  const hasHighestUpset = !!props.highestUpsetProps;
  const fromHighestUpset = currentFrame;
  const durationHighestUpset = hasHighestUpset ? HIGHEST_UPSET_DURATION : 0;
  currentFrame += durationHighestUpset;

  const hasRivalries = !!(props.rivalryProps?.rival || props.rivalryProps?.nemesis);
  const fromRivalries = currentFrame;
  const durationRivalries = hasRivalries ? RIVALRIES_DURATION : 0;
  currentFrame += durationRivalries;

  const hasBusterRun = !!props.busterRunProps;
  const fromBusterRun = currentFrame;
  const durationBusterRun = hasBusterRun ? BUSTER_RUN_DURATION : 0;
  currentFrame += durationBusterRun;

  const hasGame5Warrior = props.game5WarriorProps.totalSets > 0;
  const fromGame5Warrior = currentFrame;
  const durationGame5Warrior = hasGame5Warrior ? GAME_5_WARRIOR_DURATION : 0;
  currentFrame += durationGame5Warrior;

  const hasCleanSweep = props.cleanSweepProps.totalSweeps > 0;
  const fromCleanSweep = currentFrame;
  const durationCleanSweep = hasCleanSweep ? CLEAN_SWEEP_DURATION : 0;
  currentFrame += durationCleanSweep;

  const fromWorstMatchups = currentFrame;
  const durationWorstMatchups = calculateWorstMatchupsDuration(
    props.worstMatchupsProps?.matchups.length ?? 0
  );
  currentFrame += durationWorstMatchups;

  const hasDQ = props.dqProps.totalDQs > 0;
  const fromDQ = currentFrame;
  const durationDQ = hasDQ ? DQ_DURATION : 0;
  currentFrame += durationDQ;

  const hasGauntlet = props.gauntletProps.encountered.length > 0;
  const fromGauntlet = currentFrame;
  const durationGauntlet = hasGauntlet ? THE_GAUNTLET_DURATION : 0;
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
 * @returns An object containing arrays for bgPoints, bgColors, logoPoints, and logoColors.
 */
export const calculateColorTimeline = (frames: Record<string, Frame>) => {
  const bgPoints: number[] = [];
  const bgColors: string[] = [];
  const logoPoints: number[] = [];
  const logoColors: string[] = [];

  // Define the base color for each segment
  const segmentConfig = [
    { key: 'thisIsMyRecap', color: colors.nearlyBlack, logo: colors.reallyWhite },
    {
      key: 'tournaments',
      color: colors.reallyWhite,
      logo: colors.nearlyBlack,
      delay: FPS / 2
    },
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

    const delay = config.delay ?? 0;

    // Transition at the start of the segment if color changed from previous visible segment
    if (config.color !== currentBg) {
      bgPoints.push(frame.from + delay - FPS / 2, frame.from + delay);
      bgColors.push(currentBg, config.color);
      currentBg = config.color;
    }

    if (config.logo !== currentLogo) {
      logoPoints.push(frame.from + delay - FPS / 2, frame.from + delay);
      logoColors.push(currentLogo, config.logo);
      currentLogo = config.logo;
    }
  });

  if (bgPoints.length === 0) {
    bgPoints.push(0, 1);
    bgColors.push(colors.nearlyBlack, colors.nearlyBlack);
  } else if (bgPoints.length === 1) {
    bgPoints.push(bgPoints[0] + 1);
    bgColors.push(bgColors[0]);
  }

  if (logoPoints.length === 0) {
    logoPoints.push(0, 1);
    logoColors.push(colors.reallyWhite, colors.reallyWhite);
  } else if (logoPoints.length === 1) {
    logoPoints.push(logoPoints[0] + 1);
    logoColors.push(logoColors[0]);
  }

  return { bgPoints, bgColors, logoPoints, logoColors };
};

/**
 * Calculates the opacity interpolation points for the Stocks background pattern.
 *
 * @param frames - The frames object returned by calculateTimeline (Record<string, Frame>).
 * @param props - The main properties object.
 * @returns An object containing arrays for opacity interpolation (points and values).
 */
export const calculateStocksOpacityTimeline = (frames: Record<string, Frame>) => {
  const { gauntlet, endCard } = frames;

  const opacityPoints = [0];
  const opacityValues = [0.15];

  if (gauntlet.duration > 0) {
    opacityPoints.push(gauntlet.from - FPS / 2, gauntlet.from);
    opacityValues.push(0.15, 0.02);

    opacityPoints.push(endCard.from, endCard.from + FPS / 2);
    opacityValues.push(0.02, 0.15);
  }

  // Ensure at least 2 points for interpolation
  if (opacityPoints.length === 1) {
    opacityPoints.push(1);
    opacityValues.push(opacityValues[0]);
  }

  return { opacityPoints, opacityValues };
};
