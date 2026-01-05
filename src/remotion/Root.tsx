import { loadFont } from '@remotion/fonts';
import React from 'react';
import { Composition, staticFile } from 'remotion';
import {
  CLEAN_SWEEP_DURATION,
  END_CARD_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  FPS,
  GAME_5_WARRIOR_DURATION,
  HIGHEST_UPSET_DURATION,
  MAIN_COMPOSITION_HEIGHT,
  MAIN_COMPOSITION_WIDTH,
  PERFORMANCES_DURATION,
  RIVALS_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  totalDuration,
  TOURNAMENTS_DURATION
} from './config';
import { Main, mainSchema } from './Main';

import { EndCard } from './EndCard';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';

import { CleanSweep, cleanSweepSchema } from './CleanSweep';
import { FavouriteCharacters, favouriteCharactersSchema } from './FavouriteCharacter';
import { Game5Warrior, game5WarriorSchema } from './Game5Warrior';
import { HighestUpset, highestUpsetSchema } from './HighestUpset';
import {
  ATTENDANCE,
  CLEAN_SWEEP_STATS,
  FAVOURITE_CHARACTERS,
  GAME_5_STATS,
  HIGHEST_UPSET,
  ME,
  PERFORMANCES,
  RIVALS,
  YEAR
} from './mock';
import { Rivals, rivalsSchema } from './Rivals';
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
        schema={mainSchema}
        durationInFrames={totalDuration({
          characters: FAVOURITE_CHARACTERS.length,
          hasHighestUpset: !!HIGHEST_UPSET,
          hasRivals: !!RIVALS
        })}
        fps={FPS}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        defaultProps={{
          thisIsMyRecapProps: {
            user: ME,
            year: YEAR
          },
          tournamentsProps: {
            attendance: ATTENDANCE,
            year: YEAR
          },
          performancesProps: {
            performances: PERFORMANCES
          },
          favouriteCharactersProps: {
            characters: FAVOURITE_CHARACTERS
          },
          highestUpsetProps: HIGHEST_UPSET,
          rivalsProps: RIVALS,
          game5WarriorProps: GAME_5_STATS,
          cleanSweepProps: CLEAN_SWEEP_STATS
        }}
      // You can override these props for each render:
      // https://www.remotion.dev/docs/parametrized-rendering
      />
      <Composition
        id="HighestUpset"
        component={HighestUpset}
        schema={highestUpsetSchema}
        durationInFrames={HIGHEST_UPSET_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={HIGHEST_UPSET}
      />
      <Composition
        id="Rivals"
        component={Rivals}
        schema={rivalsSchema}
        durationInFrames={RIVALS_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={RIVALS}
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
        id="Game5Warrior"
        component={Game5Warrior}
        schema={game5WarriorSchema}
        durationInFrames={GAME_5_WARRIOR_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={GAME_5_STATS}
      />
      <Composition
        id="CleanSweep"
        component={CleanSweep}
        schema={cleanSweepSchema}
        durationInFrames={CLEAN_SWEEP_DURATION}
        width={MAIN_COMPOSITION_WIDTH}
        height={MAIN_COMPOSITION_HEIGHT}
        fps={FPS}
        defaultProps={CLEAN_SWEEP_STATS}
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
