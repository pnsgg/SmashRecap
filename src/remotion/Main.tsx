import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, Sequence, useCurrentFrame } from 'remotion';
import { z } from 'zod';
import { CleanSweep, cleanSweepSchema } from './CleanSweep';
import {
  CLEAN_SWEEP_DURATION,
  END_CARD_DURATION,
  FPS,
  GAME_5_WARRIOR_DURATION,
  HIGHEST_UPSET_DURATION,
  PERFORMANCES_DURATION,
  RIVALS_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
} from './config';
import { EndCard } from './EndCard';
import {
  calculateFavouriteCharactersDuration,
  FavouriteCharacters,
  favouriteCharactersSchema
} from './FavouriteCharacter';
import { Game5Warrior, game5WarriorSchema } from './Game5Warrior';
import { HighestUpset, highestUpsetSchema } from './HighestUpset';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { Rivals, rivalsSchema } from './Rivals';
import { colors } from './styles';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';

export const mainSchema = z.object({
  thisIsMyRecapProps: thisIsMyRecapSchema,
  tournamentsProps: tournamentsSchema,
  performancesProps: myPerformancesSchema,
  favouriteCharactersProps: favouriteCharactersSchema,
  highestUpsetProps: highestUpsetSchema.optional(),
  game5WarriorProps: game5WarriorSchema,
  cleanSweepProps: cleanSweepSchema,
  rivalsProps: rivalsSchema.optional()
});

export type MainProps = z.infer<typeof mainSchema>;

export const Main: React.FC<MainProps> = ({
  thisIsMyRecapProps: { user, year },
  tournamentsProps: { attendance },
  performancesProps: { performances },
  favouriteCharactersProps: { characters },
  highestUpsetProps,
  game5WarriorProps,
  cleanSweepProps,
  rivalsProps
}) => {
  const frame = useCurrentFrame();

  const getFrames = ({ characters }: { characters: number }) => {
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

    const fromRivals = currentFrame;
    const durationRivals = RIVALS_DURATION;
    if (rivalsProps !== undefined) {
      currentFrame += durationRivals;
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
      fromHighestUpset,
      durationHighestUpset,
      fromGame5Warrior,
      durationGame5Warrior,
      fromCleanSweep,
      durationCleanSweep,
      fromRivals,
      durationRivals,
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
    fromHighestUpset,
    durationHighestUpset,
    fromGame5Warrior,
    durationGame5Warrior,
    fromCleanSweep,
    durationCleanSweep,
    fromRivals,
    durationRivals,
    fromEndCard,
    durationEndCard
  } = getFrames({ characters: characters?.length ?? 0 });

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

      {rivalsProps && (
        <Sequence name="Rivals" from={fromRivals} durationInFrames={durationRivals}>
          <Rivals {...rivalsProps} />
        </Sequence>
      )}

      <Sequence name="EndCard" from={fromEndCard} durationInFrames={durationEndCard}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
