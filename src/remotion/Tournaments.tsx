import React from 'react';
import { AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { Bar } from './components/Bar';
import { Stocks } from './components/Stocks';
import { colors, makeFontVariationSettings, typography } from './styles';

export const tournamentsSchema = z.object({
  year: z.number().min(0),
  attendance: z
    .object({
      month: z.string().min(1).max(3),
      attendance: z.number().min(0)
    })
    .array()
    .length(12)
});

export type TournamentsProps = z.infer<typeof tournamentsSchema>;

export const Tournaments: React.FC<TournamentsProps> = ({ year, attendance }) => {
  const highestAttendance = Math.max(...attendance.map((t) => t.attendance));

  const GAP = 8;
  const maxBarHeight = 362;

  return (
    <AbsoluteFill
      id="remotion-root"
      style={{
        alignItems: 'center',
        fontFamily: typography.fontFamily,
        paddingLeft: 24,
        paddingRight: 24,
        color: colors.nearlyBlack
      }}
    >
      {<Stocks opacity={0.04} />}

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
        In {year}, you've been to <br /> 167 tournaments!
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: GAP,
          width: '100%',
          height: maxBarHeight + 80, // slightly more space for labels
          alignItems: 'flex-end',
          justifyContent: 'center',
          transform: 'translateY(40px)'
        }}
      >
        {attendance.map(({ month, attendance }, index) => {
          const barPixelHeight = (attendance / highestAttendance) * maxBarHeight;

          const finalHeight = Math.max(4, barPixelHeight);
          const isHighest = attendance === highestAttendance;

          return (
            <div
              key={month}
              style={{
                height: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end'
              }}
            >
              <Bar
                isHighest={isHighest}
                maxHeight={finalHeight}
                index={index + 1}
                label={month}
                value={attendance}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
