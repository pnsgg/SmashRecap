import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, makeFontVariationSettings } from '../styles';

type Score = {
  left: number;
  right: number;
};
export const FRAMES_PER_STEP = 7;
export const FONT_SIZE = 240;

export const DigitReel: React.FC<{
  side: 'left' | 'right';
  scoreHistory: Score[];
}> = ({ side, scoreHistory }) => {
  const frame = useCurrentFrame();

  const duration = scoreHistory.length * FRAMES_PER_STEP;

  const step = interpolate(frame, [0, duration], [0, scoreHistory.length - 1], {
    extrapolateRight: 'clamp'
  });

  const translateY = step * -FONT_SIZE;

  return (
    <div style={{ height: FONT_SIZE, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        {scoreHistory.map((score, index) => (
          <div
            key={index}
            style={{
              height: FONT_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.reallyWhite,
              fontSize: FONT_SIZE,
              lineHeight: 1,
              fontVariationSettings: makeFontVariationSettings({ width: 75, weight: 700 })
            }}
          >
            {score[side]}
          </div>
        ))}
      </div>
    </div>
  );
};
