import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, Sequence, useCurrentFrame } from 'remotion';
import { z } from 'zod';
import {
  END_CARD_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  FPS,
  PERFORMANCES_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
} from './config';
import { EndCard } from './EndCard';
import { FavouriteCharacters } from './FavouriteCharacter';
import { FAVOURITE_CHARACTERS } from './mock';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { colors } from './styles';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';

export const mainSchema = z.object({
  thisIsMyRecap: thisIsMyRecapSchema,
  tournaments: tournamentsSchema,
  performances: myPerformancesSchema
});

export type MainProps = z.infer<typeof mainSchema>;

export const Main: React.FC<MainProps> = ({
  thisIsMyRecap: { user, year },
  tournaments: { attendance },
  performances: { performances }
}) => {
  const frame = useCurrentFrame();

  const favStart = THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION + PERFORMANCES_DURATION;

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
      <Sequence name="ThisIsMyRecap" durationInFrames={THIS_IS_MY_RECAP_DURATION}>
        <ThisIsMyRecap user={user} year={year} />
      </Sequence>

      <Sequence
        name="Tournaments"
        from={THIS_IS_MY_RECAP_DURATION}
        durationInFrames={TOURNAMENTS_DURATION + PERFORMANCES_DURATION}
      >
        <div style={{ filter: `blur(${blur}px)`, width: '100%', height: '100%' }}>
          <Tournaments attendance={attendance} year={year} />
        </div>
      </Sequence>

      <Sequence
        name="Performances"
        from={THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION}
        durationInFrames={PERFORMANCES_DURATION}
      >
        <MyPerformances performances={performances} />
      </Sequence>

      <Sequence
        name="FavouriteCharacters"
        from={THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION + PERFORMANCES_DURATION}
        durationInFrames={FAVOURITE_CHARACTER_DURATION}
      >
        <FavouriteCharacters characters={FAVOURITE_CHARACTERS} />
      </Sequence>

      <Sequence
        name="EndCard"
        from={
          THIS_IS_MY_RECAP_DURATION +
          TOURNAMENTS_DURATION +
          PERFORMANCES_DURATION +
          FAVOURITE_CHARACTER_DURATION
        }
        durationInFrames={END_CARD_DURATION}
      >
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
