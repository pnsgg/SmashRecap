import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';

export const Stocks: React.FC<{ opacity?: number }> = ({ opacity = 0.125 }) => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ width, height }}>
      <Img
        pauseWhenLoading
        src={staticFile('/images/stocks.svg')}
        style={{ width: '100%', height: '100%', opacity }}
      />
    </AbsoluteFill>
  );
};
