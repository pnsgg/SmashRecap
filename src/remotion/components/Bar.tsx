import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, typography } from '../styles';

export type BarProps = {
  label: string;
  value: number;
  isHighest?: boolean;
  maxHeight: number;
  index: number;
};

export const Bar: React.FC<BarProps> = ({ label, value, isHighest, maxHeight, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    fps,
    delay: index * 2,
    frame: frame,
    config: {
      damping: 200,
      stiffness: 100
    }
  });

  const displayedValue = Math.round(interpolate(progress, [0, 1], [0, value]));
  const currentHeight = interpolate(progress, [0, 1], [0, maxHeight]);

  return (
    <div
      style={{
        fontFamily: typography.fontFamily,
        color: colors.nearlyBlack,
        ...typography.smallText,
        textAlign: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%'
      }}
    >
      <div style={{ marginBottom: 8 }}>{displayedValue}</div>
      <div
        style={{
          width: '100%',
          height: currentHeight,
          backgroundColor: isHighest ? colors.redPns : '#ffb2c3'
        }}
      ></div>

      <div style={{ marginTop: 8 }}>{label}</div>
    </div>
  );
};
