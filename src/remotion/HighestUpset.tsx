import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { Stocks } from './components/Stocks';
import { colors, makeFontVariationSettings, typography } from './styles';

export const highestUpsetSchema = z.object({
  tournament: z.object({
    name: z.string(),
    date: z.string(),
    image: z.string().optional()
  }),
  opponent: z.object({
    gamerTag: z.string(),
    prefix: z.string().optional(),
    avatar: z.string().optional()
  }),
  match: z.object({
    score: z.string(),
    factor: z.number(),
    round: z.string()
  })
});

export const HighestUpset: React.FC<z.infer<typeof highestUpsetSchema>> = ({
  match,
  opponent,
  tournament
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Title Entrance (Center)
  const titleEntrance = spring({
    fps,
    frame,
    config: {
      damping: 200
    }
  });

  // Phase 2: Title Move Up
  const titleMoveUp = spring({
    fps,
    frame: frame - 40,
    config: {
      damping: 200,
      mass: 0.8
    }
  });

  // Phase 3: Content Reveal (Coin Flip & Stats)
  const contentReveal = spring({
    fps,
    frame: frame - 50,
    config: {
      damping: 200
    }
  });

  // Phase 4: Coin Flip
  const coinFlip = spring({
    fps,
    frame: frame - 65,
    config: {
      mass: 1.5,
      damping: 200,
      stiffness: 150
    }
  });

  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);
  // Move from center (0) to top (-height/3)
  const titleY = interpolate(titleMoveUp, [0, 1], [0, -220]);
  const titleScale = interpolate(titleMoveUp, [0, 1], [1.2, 0.9]);

  // Crossfade opacities for text replacement
  const text1Opacity = interpolate(titleMoveUp, [0, 0.5], [1, 0]);
  const text2Opacity = interpolate(titleMoveUp, [0.3, 0.8], [0, 1]);

  const contentOpacity = interpolate(contentReveal, [0, 1], [0, 1]);
  const contentY = interpolate(contentReveal, [0, 1], [100, 0]);

  // Coin Flip Rotation: 0 to 180
  const rotation = interpolate(coinFlip, [0, 1], [0, 180]);

  // Upset Factor Pop
  const factorPop = spring({
    fps,
    frame: frame - 90,
    config: { damping: 12 }
  });
  const factorScale = interpolate(factorPop, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily,
        color: colors.reallyWhite,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
      }}
    >
      <Stocks opacity={0.04} />

      {/* Main Content Container */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Title Section */}
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: titleOpacity,
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            zIndex: 10,
            width: '100%'
          }}
        >
          {/* Text 1: Initial slogan */}
          <h1
            style={{
              position: 'absolute',
              fontSize: 54,
              lineHeight: 0.9,
              textAlign: 'center',
              fontVariationSettings: makeFontVariationSettings({
                width: 75,
                weight: 700
              }),
              width: '100%',
              margin: 0,
              opacity: text1Opacity,
              top: '50%',
              transform: 'translateY(-50%)' // Center vertically relative to parent
            }}
          >
            Against all odds <br />
            you rewrote the script
          </h1>

          {/* Text 2: Final title */}
          <h1
            style={{
              position: 'absolute',
              fontSize: 54,
              lineHeight: 0.9,
              textAlign: 'center',
              fontVariationSettings: makeFontVariationSettings({
                width: 75,
                weight: 700
              }),
              width: '100%',
              margin: 0,
              opacity: text2Opacity,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            Highest Upset Factor
          </h1>
        </div>

        {/* Revealed Content Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            opacity: contentOpacity,
            transform: `translateY(${contentY}px)`,
            marginTop: 80 // Offset to be below the moved-up title
          }}
        >
          {/* Coin Flip Container */}
          <div
            style={{
              width: 180,
              height: 180,
              perspective: 1000
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${rotation}deg)`
              }}
            >
              {/* Front Face: Question Mark */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  backgroundColor: colors.nearlyBlack,
                  borderRadius: '50%',
                  border: `4px solid ${colors.silver}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
              >
                <span style={{ fontSize: 100, color: colors.silver, fontWeight: 'bold' }}>?</span>
              </div>

              {/* Back Face: Avatar */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  borderRadius: '50%',
                  border: `4px solid ${colors.redPns}`,
                  backgroundColor: colors.nearlyBlack, // prevent transparency issues
                  boxShadow: '0 4px 20px rgba(255, 27, 76, 0.4)'
                }}
              >
                {opponent.avatar ? (
                  <Img
                    pauseWhenLoading
                    src={opponent.avatar}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.nearlyBlack,
                      color: colors.reallyWhite,
                      fontSize: 80,
                      fontWeight: 'bold',
                      fontVariationSettings: makeFontVariationSettings({
                        width: 75,
                        weight: 700
                      })
                    }}
                  >
                    {opponent.gamerTag.charAt(0).toUpperCase()}
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    backgroundColor: colors.redPns,
                    color: colors.reallyWhite,
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 24,
                    fontVariationSettings: makeFontVariationSettings({
                      width: 75,
                      weight: 700
                    }),
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    transform: `scale(${factorScale})`
                  }}
                >
                  +{match.factor}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                ...typography.subtitle,
                color: colors.silver,
                textTransform: 'uppercase',
                fontSize: 18
              }}
            >
              {opponent.prefix}
            </span>
            <span
              style={{
                ...typography.heading2,
                fontSize: 40,
                lineHeight: 1
              }}
            >
              {opponent.gamerTag}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 10,
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: '16px 32px',
              borderRadius: 16
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  ...typography.smallText,
                  color: colors.silver,
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}
              >
                Score
              </div>
              <div style={{ ...typography.heading3, color: colors.gold }}>{match.score}</div>
            </div>
            <div style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  ...typography.smallText,
                  color: colors.silver,
                  textTransform: 'uppercase',
                  marginBottom: 4
                }}
              >
                Round
              </div>
              <div style={{ ...typography.heading3 }}>{match.round}</div>
            </div>
          </div>

          {tournament.image && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 10,
                opacity: 0.6
              }}
            >
              <Img
                pauseWhenLoading
                src={tournament.image}
                style={{ width: 30, height: 30, borderRadius: 4 }}
              />
              <span style={{ ...typography.paragraph, fontSize: 16 }}>
                {tournament.name} • {tournament.date}
              </span>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
