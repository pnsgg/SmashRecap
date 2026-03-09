import React from 'react';
import { AbsoluteFill, staticFile } from 'remotion';

export const Stocks: React.FC<{ opacity?: number; type?: 'png' | 'svg' }> = ({
  opacity = 0.125,
  type = 'png'
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`/images/stocks.${type}`)})`,
        backgroundSize: '100% auto',
        backgroundRepeat: 'repeat-y',
        opacity
      }}
    />
  );
};
