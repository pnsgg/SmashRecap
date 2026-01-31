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
  CharacterDisplay,
  SubtitleText,
  SubtitleTextWhite,
  TOTAL_DURATION
} from './components/CharacterDisplay';
import { colors, makeFontVariationSettings, typography } from './styles';

export const worstMatchupSchema = z.object({
  characterName: z.string(),
  count: z.number(),
  lossCount: z.number(),
  looseRate: z.number(),
  image: z.string()
});

export type WorstMatchupType = z.infer<typeof worstMatchupSchema>;

export const worstMatchupsSchema = z.object({
  matchups: z.array(worstMatchupSchema)
});

export const calculateWorstMatchupsDuration = (count: number) => {
  if (count === 0) return 0;
  return 73 + TOTAL_DURATION * (count - 1) + TOTAL_DURATION;
};

export const WorstMatchups: React.FC<{
  matchups: WorstMatchupType[];
}> = ({ matchups }) => {
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
          Your personal demons...
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
        {matchups.map((matchup, index) => {
          const startFrame = 73 + TOTAL_DURATION * index;
          return (
            <Sequence
              key={matchup.characterName}
              from={startFrame}
              durationInFrames={TOTAL_DURATION}
              layout="none"
            >
              <CharacterDisplay
                name={matchup.characterName}
                image={matchup.image}
                gradientColors={['#C34141', '#DA5050']}
                renderSubtitle={() => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <SubtitleText>
                      {matchup.lossCount} loss{matchup.lossCount === 1 ? '' : 'es'}
                    </SubtitleText>
                    <SubtitleTextWhite>{matchup.looseRate.toFixed(1)}% Loss Rate</SubtitleTextWhite>
                  </div>
                )}
              />
            </Sequence>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
