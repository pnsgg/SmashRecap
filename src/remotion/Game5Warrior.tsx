import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { DigitReel, FONT_SIZE, FRAMES_PER_STEP } from './components/DigitReel';
import { Stocks } from './components/Stocks';
import { colors, makeFontVariationSettings, typography } from './styles';

export const game5WarriorSchema = z.object({
  totalSets: z.number(),
  wins: z.number()
});

export type Game5WarriorProps = z.infer<typeof game5WarriorSchema>;

const SCORE_HISTORY = [
  { left: 0, right: 0 },
  { left: 1, right: 0 },
  { left: 1, right: 1 },
  { left: 2, right: 1 },
  { left: 2, right: 2 },
  { left: 3, right: 2 }
];

export const Game5Warrior: React.FC<Game5WarriorProps> = ({ totalSets, wins }) => {
  const frame = useCurrentFrame();
  const { fps, height, durationInFrames } = useVideoConfig();

  const slideshowDuration = SCORE_HISTORY.length * FRAMES_PER_STEP;

  const swipeProgress = spring({
    frame: frame - slideshowDuration,
    fps,
    config: { damping: 200, stiffness: 100 }
  });

  // Moves the container up by 1 viewport height
  const containerY = interpolate(swipeProgress, [0, 1], [0, -height], {
    extrapolateRight: 'clamp'
  });

  const exitSpring = spring({
    fps,
    frame: frame - (durationInFrames - 15),
    config: { damping: 200, stiffness: 100 }
  });
  const exitY = interpolate(exitSpring, [0, 1], [0, -height], { extrapolateRight: 'clamp' });

  const timesSpring = spring({
    fps,
    frame: frame - slideshowDuration,
    config: { damping: 200, stiffness: 50 },
    delay: 30
  });

  const displayedWins = Math.round(interpolate(timesSpring, [0, 1], [0, wins]));

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily,
        color: colors.reallyWhite
      }}
    >
      <Stocks opacity={0.1} />

      <div style={{ transform: `translateY(${containerY + exitY}px)`, width: '100%' }}>
        <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DigitReel side="left" scoreHistory={SCORE_HISTORY} />
              <div
                style={{
                  fontSize: FONT_SIZE,
                  lineHeight: 1,
                  color: colors.reallyWhite,
                  textShadow: `0px 4px 10px ${colors.nearlyBlack}`,
                  fontWeight: 900
                }}
              >
                -
              </div>
              <DigitReel side="right" scoreHistory={SCORE_HISTORY} />
            </div>
          </div>
        </div>

        <div
          style={{
            height,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: colors.reallyWhite
          }}
        >
          <div
            style={{
              fontSize: 140,
              lineHeight: 1,
              fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 700 })
            }}
          >
            {displayedWins} / {totalSets}
          </div>

          <div
            style={{
              ...typography.heading2,
              textTransform: 'uppercase',
              maxWidth: 600,
              textShadow: `0 4px 10px ${colors.nearlyBlack}`
            }}
          >
            sets went to last game.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
