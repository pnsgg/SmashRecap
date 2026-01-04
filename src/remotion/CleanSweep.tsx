import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { DigitReel, FONT_SIZE, FRAMES_PER_STEP } from './components/DigitReel';
import { Stocks } from './components/Stocks';
import { colors, makeFontVariationSettings, typography } from './styles';

export const cleanSweepSchema = z.object({
  totalSweeps: z.number(),
  totalSets: z.number()
});

export type CleanSweepProps = z.infer<typeof cleanSweepSchema>;

const SCORE_HISTORY = [
  { left: 0, right: 0 },
  { left: 1, right: 0 },
  { left: 2, right: 0 },
  { left: 3, right: 0 }
];

export const CleanSweep: React.FC<CleanSweepProps> = ({ totalSets, totalSweeps }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const slideshowDuration = SCORE_HISTORY.length * FRAMES_PER_STEP;

  const swipeProgress = spring({
    frame: frame - slideshowDuration,
    fps,
    config: { damping: 200, stiffness: 100 }
  });

  const containerY = interpolate(swipeProgress, [0, 1], [0, -height], {
    extrapolateRight: 'clamp'
  });

  const enterSpring = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 100 }
  });
  const enterY = interpolate(enterSpring, [0, 1], [height, 0], {
    extrapolateRight: 'clamp'
  });

  const timesSpring = spring({
    fps,
    frame: frame - slideshowDuration,
    config: { damping: 200, stiffness: 50 },
    delay: 30
  });

  const displayedSweeps = Math.round(interpolate(timesSpring, [0, 1], [0, totalSweeps]));

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

      <div style={{ transform: `translateY(${containerY + enterY}px)`, width: '100%' }}>
        <div
          style={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20
          }}
        >
          <DigitReel side="left" scoreHistory={SCORE_HISTORY} />
          <div
            style={{
              fontSize: FONT_SIZE,
              lineHeight: 1,
              color: colors.reallyWhite,
              fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 700 })
            }}
          >
            -
          </div>
          <DigitReel side="right" scoreHistory={SCORE_HISTORY} />
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
              marginBottom: 20,
              fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 700 })
            }}
          >
            {displayedSweeps} / {totalSets}
          </div>

          <div
            style={{
              ...typography.heading2,
              textTransform: 'uppercase',
              maxWidth: 600,
              textShadow: `0 4px 10px ${colors.nearlyBlack}`
            }}
          >
            sets were X-0
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
