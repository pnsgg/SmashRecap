import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { Stocks } from './components/Stocks';
import { colors, makeFontVariationSettings, typography } from './styles';
import { FPS } from './config';

export const dqSchema = z.object({
  totalDQs: z.number()
});

export type DQProps = z.infer<typeof dqSchema>;

export const DQ: React.FC<DQProps> = ({ totalDQs }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const swipeProgress = spring({
    frame: frame - FPS * 2,
    fps,
    config: { damping: 200, stiffness: 100 }
  });

  const containerX = interpolate(swipeProgress, [0, 1], [0, -width], {
    extrapolateRight: 'clamp'
  });

  const enterSpring = spring({
    fps,
    frame,
    config: { damping: 200, stiffness: 100 }
  });

  const text = totalDQs > 0 ? 'Your worst enemy was \n your schedule' : 'You never disappoint';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily,
        color: colors.reallyWhite,
        justifyContent: 'center'
      }}
    >
      <Stocks opacity={0.1} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateX(${containerX}px)`
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
          {text}
        </h1>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateX(${containerX + width}px)`
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20
          }}
        >
          <div
            style={{
              transform: `scale(${enterSpring})`,
              fontSize: 240,
              lineHeight: 1,
              color: colors.reallyWhite,
              fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 700 })
            }}
          >
            {totalDQs}
          </div>

          <div
            style={{
              ...typography.heading2,
              textTransform: 'uppercase',
              maxWidth: 600,
              textAlign: 'center',
              textShadow: `0 4px 10px ${colors.nearlyBlack}`,
              opacity: interpolate(enterSpring, [0, 1], [0, 1])
            }}
          >
            DQs suffered
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
