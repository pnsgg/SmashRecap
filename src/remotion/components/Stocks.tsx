import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';

export const Stocks: React.FC<{ opacity?: number }> = ({ opacity = 0.125 }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('/images/stocks.svg')})`,
        backgroundSize: '100% auto',
        backgroundRepeat: 'repeat-y',
        opacity
      }}
    />
  );
};
