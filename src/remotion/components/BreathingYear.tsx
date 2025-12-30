import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { typography } from './../styles';

export type BreathingYearProps = {
  total: number;
  baseScale: number;
  amplitude: number;
  speed: number;
  frequency: number;
  opacities: number[];
  colors: string[];
  fontSize: number;
  framesBeforeExit: number;
};

export const BreathingYear: React.FC<BreathingYearProps> = ({
  total,
  baseScale,
  amplitude,
  speed,
  frequency,
  opacities,
  colors,
  fontSize,
  framesBeforeExit
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: typography.fontFamily,
        perspective: '2000px'
      }}
    >
      {Array.from({ length: total }).map((_, idx) => {
        // Entrance animation: Falling
        const dropSpring = spring({
          fps,
          frame: frame - idx * 3,
          config: {
            damping: 12,
            mass: 0.5
          }
        });

        const translateY = (1 - dropSpring) * -1000;
        const entranceOpacity = dropSpring;

        // Continuous Breathing Animation
        const breathingOffset = amplitude * Math.sin(frame * speed + idx * frequency);
        const currentScale = baseScale + breathingOffset * dropSpring;

        const baseOpacity = opacities[idx % opacities.length];
        const currentColor = colors[idx % colors.length];

        // Exit Animation
        const exitStart = durationInFrames - framesBeforeExit;
        const exitProgress = spring({
          fps,
          frame: frame - exitStart - idx * 3,
          config: { damping: 12, mass: 0.5 }
        });

        const exitTranslateY = exitProgress * 1000;

        const finalOpacity = baseOpacity * entranceOpacity * (1 - exitProgress);
        const finalTranslateY = translateY + exitTranslateY;

        return (
          <div
            key={idx}
            style={{
              color: currentColor,
              ...typography.heading,
              fontSize,
              textAlign: 'center',
              width: '100%',
              marginTop: idx === 0 ? 0 : -60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: total - idx,
              opacity: finalOpacity,
              transform: `translateY(${finalTranslateY}px) scale(${currentScale})`
            }}
          >
            2025
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
