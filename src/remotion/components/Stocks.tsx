import React from 'react';
import { AbsoluteFill, Img, staticFile, useVideoConfig } from 'remotion';

export const Stocks: React.FC = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ width, height }}>
      <Img
        src={staticFile('/images/stocks.svg')}
        style={{ width: '100%', height: '100%', opacity: 0.125 }}
      />
    </AbsoluteFill>
  );
};
