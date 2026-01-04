import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, Sequence, useCurrentFrame } from 'remotion';
import { z } from 'zod';
import {
  END_CARD_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  FPS,
  HIGHEST_UPSET_DURATION,
  PERFORMANCES_DURATION,
  RIVALS_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
} from './config';
import { EndCard } from './EndCard';
import { FavouriteCharacters, favouriteCharactersSchema } from './FavouriteCharacter';
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
  rivalsProps: rivalsSchema.optional()
});

export type MainProps = z.infer<typeof mainSchema>;

export const Main: React.FC<MainProps> = ({
  thisIsMyRecapProps: { user, year },
  tournamentsProps: { attendance },
  performancesProps: { performances },
  favouriteCharactersProps: { characters },
  highestUpsetProps,
  rivalsProps
}) => {
  const frame = useCurrentFrame();

  const getFrames = () => {
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
    const durationFavouriteCharacters = FAVOURITE_CHARACTER_DURATION;
    currentFrame += durationFavouriteCharacters;

    const fromHighestUpset = currentFrame;
    const durationHighestUpset = HIGHEST_UPSET_DURATION;
    if (highestUpsetProps?.highestUpset) {
      currentFrame += durationHighestUpset;
    }

    const fromRivals = currentFrame;
    const durationRivals = RIVALS_DURATION;
    if (rivalsProps?.rivals) {
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
    fromRivals,
    durationRivals,
    fromEndCard,
    durationEndCard
  } = getFrames();

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

      {highestUpsetProps?.highestUpset && (
        <Sequence
          name="HighestUpset"
          from={fromHighestUpset}
          durationInFrames={durationHighestUpset}
        >
          <HighestUpset highestUpset={highestUpsetProps.highestUpset} />
        </Sequence>
      )}

      {rivalsProps?.rivals && (
        <Sequence name="Rivals" from={fromRivals} durationInFrames={durationRivals}>
          <Rivals rivals={rivalsProps.rivals} />
        </Sequence>
      )}

      <Sequence name="EndCard" from={fromEndCard} durationInFrames={durationEndCard}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
