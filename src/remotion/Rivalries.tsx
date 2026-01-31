import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { colors, makeFontVariationSettings, typography } from './styles';

export const rivalSchema = z.object({
  gamerTag: z.string(),
  wins: z.number(),
  losses: z.number(),
  image: z.string().optional()
});
export type Rival = z.infer<typeof rivalSchema>;
export const rivalrySchema = z.object({
  rival: rivalSchema.optional(),
  nemesis: rivalSchema.optional()
});
export type Rivalry = z.infer<typeof rivalrySchema>;

export const Rivalries: React.FC<Rivalry> = ({ rival, nemesis }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 200
    }
  });

  const titleY = interpolate(entrance, [0, 1], [-50, 0]);
  const titleOpacity = interpolate(entrance, [0, 1], [0, 1]);

  const cardEntrance = (delay: number) =>
    spring({
      fps,
      frame: frame - delay,
      config: {
        damping: 15,
        stiffness: 100
      }
    });

  const Card = ({
    title,
    data,
    color,
    delay
  }: {
    title: string;
    data: Rival;
    color: string;
    delay: number;
  }) => {
    const s = cardEntrance(delay);
    const opacity = interpolate(s, [0, 1], [0, 1]);
    const x = interpolate(s, [0, 1], [delay === 30 ? -100 : 100, 0]);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity,
          transform: `translateX(${x}px)`,
          flex: 1
        }}
      >
        <div
          style={{
            ...typography.subtitle,
            color,
            textTransform: 'uppercase',
            fontSize: 20,
            fontVariationSettings: makeFontVariationSettings({ weight: 800 })
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `4px solid ${color}`,
            overflow: 'hidden',
            backgroundColor: colors.nearlyBlack
          }}
        >
          {data?.image ? (
            <Img src={data.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 60,
                fontWeight: 'bold'
              }}
            >
              {data?.gamerTag?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...typography.heading3, fontSize: 24 }}>{data?.gamerTag}</div>
          <div style={{ ...typography.paragraph, color: colors.silver, fontSize: 18 }}>
            {data?.wins}W - {data?.losses}L
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        color: colors.reallyWhite,
        fontFamily: typography.fontFamily,
        padding: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          width: '100%'
        }}
      >
        <h1
          style={{
            ...typography.heading1,
            fontSize: 56,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textAlign: 'center'
          }}
        >
          Rivals & Nemeses
        </h1>

        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around',
            gap: 20
          }}
        >
          {rival && <Card title="Rival" data={rival} color={colors.gold} delay={30} />}
          {nemesis && <Card title="Nemesis" data={nemesis} color={colors.redPns} delay={45} />}
        </div>
      </div>
    </AbsoluteFill>
  );
};
