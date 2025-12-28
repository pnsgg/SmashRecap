import { loadFont } from '@remotion/fonts';
import React from 'react';
import { Composition, staticFile } from 'remotion';
import { Main } from './Main';
import { FPS, MAIN_COMPOSITION_HEIGHT, MAIN_COMPOSITION_WIDTH } from './config';

import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';

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
        durationInFrames={FPS}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={{
          background: true,
          year: 2025,
          user: {
            image: 'https://github.com/gerald-lbn.png',
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
    </>
  );
};
