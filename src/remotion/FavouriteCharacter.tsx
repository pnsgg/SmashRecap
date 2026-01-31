import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { z } from 'zod';
import {
  Character,
  favouriteCharacterSchema,
  type FavouriteCharacterType,
  TOTAL_DURATION
} from './components/Character';
import { colors, makeFontVariationSettings, typography } from './styles';

export const favouriteCharactersSchema = z.object({
  characters: z.array(favouriteCharacterSchema)
});

export const calculateFavouriteCharactersDuration = (count: number) => {
  if (count === 0) return 0;
  return 73 + TOTAL_DURATION * (count - 1) + TOTAL_DURATION;
};

export const FavouriteCharacters: React.FC<{
  characters: FavouriteCharacterType[];
}> = ({ characters }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Animate Title
  const titleExit = spring({
    fps,
    frame: frame - 60,
    config: {
      damping: 200
    }
  });

  const titleEntrance = spring({
    fps,
    frame,
    config: {
      damping: 200
    }
  });

  const titleTranslateX = interpolate(titleExit, [0, 1], [0, -width]);
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleTranslateY = interpolate(titleEntrance, [0, 1], [50, 0]);

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: typography.fontFamily
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: titleOpacity,
          transform: `translateX(${titleTranslateX}px) translateY(${titleTranslateY}px)`
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            fontSize: 80,
            lineHeight: 0.9,
            color: colors.reallyWhite,
            fontVariationSettings: makeFontVariationSettings({
              width: 75,
              weight: 700
            })
          }}
        >
          No matter the matchup, these were your go-tos.
        </h1>
      </AbsoluteFill>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0
        }}
      >
        {characters.map((character, index) => {
          const startFrame = 73 + TOTAL_DURATION * index;
          return (
            <Sequence
              key={character.name}
              from={startFrame}
              durationInFrames={TOTAL_DURATION}
              layout="none"
            >
              <Character character={character} />
            </Sequence>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
