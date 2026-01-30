import { preloadImage } from '@remotion/preload';
import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame
} from 'remotion';
import { z } from 'zod';
import { CleanSweep, cleanSweepSchema } from './CleanSweep';
import { DQ, dqSchema } from './DQ';
import { EndCard } from './EndCard';
import {
  calculateFavouriteCharactersDuration,
  FavouriteCharacters,
  favouriteCharactersSchema
} from './FavouriteCharacter';
import { Game5Warrior, game5WarriorSchema } from './Game5Warrior';
import { HighestUpset, highestUpsetSchema } from './HighestUpset';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { TheGauntlet, theGauntletSchema } from './TheGauntlet';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';
import {
  calculateWorstMatchupsDuration,
  WorstMatchups,
  worstMatchupsSchema
} from './WorstMatchups';
import { SPRITES as MASKASS_SPRITES } from './components/Maskass';
import { PNSLogo } from './components/PNSLogo';
import {
  CLEAN_SWEEP_DURATION,
  DQ_DURATION,
  END_CARD_DURATION,
  FPS,
  GAME_5_WARRIOR_DURATION,
  HIGHEST_UPSET_DURATION,
  PERFORMANCES_DURATION,
  THE_GAUNTLET_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
} from './config';
import { ALL_FIGHTERS, getFighterInfo } from './constants';
import { colors } from './styles';

import { type MainProps, mainSchema } from '../lib/schemas/stats';

export { mainSchema, type MainProps };

export const Main: React.FC<MainProps> = ({
  thisIsMyRecapProps: { user, year },
  tournamentsProps: { attendance },
  performancesProps: { performances },
  favouriteCharactersProps: { characters },
  worstMatchupsProps,
  highestUpsetProps,
  game5WarriorProps,
  cleanSweepProps,
  dqProps,
  gauntletProps
}) => {
  const frame = useCurrentFrame();

  const getFrames = ({
    characters,
    worstMatchups
  }: {
    characters: number;
    worstMatchups: number;
  }) => {
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
    const durationFavouriteCharacters = calculateFavouriteCharactersDuration(characters);
    currentFrame += durationFavouriteCharacters;

    const fromHighestUpset = currentFrame;
    const durationHighestUpset = HIGHEST_UPSET_DURATION;
    if (highestUpsetProps !== undefined) {
      currentFrame += durationHighestUpset;
    }

    const fromGame5Warrior = currentFrame;
    const durationGame5Warrior = GAME_5_WARRIOR_DURATION;
    currentFrame += durationGame5Warrior;

    const fromCleanSweep = currentFrame;
    const durationCleanSweep = CLEAN_SWEEP_DURATION;
    currentFrame += durationCleanSweep;

    const fromWorstMatchups = currentFrame;
    const durationWorstMatchups = calculateWorstMatchupsDuration(worstMatchups);
    if (worstMatchupsProps !== undefined) {
      currentFrame += durationWorstMatchups;
    }

    const fromDQ = currentFrame;
    const durationDQ = DQ_DURATION;
    currentFrame += durationDQ;

    const fromGauntlet = currentFrame;
    const durationGauntlet = THE_GAUNTLET_DURATION;
    if (gauntletProps !== undefined) {
      currentFrame += durationGauntlet;
    }

    const fromEndCard = currentFrame;
    const durationEndCard = END_CARD_DURATION;

    return {
      fromThisIsMyRecap,
      durationThisIsMyRecap,
      fromTournaments,
      durationTournaments,
      fromPerformances,
      durationPerformances,
      fromFavouriteCharacters,
      durationFavouriteCharacters,
      fromWorstMatchups,
      durationWorstMatchups,
      fromHighestUpset,
      durationHighestUpset,
      fromGame5Warrior,
      durationGame5Warrior,
      fromCleanSweep,
      durationCleanSweep,
      fromDQ,
      durationDQ,
      fromGauntlet,
      durationGauntlet,
      fromEndCard,
      durationEndCard
    };
  };

  const {
    durationThisIsMyRecap,
    fromTournaments,
    durationTournaments,
    fromPerformances,
    durationPerformances,
    fromFavouriteCharacters,
    durationFavouriteCharacters,
    fromWorstMatchups,
    durationWorstMatchups,
    fromHighestUpset,
    durationHighestUpset,
    fromGame5Warrior,
    durationGame5Warrior,
    fromCleanSweep,
    durationCleanSweep,
    fromDQ,
    durationDQ,
    fromGauntlet,
    durationGauntlet,
    fromEndCard,
    durationEndCard
  } = getFrames({
    characters: characters?.length ?? 0,
    worstMatchups: worstMatchupsProps?.matchups.length ?? 0
  });

  const favStart = fromFavouriteCharacters;

  const backgroundColor = interpolateColors(
    frame,
    [THIS_IS_MY_RECAP_DURATION, THIS_IS_MY_RECAP_DURATION + FPS / 2, favStart - FPS / 2, favStart],
    [colors.nearlyBlack, colors.reallyWhite, colors.reallyWhite, colors.nearlyBlack]
  );

  const blur = interpolate(
    frame,
    [
      THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION - FPS,
      THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION
    ],
    [0, 10],
    {
      extrapolateRight: 'clamp'
    }
  );

  const logoColor = interpolateColors(
    frame,
    [
      THIS_IS_MY_RECAP_DURATION,
      THIS_IS_MY_RECAP_DURATION + FPS / 2,
      favStart - FPS / 2,
      favStart,
      favStart + durationFavouriteCharacters - FPS / 2,
      favStart + durationFavouriteCharacters
    ],
    [
      colors.reallyWhite,
      colors.nearlyBlack,
      colors.nearlyBlack,
      colors.reallyWhite,
      colors.reallyWhite,
      colors.reallyWhite
    ]
  );

  // Preload assets
  useMemo(() => {
    preloadImage(user.image);
    performances.forEach((perf) => {
      if (perf.tournament.image) preloadImage(perf.tournament.image);
    });
    characters.forEach((char) => {
      preloadImage(staticFile(char.image));
    });
    if (worstMatchupsProps) {
      worstMatchupsProps.matchups.forEach((char) => {
        preloadImage(staticFile(char.image));
      });
    }
    if (highestUpsetProps && highestUpsetProps.opponent.avatar) {
      preloadImage(highestUpsetProps.opponent.avatar);
    }
    ALL_FIGHTERS.forEach((fighter) => {
      const url = staticFile(`/images/stocks/${getFighterInfo(fighter).slug}.webp`);
      preloadImage(url);
    });
    MASKASS_SPRITES.forEach((sprite) => {
      preloadImage(staticFile(sprite));
    });
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <Sequence name="ThisIsMyRecap" durationInFrames={durationThisIsMyRecap}>
        <ThisIsMyRecap user={user} year={year} />
      </Sequence>

      <Sequence name="Tournaments" from={fromTournaments} durationInFrames={durationTournaments}>
        <div style={{ filter: `blur(${blur}px)`, width: '100%', height: '100%' }}>
          <Tournaments attendance={attendance} year={year} />
        </div>
      </Sequence>

      <Sequence name="Performances" from={fromPerformances} durationInFrames={durationPerformances}>
        <MyPerformances performances={performances} />
      </Sequence>

      <Sequence
        name="FavouriteCharacters"
        from={fromFavouriteCharacters}
        durationInFrames={durationFavouriteCharacters}
      >
        <FavouriteCharacters characters={characters} />
      </Sequence>

      {highestUpsetProps && (
        <Sequence
          name="HighestUpset"
          from={fromHighestUpset}
          durationInFrames={durationHighestUpset}
        >
          <HighestUpset {...highestUpsetProps} />
        </Sequence>
      )}

      <Sequence name="Game5Warrior" from={fromGame5Warrior} durationInFrames={durationGame5Warrior}>
        <Game5Warrior {...game5WarriorProps} />
      </Sequence>

      <Sequence name="CleanSweep" from={fromCleanSweep} durationInFrames={durationCleanSweep}>
        <CleanSweep {...cleanSweepProps} />
      </Sequence>

      {worstMatchupsProps && (
        <Sequence
          name="WorstMatchups"
          from={fromWorstMatchups}
          durationInFrames={durationWorstMatchups}
        >
          <WorstMatchups {...worstMatchupsProps} />
        </Sequence>
      )}

      <Sequence name="DQ" from={fromDQ} durationInFrames={durationDQ}>
        <DQ {...dqProps} />
      </Sequence>

      {gauntletProps && (
        <Sequence name="TheGauntlet" from={fromGauntlet} durationInFrames={durationGauntlet}>
          <TheGauntlet {...gauntletProps} />
        </Sequence>
      )}

      <Sequence name="EndCard" from={fromEndCard} durationInFrames={durationEndCard}>
        <EndCard />
      </Sequence>

      {/* Persistent Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          zIndex: 1000,
          opacity: 0.8
        }}
      >
        <PNSLogo style={{ transform: 'scale(1.5)' }} color={logoColor} />
      </div>
    </AbsoluteFill>
  );
};
