import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { z } from 'zod';
import { colors, makeFontVariationSettings, typography } from './styles';

export const busterRunSchema = z.object({
  finalPlacement: z.number(),
  initialSeed: z.number(),
  spr: z.number(),
  tournament: z.object({
    name: z.string(),
    date: z.string(),
    image: z.string().optional(),
    location: z.string().optional(),
    attendees: z.number().optional()
  })
});

export type BusterRunProps = z.infer<typeof busterRunSchema>;

export const BusterRun: React.FC<BusterRunProps> = ({
  finalPlacement,
  initialSeed,
  spr,
  tournament
}) => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1]);
  const contentOpacity = interpolate(frame, [15, 35], [0, 1]);

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: typography.fontFamily,
        color: colors.reallyWhite
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          opacity: titleOpacity
        }}
      >
        <h1
          style={{
            fontSize: 54,
            lineHeight: 1.1,
            fontVariationSettings: makeFontVariationSettings({
              width: 75,
              weight: 700
            }),
            width: '100%',
            textAlign: 'center',
            transform: 'translateY(32px)',
            margin: 0
          }}
        >
          Things don't always go as planned
        </h1>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 40,
          gap: 20,
          opacity: contentOpacity
        }}
      >
        {tournament.image && (
          <Img
            src={tournament.image}
            style={{
              width: 150,
              height: 150,
              borderRadius: 20
            }}
          />
        )}

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, margin: '10px 0' }}>{tournament.name}</h2>
          <div style={{ fontSize: 24 }}>
            {tournament.date} • {tournament.location}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 40,
            color: colors.redPns25
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>Seed</div>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: colors.redPns }}>
              {initialSeed}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>Placement</div>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: colors.redPns }}>
              {finalPlacement}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>SPR</div>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: colors.redPns }}>{spr}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
