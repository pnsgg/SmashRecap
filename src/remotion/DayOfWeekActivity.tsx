import React from 'react';
import { AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { Bar } from './components/Bar';
import { colors, makeFontVariationSettings, typography } from './styles';

export const dayOfWeekActivitySchema = z.object({
  activity: z
    .object({
      day: z.string(),
      count: z.number().min(0)
    })
    .array()
    .length(7)
});

export type DayOfWeekActivityProps = z.infer<typeof dayOfWeekActivitySchema>;

export const DayOfWeekActivity: React.FC<DayOfWeekActivityProps> = ({ activity }) => {
  const highestCount = Math.max(...activity.map((t) => t.count));

  const GAP = 12;
  const maxBarHeight = 340;

  const mostActiveDay = activity.find((t) => t.count === highestCount)!.day;

  const dayNames: Record<string, string> = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  };

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        fontFamily: typography.fontFamily,
        paddingLeft: 24,
        paddingRight: 24,
        color: colors.nearlyBlack
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
        {dayNames[mostActiveDay]} <br /> is my most active day
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: GAP,
          width: '100%',
          height: maxBarHeight + 70,
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginTop: 60
        }}
      >
        {activity.map(({ day, count }, index) => {
          const ratio = highestCount > 0 ? count / highestCount : 0;
          const barPixelHeight = ratio * maxBarHeight;

          const finalHeight = Math.max(4, barPixelHeight);
          const isHighest = count === highestCount && count > 0;

          return (
            <div
              key={day}
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
                label={day}
                value={count}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
