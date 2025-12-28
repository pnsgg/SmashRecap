import React from 'react';
import { AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { PlayerCard } from './components/PlayerCard';
import { Stocks } from './components/Stocks';
import { colors, typography } from './styles';

export const thisIsMyRecapSchema = z.object({
  background: z.boolean().default(false),
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
  background,
  year,
  user
}: z.infer<typeof thisIsMyRecapSchema>) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily
      }}
    >
      {background && <Stocks />}

      <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <PlayerCard
          image={user.image}
          gamerTag={user.gamerTag}
          country={user.country}
          pronouns={user.pronouns}
          xHandle={user.socialMedias.x}
          prefix={user.prefix}
        />
      </AbsoluteFill>

      {/*<AbsoluteFill
        style={{
          paddingLeft: 24,
          paddingTop: 32
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
      </AbsoluteFill>*/}
    </AbsoluteFill>
  );
};
