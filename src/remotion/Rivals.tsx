import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { Stocks } from './components/Stocks';
import { colors, typography } from './styles';

export const rivalSchema = z.object({
  player: z.object({
    gamerTag: z.string(),
    image: z.string().optional()
  }),
  score: z.object({
    wins: z.number(),
    losses: z.number()
  })
});

export const rivalsSchema = z.object({
  nemesis: rivalSchema,
  victim: rivalSchema
});

const PlayerDisplay: React.FC<{
  type: 'nemesis' | 'victim';
  rival: z.infer<typeof rivalSchema>;
  delay: number;
}> = ({ type, rival, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame: frame - delay,
    config: {
      damping: 14,
      mass: 0.8,
      stiffness: 80
    }
  });

  const isNemesis = type === 'nemesis';
  const primaryColor = isNemesis ? colors.redPns : colors.blueBuvette;

  const xOffset = isNemesis ? -500 : 500;
  const yOffset = isNemesis ? -200 : 200;

  const translateX = interpolate(entrance, [0, 1], [xOffset, 0]);
  const translateY = interpolate(entrance, [0, 1], [yOffset, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isNemesis ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: 30,
        transform: `translate(${translateX}px, ${translateY}px)`,
        opacity
      }}
    >
      {/* Avatar Circle */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: `6px solid ${primaryColor}`,
          overflow: 'hidden',
          backgroundColor: colors.nearlyBlack,
          boxShadow: `0 0 40px ${primaryColor}60`,
          position: 'relative',
          zIndex: 2
        }}
      >
        {rival.player.image ? (
          <Img
            src={rival.player.image}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              ...typography.heading2,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
              color: colors.reallyWhite
            }}
          >
            {rival.player.gamerTag.charAt(0)}
          </div>
        )}
      </div>

      {/* Info Block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isNemesis ? 'flex-start' : 'flex-end',
          zIndex: 1
        }}
      >
        <div
          style={{
            ...typography.heading3,
            color: primaryColor,
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 5
          }}
        >
          {type}
        </div>
        <div
          style={{
            ...typography.heading2,
            fontSize: 48,
            color: colors.reallyWhite,
            marginBottom: 10,
            textAlign: isNemesis ? 'left' : 'right'
          }}
        >
          {rival.player.gamerTag}
        </div>

        {/* Score Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '10px 20px',
            borderRadius: 8,
            backdropFilter: 'blur(4px)',
            border: `1px solid ${primaryColor}40`
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                ...typography.smallText,
                color: colors.silver,
                lineHeight: 1
              }}
            >
              W
            </div>
            <div
              style={{
                ...typography.heading4,
                color: colors.success,
                lineHeight: 1
              }}
            >
              {rival.score.wins}
            </div>
          </div>
          <div style={{ width: 1, height: 25, backgroundColor: colors.silver }} />
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                ...typography.smallText,
                color: colors.silver,
                lineHeight: 1
              }}
            >
              L
            </div>
            <div
              style={{
                ...typography.heading4,
                color: colors.error,
                lineHeight: 1
              }}
            >
              {rival.score.losses}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Rivals: React.FC<z.infer<typeof rivalsSchema>> = ({ nemesis, victim }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgEntrance = spring({
    fps,
    frame,
    config: {
      damping: 20
    }
  });

  const opacity = interpolate(bgEntrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily,
        overflow: 'hidden',
        opacity
      }}
    >
      <Stocks opacity={0.05} />
      <AbsoluteFill>
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${colors.blueBuvette}40 100%)`
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill>
        <AbsoluteFill
          style={{
            background: `linear-gradient(135deg, ${colors.redPns}40 0%, transparent 60%)`
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill>
        {nemesis && (
          <div style={{ position: 'absolute', top: 40, left: 40 }}>
            <PlayerDisplay type="nemesis" rival={nemesis} delay={10} />
          </div>
        )}

        {victim && (
          <div style={{ position: 'absolute', bottom: 40, right: 40 }}>
            <PlayerDisplay type="victim" rival={victim} delay={15} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
