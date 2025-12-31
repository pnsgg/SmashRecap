import React from 'react';
import { Series } from 'remotion';
import { EndCard } from './EndCard';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { Tournaments } from './Tournaments';
import { END_CARD_DURATION, THIS_IS_MY_RECAP_DURATION, TOURNAMENTS_DURATION } from './config';
import { ATTENDANCE, ME, YEAR } from './mock';

export const Main: React.FC = () => {
  return (
    <>
      <Series>
        <Series.Sequence name="ThisIsMyRecap" durationInFrames={THIS_IS_MY_RECAP_DURATION}>
          <ThisIsMyRecap user={ME} year={YEAR} />
        </Series.Sequence>
        <Series.Sequence name="Tournaments" durationInFrames={TOURNAMENTS_DURATION}>
          <Tournaments attendance={ATTENDANCE} year={YEAR} />
        </Series.Sequence>
        <Series.Sequence name="EndCard" durationInFrames={END_CARD_DURATION}>
          <EndCard />
        </Series.Sequence>
      </Series>
    </>
  );
};
