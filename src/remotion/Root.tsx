import { loadFont } from '@remotion/fonts';
import React from 'react';
import { Composition, staticFile } from 'remotion';
import { Main } from './Main';
import {
  END_CARD_DURATION,
  FPS,
  MAIN_COMPOSITION_HEIGHT,
  MAIN_COMPOSITION_WIDTH,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION
} from './config';

import { EndCard } from './EndCard';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';

import { typography } from './styles';
import './styles/remotion.css';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  loadFont({
    family: typography.fontFamily,
    url: staticFile('/fonts/InstrumentSans-VariableFont_wdth,wght.ttf'),
    display: 'block'
  })
    .then(() => console.log('Font loaded'))
    .catch(console.error);

  return (
    <>
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="Main"
        component={Main}
        durationInFrames={150}
        fps={FPS}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
      />
      <Composition
        id="ThisIsMyRecap"
        component={ThisIsMyRecap}
        schema={thisIsMyRecapSchema}
        durationInFrames={THIS_IS_MY_RECAP_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={{
          year: 2025,
          user: {
            image:
              'https://images.start.gg/images/user/2858645/image-714398e1a693c64afc42d008a7a514c1.jpg',
            prefix: 'PNS',
            gamerTag: 'RouxChov',
            country: 'France',
            pronouns: 'He/Him',
            socialMedias: {
              x: 'le_grld'
            }
          }
        }}
      />
      <Composition
        id="Tournaments"
        component={Tournaments}
        schema={tournamentsSchema}
        durationInFrames={TOURNAMENTS_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={{
          year: new Date().getFullYear(),
          attendance: [
            {
              month: 'Jan',
              attendance: 4
            },
            {
              month: 'Feb',
              attendance: 6
            },
            {
              month: 'Mar',
              attendance: 8
            },
            {
              month: 'Apr',
              attendance: 24
            },
            {
              month: 'May',
              attendance: 0
            },
            {
              month: 'Jun',
              attendance: 10
            },
            {
              month: 'Jul',
              attendance: 12
            },
            {
              month: 'Aug',
              attendance: 14
            },
            {
              month: 'Sep',
              attendance: 16
            },
            {
              month: 'Oct',
              attendance: 18
            },
            {
              month: 'Nov',
              attendance: 20
            },
            {
              month: 'Dec',
              attendance: 22
            }
          ]
        }}
      />
      <Composition
        id="EndCard"
        component={EndCard}
        durationInFrames={END_CARD_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
      />
    </>
  );
};
