import React from 'react';
import { Series } from 'remotion';
import { ThisIsMyRecap } from './ThisIsMyRecap';
import { THIS_IS_MY_RECAP_DURATION } from './config';
import { ME, YEAR } from './mock';

export const Main: React.FC = () => {
  return (
    <>
      <Series>
        <Series.Sequence durationInFrames={THIS_IS_MY_RECAP_DURATION}>
          <ThisIsMyRecap user={ME} year={YEAR} />
        </Series.Sequence>
      </Series>
    </>
  );
};
