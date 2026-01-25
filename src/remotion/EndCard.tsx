import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Maskass } from './components/Maskass';
import { Stocks } from './components/Stocks';
import { colors, typography } from './styles';

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const maskassSpring = spring({
    fps,
    frame,
    durationInFrames: fps * 10
  });

  const maskassScreenX = interpolate(maskassSpring, [0, 1], [-width, width]);
  const maskassScreenY = interpolate(maskassSpring, [0, 1], [height, -height]);

  const showFirstText = frame < 40;

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily
      }}
    >
      <Stocks />

      <AbsoluteFill
        style={{
          zIndex: 2,
          justifyContent: 'center',
          alignItems: 'center',
          width,
          height,
          position: 'absolute',
          transform: `translate(${maskassScreenX - 60}px, ${maskassScreenY - 25}px) rotate(-10deg) scale(1.2)`
        }}
      >
        <Maskass fps={24} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          ...typography.heading,
          color: colors.reallyWhite,
          textAlign: 'center',
          maxWidth: '70%',
          margin: '0 auto'
        }}
      >
        {showFirstText ? (
          'Want to know your own stats?'
        ) : (
          <span>
            Get your #SmashRecap <br /> at{' '}
            <span style={{ color: colors.redPns }}>recap.pns.gg</span>
          </span>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
