import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, Sequence, useCurrentFrame } from 'remotion';
import {
  END_CARD_DURATION,
  FPS,
  PERFORMANCES_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
} from './config';
import { EndCard } from './EndCard';
import { ATTENDANCE, ME, PERFORMANCES, YEAR } from './mock';
import { MyPerformances } from './MyPerformances';
import { colors } from './styles';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Tournaments } from './Tournaments';

export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  const backgroundColor = interpolateColors(
    frame,
    [THIS_IS_MY_RECAP_DURATION, THIS_IS_MY_RECAP_DURATION + FPS / 2],
    [colors.nearlyBlack, colors.reallyWhite]
  );

  const blur = interpolate(
    frame,
    [
      THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION - FPS,
      THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION
    ],
    [0, 10],
    {
      extrapolateRight: 'clamp'
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <Sequence name="ThisIsMyRecap" durationInFrames={THIS_IS_MY_RECAP_DURATION}>
        <ThisIsMyRecap user={ME} year={YEAR} />
      </Sequence>

      <Sequence
        name="Tournaments"
        from={THIS_IS_MY_RECAP_DURATION}
        durationInFrames={TOURNAMENTS_DURATION + PERFORMANCES_DURATION}
      >
        <div style={{ filter: `blur(${blur}px)`, width: '100%', height: '100%' }}>
          <Tournaments attendance={ATTENDANCE} year={YEAR} />
        </div>
      </Sequence>

      <Sequence
        name="Performances"
        from={THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION}
        durationInFrames={PERFORMANCES_DURATION}
      >
        <MyPerformances performances={PERFORMANCES} />
      </Sequence>

      <Sequence
        name="EndCard"
        from={THIS_IS_MY_RECAP_DURATION + TOURNAMENTS_DURATION + PERFORMANCES_DURATION}
        durationInFrames={END_CARD_DURATION}
      >
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
