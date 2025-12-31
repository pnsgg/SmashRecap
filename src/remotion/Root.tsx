import { loadFont } from '@remotion/fonts';
import React from 'react';
import { Composition, staticFile } from 'remotion';
import { Main } from './Main';
import {
  END_CARD_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  FPS,
  MAIN_COMPOSITION_HEIGHT,
  MAIN_COMPOSITION_WIDTH,
  PERFORMANCES_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  totalDuration,
  TOURNAMENTS_DURATION
} from './config';

import { EndCard } from './EndCard';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';

import { FavouriteCharacters, favouriteCharactersSchema } from './FavouriteCharacter';
import { ATTENDANCE, FAVOURITE_CHARACTERS, ME, PERFORMANCES, YEAR } from './mock';
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
        durationInFrames={totalDuration}
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
          year: YEAR,
          user: ME
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
          year: YEAR,
          attendance: ATTENDANCE
        }}
      />
      <Composition
        id="Performances"
        component={MyPerformances}
        schema={myPerformancesSchema}
        durationInFrames={PERFORMANCES_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={{
          performances: PERFORMANCES
        }}
      />
      <Composition
        id="FavouriteCharacters"
        component={FavouriteCharacters}
        schema={favouriteCharactersSchema}
        durationInFrames={FAVOURITE_CHARACTER_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={{
          characters: FAVOURITE_CHARACTERS
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
