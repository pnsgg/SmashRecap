import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { z } from 'zod';
import { Stocks } from './components/Stocks';
import { ALL_FIGHTERS, getFighterInfo } from './constants';
import { colors, makeFontVariationSettings, typography } from './styles';

export const theGauntletSchema = z.object({
  encountered: z.array(z.string())
});

export type TheGauntletProps = z.infer<typeof theGauntletSchema>;

const GRID_COLS = 10;
const ICON_SIZE = 60;
const GAP = 8;

export const TheGauntlet: React.FC<TheGauntletProps> = ({ encountered }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const encounteredSet = useMemo(() => new Set(encountered), [encountered]);

  const titleEntrance = spring({
    fps,
    frame,
    config: { damping: 20 }
  });

  const moveUp = spring({
    fps,
    frame: frame - 60,
    config: {
      damping: 200
    }
  });

  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  const titleY = interpolate(moveUp, [0, 1], [0, -(height / 2) + 100]);
  const gridSlideSpring = spring({
    fps,
    frame: frame - 60,
    config: {
      damping: 200
    }
  });

  const gridYOffset = interpolate(gridSlideSpring, [0, 1], [900, 50]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily,
        color: colors.reallyWhite,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Stocks opacity={0.05} />

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <h1
          style={{
            fontSize: 54,
            lineHeight: 0.9,
            margin: 0,
            marginBottom: 16,
            fontVariationSettings: makeFontVariationSettings({ weight: 700, width: 75 })
          }}
        >
          THE GAUNTLET
        </h1>
        <div style={{ ...typography.subtitle, color: colors.silver }}>
          You faced{' '}
          <span style={{ color: colors.redPns, fontWeight: 700 }}>{encountered.length}</span> /{' '}
          {ALL_FIGHTERS.length} Fighters
        </div>
      </div>

      {/* Character Grid */}
      <AbsoluteFill
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, ${ICON_SIZE}px)`,
          gap: GAP,
          opacity: 1,
          transform: `scale(0.7) translateY(calc(10% + ${gridYOffset}px))`,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {ALL_FIGHTERS.map((fighter, index) => {
          const isEncountered = encounteredSet.has(fighter);
          const info = getFighterInfo(fighter);

          const lightUpDelay = 60 + index * 0.5 + 15;
          const lightUpSpring = spring({
            fps,
            frame: frame - lightUpDelay,
            config: { damping: 15, stiffness: 150 }
          });

          const iconOpacity = isEncountered ? interpolate(lightUpSpring, [0, 1], [0.2, 1]) : 0.15;

          const iconScale = isEncountered
            ? interpolate(lightUpSpring, [0, 0.5, 1], [1, 1.4, 1])
            : 1;

          const filter = isEncountered ? interpolate(lightUpSpring, [0, 1], [1, 0]) : 1;

          return (
            <div
              key={fighter}
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                overflow: 'hidden',
                position: 'relative',
                transform: `scale(${iconScale})`,
                zIndex: isEncountered ? 2 : 1
              }}
            >
              <Img
                pauseWhenLoading
                src={staticFile(`/images/stocks/${info.slug}.webp`)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: iconOpacity,
                  filter: `grayscale(${filter})`
                }}
              />
              {isEncountered && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    border: `2px solid ${colors.redPns}`,
                    opacity: interpolate(lightUpSpring, [0, 1], [0, 1])
                  }}
                />
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
