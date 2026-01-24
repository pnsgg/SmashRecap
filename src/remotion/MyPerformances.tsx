import React, { useMemo } from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';
import { CornerArrow } from './components/CornerArrow';
import { colors, makeFontVariationSettings, typography } from './styles';

export const myPerformanceSchema = z.object({
  finalPlacement: z.number().min(1),
  initialSeed: z.number().min(1),
  tournament: z.object({
    image: z.string().optional(),
    name: z.string().min(1),
    date: z.string().min(1),
    location: z.string().min(1),
    attendees: z.number().min(1)
  })
});
export const myPerformancesSchema = z.object({
  performances: z.array(myPerformanceSchema)
});
export type MyPerformance = z.infer<typeof myPerformanceSchema>;
export type MyPerformancesProps = z.infer<typeof myPerformancesSchema>;

const addNumberPrefix = (num: number): string => {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${num}th`;
  }

  switch (lastDigit) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

const MyPerformanceCard: React.FC<
  MyPerformance &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
      index: number;
    }
> = ({ finalPlacement, initialSeed, tournament, style, index }) => {
  const fontSize = finalPlacement > 99 ? 30 : 44;
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    delay: index * 3,
    config: {
      damping: 200
    }
  });

  const translateX = interpolate(progress, [0, 1], [200, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const placementColor = useMemo(() => {
    if (finalPlacement === 1) return colors.gold;
    if (finalPlacement === 2) return colors.silver;
    if (finalPlacement === 3) return colors.bronze;
    return colors.reallyWhite;
  }, [finalPlacement]);

  const arrowColor = finalPlacement < initialSeed ? colors.success : colors.error;
  const showArrow = finalPlacement !== initialSeed;
  const arrowDirection = finalPlacement < initialSeed ? 'top-right' : 'bottom-right';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '10px 12px',
        backgroundColor: colors.nearlyBlack,
        fontFamily: typography.fontFamily,
        color: colors.reallyWhite,
        transform: `translateX(${translateX}px)`,
        opacity,
        ...style
      }}
    >
      {/* Placement */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 85,
          flexShrink: 0
        }}
      >
        <div
          style={{
            fontSize,
            fontVariationSettings: makeFontVariationSettings({
              width: 75,
              weight: 600
            }),
            lineHeight: 0.8,
            color: placementColor
          }}
        >
          {addNumberPrefix(finalPlacement)}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {/* Initial seed */}
          <div
            style={{
              textTransform: 'uppercase',
              display: 'inline-flex',
              gap: 4,
              alignItems: 'baseline',
              fontVariationSettings: makeFontVariationSettings({
                width: 80,
                weight: 700
              }),
              fontSize: 10,
              lineHeight: 1.6
            }}
          >
            seeded
            <span
              style={{
                fontSize: 15
              }}
            >
              {initialSeed}
            </span>
          </div>
          {/* Arrow */}
          {showArrow && (
            <CornerArrow
              direction={arrowDirection}
              fill={arrowColor}
              strokeWidth={2}
              width={15}
              height={15}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        {tournament.image ? (
          <Img
            pauseWhenLoading
            src={tournament.image}
            alt={tournament.name}
            style={{ height: 50, aspectRatio: '1/1', objectFit: 'contain', borderRadius: 4 }}
          />
        ) : (
          <div
            style={{
              height: 50,
              aspectRatio: '1/1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              color: colors.reallyWhite,
              ...typography.heading4
            }}
          >
            {tournament.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%', minWidth: 0 }}>
          <div
            style={{
              ...typography.heading3,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            {tournament.name}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 4,
              alignItems: 'center',
              fontVariationSettings: makeFontVariationSettings({
                weight: 700,
                width: 80
              }),
              fontSize: 15,
              lineHeight: 1.6,
              color: colors.reallyWhite,
              textTransform: 'uppercase'
            }}
          >
            <div>{tournament.date}</div>
            <div style={{ color: colors.redPns }}>•</div>
            <div>{tournament.location}</div>
            <div style={{ color: colors.redPns }}>•</div>
            <div>
              {tournament.attendees}
              {tournament.attendees > 1 ? ' attendees' : ' attendee'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyPerformances: React.FC<MyPerformancesProps> = ({ performances }) => {
  const { width } = useVideoConfig();

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        alignItems: 'center',
        fontFamily: typography.fontFamily,
        paddingLeft: 24,
        paddingRight: 24,
        color: colors.nearlyBlack,
        gap: 55
      }}
    >
      <h1
        style={{
          fontSize: 54,
          lineHeight: 0.9,
          fontVariationSettings: makeFontVariationSettings({
            width: 75,
            weight: 700
          }),
          width: '100%',
          transform: 'translateY(32px)'
        }}
      >
        Some of your best <br />
        performances were seen
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%'
        }}
      >
        {performances.map((performance, index) => (
          <MyPerformanceCard
            key={index}
            index={index}
            {...performance}
            style={{
              width: '100%',
              maxWidth: width - 24 * 2
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
