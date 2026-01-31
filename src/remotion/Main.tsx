import { preloadFont, preloadImage } from '@remotion/preload';
import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame
} from 'remotion';
import { CleanSweep } from './CleanSweep';
import { BusterRun } from './BusterRun';
import { DQ } from './DQ';
import { DayOfWeekActivity } from './DayOfWeekActivity';
import { EndCard } from './EndCard';
import { FavouriteCharacters } from './FavouriteCharacter';
import { Game5Warrior } from './Game5Warrior';
import { HighestUpset } from './HighestUpset';
import { MyPerformances } from './MyPerformances';
import { Rivalries } from './Rivalries';
import { TheGauntlet } from './TheGauntlet';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Tournaments } from './Tournaments';
import { WorstMatchups } from './WorstMatchups';
import { SPRITES as MASKASS_SPRITES } from './components/Maskass';
import { PNSLogo } from './components/PNSLogo';
import { Stocks } from './components/Stocks';
import { FPS } from './config';
import { ALL_FIGHTERS, getFighterInfo } from './constants';
import {
  calculateColorTimeline,
  calculateStocksOpacityTimeline,
  calculateTimeline
} from './logic/timeline';

import { type MainProps, mainSchema } from '../lib/schemas/stats';

export { mainSchema, type MainProps };

export const Main: React.FC<MainProps> = ({
  thisIsMyRecapProps: { user, year },
  tournamentsProps: { attendance, year: tournamentYear },
  performancesProps: { performances },
  favouriteCharactersProps: { characters },
  worstMatchupsProps,
  highestUpsetProps,
  rivalryProps,
  busterRunProps,
  game5WarriorProps,
  cleanSweepProps,
  dqProps,
  gauntletProps,
  dayOfWeekActivityProps,
  gameStats,
  setsPlayed
}) => {
  const frame = useCurrentFrame();

  const props = {
    thisIsMyRecapProps: { user, year },
    tournamentsProps: { attendance, year: tournamentYear },
    performancesProps: { performances },
    favouriteCharactersProps: { characters },
    worstMatchupsProps,
    highestUpsetProps,
    rivalryProps,
    game5WarriorProps,
    cleanSweepProps,
    dqProps,
    gauntletProps,
    dayOfWeekActivityProps,
    busterRunProps,
    gameStats,
    setsPlayed
  };

  const { frames } = calculateTimeline(props);

  const { bgPoints, bgColors, logoPoints, logoColors } = calculateColorTimeline(frames);

  const { opacityPoints, opacityValues } = calculateStocksOpacityTimeline(frames, props);

  const {
    thisIsMyRecap,
    tournaments,
    performances: performancesFrame,
    favouriteCharacters,
    dayOfWeekActivity,
    highestUpset,
    rivalries,
    busterRun,
    game5Warrior,
    cleanSweep,
    worstMatchups,
    dq,
    gauntlet,
    endCard
  } = frames;

  const backgroundColor = interpolateColors(frame, bgPoints, bgColors);

  const stocksOpacity = interpolate(frame, opacityPoints, opacityValues, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

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

  const logoColor = interpolateColors(frame, logoPoints, logoColors);

  // Preload assets
  useMemo(() => {
    preloadFont('/fonts/Impact.woff2');
    if (user.image) preloadImage(user.image);
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
      <Stocks opacity={stocksOpacity} />
      <Sequence name="ThisIsMyRecap" durationInFrames={thisIsMyRecap.duration}>
        <ThisIsMyRecap user={user} year={year} />
      </Sequence>

      <Sequence
        name="Tournaments"
        from={tournaments.from}
        durationInFrames={tournaments.duration + performancesFrame.duration}
      >
        <div style={{ filter: `blur(${blur}px)`, width: '100%', height: '100%' }}>
          <Tournaments attendance={attendance} year={year} />
        </div>
      </Sequence>

      <Sequence
        name="Performances"
        from={performancesFrame.from}
        durationInFrames={performancesFrame.duration}
      >
        <MyPerformances performances={performances} />
      </Sequence>

      <Sequence
        name="FavouriteCharacters"
        from={favouriteCharacters.from}
        durationInFrames={favouriteCharacters.duration}
      >
        <FavouriteCharacters characters={characters} />
      </Sequence>

      <Sequence
        name="DayOfWeekActivity"
        from={dayOfWeekActivity.from}
        durationInFrames={dayOfWeekActivity.duration}
      >
        <DayOfWeekActivity {...dayOfWeekActivityProps} />
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
      {rivalryProps && (
        <Sequence name="Rivalries" from={rivalries.from} durationInFrames={rivalries.duration}>
          <Rivalries {...rivalryProps} />
        </Sequence>
      )}
      {busterRunProps && (
        <Sequence name="BusterRun" from={busterRun.from} durationInFrames={busterRun.duration}>
          <BusterRun {...busterRunProps} />
        </Sequence>
      )}

      <Sequence
        name="Game5Warrior"
        from={game5Warrior.from}
        durationInFrames={game5Warrior.duration}
      >
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
          zIndex: 1000
        }}
      >
        <PNSLogo style={{ transform: 'scale(1.5)' }} color={logoColor} />
      </div>
    </AbsoluteFill>
  );
};
