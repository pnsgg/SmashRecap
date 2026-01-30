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
import { CleanSweep, cleanSweepSchema } from './CleanSweep';
import { DQ, dqSchema } from './DQ';
import { EndCard } from './EndCard';
import { FavouriteCharacters, favouriteCharactersSchema } from './FavouriteCharacter';
import { Game5Warrior, game5WarriorSchema } from './Game5Warrior';
import { HighestUpset, highestUpsetSchema } from './HighestUpset';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { TheGauntlet, theGauntletSchema } from './TheGauntlet';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';
import { WorstMatchups, worstMatchupsSchema } from './WorstMatchups';
import { SPRITES as MASKASS_SPRITES } from './components/Maskass';
import { PNSLogo } from './components/PNSLogo';
import { FPS } from './config';
import { ALL_FIGHTERS, getFighterInfo } from './constants';
import { colors } from './styles';
import { calculateTimeline } from './logic/timeline';

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

  const { frames } = calculateTimeline({
    thisIsMyRecapProps: { user, year },
    tournamentsProps: { attendance, year },
    performancesProps: { performances },
    favouriteCharactersProps: { characters },
    worstMatchupsProps,
    highestUpsetProps,
    game5WarriorProps,
    cleanSweepProps,
    dqProps,
    gauntletProps
  });

  const {
    thisIsMyRecap,
    tournaments,
    performances: performancesFrame,
    favouriteCharacters,
    highestUpset,
    game5Warrior,
    cleanSweep,
    worstMatchups,
    dq,
    gauntlet,
    endCard
  } = frames;

  const favStart = favouriteCharacters.from;

  const backgroundColor = interpolateColors(
    frame,
    [thisIsMyRecap.duration, thisIsMyRecap.duration + FPS / 2, favStart - FPS / 2, favStart],
    [colors.nearlyBlack, colors.reallyWhite, colors.reallyWhite, colors.nearlyBlack]
  );

  const blur = interpolate(
    frame,
    [
      thisIsMyRecap.duration + tournaments.duration - FPS,
      thisIsMyRecap.duration + tournaments.duration
    ],
    [0, 10],
    {
      extrapolateRight: 'clamp'
    }
  );

  const logoColor = interpolateColors(
    frame,
    [
      thisIsMyRecap.duration,
      thisIsMyRecap.duration + FPS / 2,
      favStart - FPS / 2,
      favStart,
      favStart + favouriteCharacters.duration - FPS / 2,
      favStart + favouriteCharacters.duration
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
      <Sequence name="ThisIsMyRecap" durationInFrames={thisIsMyRecap.duration}>
        <ThisIsMyRecap user={user} year={year} />
      </Sequence>

      <Sequence name="Tournaments" from={tournaments.from} durationInFrames={tournaments.duration}>
        <div style={{ filter: `blur(${blur}px)`, width: '100%', height: '100%' }}>
          <Tournaments attendance={attendance} year={year} />
        </div>
      </Sequence>

      <Sequence name="Performances" from={performancesFrame.from} durationInFrames={performancesFrame.duration}>
        <MyPerformances performances={performances} />
      </Sequence>

      <Sequence
        name="FavouriteCharacters"
        from={favouriteCharacters.from}
        durationInFrames={favouriteCharacters.duration}
      >
        <FavouriteCharacters characters={characters} />
      </Sequence>

      {highestUpsetProps && (
        <Sequence
          name="HighestUpset"
          from={highestUpset.from}
          durationInFrames={highestUpset.duration}
        >
          <HighestUpset {...highestUpsetProps} />
        </Sequence>
      )}

      <Sequence name="Game5Warrior" from={game5Warrior.from} durationInFrames={game5Warrior.duration}>
        <Game5Warrior {...game5WarriorProps} />
      </Sequence>

      <Sequence name="CleanSweep" from={cleanSweep.from} durationInFrames={cleanSweep.duration}>
        <CleanSweep {...cleanSweepProps} />
      </Sequence>

      {worstMatchupsProps && (
        <Sequence
          name="WorstMatchups"
          from={worstMatchups.from}
          durationInFrames={worstMatchups.duration}
        >
          <WorstMatchups {...worstMatchupsProps} />
        </Sequence>
      )}

      <Sequence name="DQ" from={dq.from} durationInFrames={dq.duration}>
        <DQ {...dqProps} />
      </Sequence>

      {gauntletProps && (
        <Sequence name="TheGauntlet" from={gauntlet.from} durationInFrames={gauntlet.duration}>
          <TheGauntlet {...gauntletProps} />
        </Sequence>
      )}

      <Sequence name="EndCard" from={endCard.from} durationInFrames={endCard.duration}>
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
