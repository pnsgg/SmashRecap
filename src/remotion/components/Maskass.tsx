import React from 'react';
import { Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const SPRITES = [
  '/images/maskass/fly-0.png',
  '/images/maskass/fly-1.png',
  '/images/maskass/fly-2.png',
  '/images/maskass/fly-3.png'
];

interface MaskassProps {
  style?: React.CSSProperties;
  fps?: number;
}

export const Maskass: React.FC<MaskassProps> = ({ style, fps = 24 }) => {
  const frame = useCurrentFrame();
  const { fps: videoFps } = useVideoConfig();

  const timeInSeconds = frame / videoFps;
  const currentAnimationFrame = Math.floor(timeInSeconds * fps);
  const spriteIndex = currentAnimationFrame % SPRITES.length;

  const currentSprite = SPRITES[spriteIndex];

  return (
    <Img
      pauseWhenLoading
      src={staticFile(currentSprite)}
      style={{
        display: 'block',
        objectFit: 'contain',
        ...style
      }}
    />
  );
};
