import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { BreathingYear } from './components/BreathingYear';
import { PlayerCard } from './components/PlayerCard';
import { Stocks } from './components/Stocks';

import { colors, typography } from './styles';

export const thisIsMyRecapSchema = z.object({
  year: z.number().min(1),
  user: z.object({
    image: z.string().url(),
    prefix: z.string().optional(),
    gamerTag: z.string(),
    country: z.string().optional(),
    pronouns: z.string().optional(),
    socialMedias: z.object({
      x: z.string().optional()
    })
  })
});

export type ThisIsMyRecapProps = z.infer<typeof thisIsMyRecapSchema>;

export const ThisIsMyRecap: React.FC<ThisIsMyRecapProps> = ({
  year,
  user
}: z.infer<typeof thisIsMyRecapSchema>) => {
  const { height, fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const startFrame = 100;
  const showInfo = frame >= startFrame;
  const entrance = spring({
    fps,
    frame: frame - startFrame,
    config: {
      damping: 17
    }
  });

  const titleTranslateY = interpolate(entrance, [0, 1], [-height, 0]);
  const cardTranslateY = interpolate(entrance, [0, 1], [height, height * 0.3]);

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily
      }}
    >
      <Stocks />

      <BreathingYear
        total={6}
        baseScale={1}
        amplitude={0.05}
        speed={0.125}
        frequency={0.7}
        opacities={[1, 0.88, 0.76, 0.64, 0.52, 0.4]}
        colors={[
          colors.reallyWhite,
          colors.redPns10,
          colors.redPns25,
          colors.redPns,
          colors.redPns75,
          colors.redPns90
        ]}
        fontSize={140}
        framesBeforeExit={fps * 2}
      />

      {showInfo && (
        <>
          <AbsoluteFill
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              transform: `translateY(${cardTranslateY}px)`
            }}
          >
            <PlayerCard
              image={user.image}
              gamerTag={user.gamerTag}
              country={user.country}
              pronouns={user.pronouns}
              xHandle={user.socialMedias.x}
              prefix={user.prefix}
            />
          </AbsoluteFill>

          <AbsoluteFill
            style={{
              paddingLeft: 24,
              paddingTop: 32,
              transform: `translateY(${titleTranslateY}px)`
            }}
          >
            <h1
              style={{
                fontSize: '105px',
                lineHeight: 0.9,
                fontVariationSettings: "'wdth' 75, 'wght' 700",
                color: colors.reallyWhite,
                maxWidth: 550
              }}
            >
              This is my
              <br />
              <span
                style={{
                  color: colors.redPns
                }}
              >
                #SmashRecap
              </span>
              <br />
              {year}
            </h1>
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};
