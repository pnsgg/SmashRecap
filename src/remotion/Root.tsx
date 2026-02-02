import { loadFont } from '@remotion/fonts';
import React from 'react';
import { Composition, staticFile, Folder } from 'remotion';
import {
  CLEAN_SWEEP_DURATION,
  DQ_DURATION,
  END_CARD_DURATION,
  FAVOURITE_CHARACTER_DURATION,
  FPS,
  GAME_5_WARRIOR_DURATION,
  HIGHEST_UPSET_DURATION,
  MAIN_COMPOSITION_HEIGHT,
  MAIN_COMPOSITION_WIDTH,
  PERFORMANCES_DURATION,
  THE_GAUNTLET_DURATION,
  THIS_IS_MY_RECAP_DURATION,
  TOURNAMENTS_DURATION,
  DAY_OF_WEEK_ACTIVITY_DURATION,
  BUSTER_RUN_DURATION,
  RIVALRIES_DURATION
} from './config';
import { calculateTimeline } from './logic/timeline';
import { Main, mainSchema } from './Main';

import { EndCard } from './EndCard';
import { MyPerformances, myPerformancesSchema } from './MyPerformances';
import { ThisIsMyRecap, thisIsMyRecapSchema } from './ThisIsMyRecap';
import { Tournaments, tournamentsSchema } from './Tournaments';
import { VerticalStill } from './VerticalStill';

import { CleanSweep, cleanSweepSchema } from './CleanSweep';
import { WORST_MATCHUPS_DURATION } from './config';
import { DQ, dqSchema } from './DQ';
import { FavouriteCharacters, favouriteCharactersSchema } from './FavouriteCharacter';
import { Game5Warrior, game5WarriorSchema } from './Game5Warrior';
import { HighestUpset, highestUpsetSchema } from './HighestUpset';
import { Rivalries, rivalrySchema } from './Rivalries';
import {
  ATTENDANCE,
  CLEAN_SWEEP_STATS,
  DAY_OF_WEEK_STATS,
  BUSTER_RUN_STATS,
  RIVALRY_STATS,
  DQ_STATS,
  FAVOURITE_CHARACTERS,
  GAME_5_STATS,
  GAUNTLET_STATS,
  HIGHEST_UPSET,
  ME,
  PERFORMANCES,
  WORST_MATCHUPS,
  YEAR,
  GAME_STATS,
  TOTAL_SETS_MOCK
} from './mock';
import { typography } from './styles';
import './styles/remotion.css';
import { TheGauntlet, theGauntletSchema } from './TheGauntlet';
import { WorstMatchups, worstMatchupsSchema } from './WorstMatchups';
import { DayOfWeekActivity, dayOfWeekActivitySchema } from './DayOfWeekActivity';
import { BusterRun, busterRunSchema } from './BusterRun';

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  loadFont({
    family: typography.fontFamily,
    url: staticFile('/fonts/InstrumentSans-VariableFont_wdth,wght.ttf'),
    display: 'block'
  })
    .then(() => console.log('Font loaded'))
    .catch(console.error);
  loadFont({
    family: 'Impact',
    url: staticFile('/fonts/Impact.woff2'),
    display: 'block'
  });

  return (
    <>
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="Main"
        component={Main}
        schema={mainSchema}
        durationInFrames={
          calculateTimeline({
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
            rivalryProps: RIVALRY_STATS,
            gauntletProps: GAUNTLET_STATS,
            game5WarriorProps: GAME_5_STATS,
            cleanSweepProps: CLEAN_SWEEP_STATS,
            dqProps: DQ_STATS,
            worstMatchupsProps: {
              matchups: WORST_MATCHUPS
            },
            dayOfWeekActivityProps: DAY_OF_WEEK_STATS,
            busterRunProps: BUSTER_RUN_STATS,
            gameStats: GAME_STATS,
            setsPlayed: TOTAL_SETS_MOCK
          }).totalDuration
        }
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames: calculateTimeline(props).totalDuration
          };
        }}
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
          rivalryProps: RIVALRY_STATS,
          gauntletProps: GAUNTLET_STATS,
          game5WarriorProps: GAME_5_STATS,
          cleanSweepProps: CLEAN_SWEEP_STATS,
          dqProps: DQ_STATS,
          worstMatchupsProps: {
            matchups: WORST_MATCHUPS
          },
          dayOfWeekActivityProps: DAY_OF_WEEK_STATS,
          busterRunProps: BUSTER_RUN_STATS,
          gameStats: GAME_STATS,
          setsPlayed: TOTAL_SETS_MOCK
        }}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
      />
      <Folder name="Scenes">
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
          id="Rivalries"
          component={Rivalries}
          schema={rivalrySchema}
          durationInFrames={RIVALRIES_DURATION}
          width={MAIN_COMPOSITION_WIDTH}
          height={MAIN_COMPOSITION_HEIGHT}
          fps={FPS}
          defaultProps={RIVALRY_STATS}
        />

        <Composition
          id="TheGauntlet"
          component={TheGauntlet}
          schema={theGauntletSchema}
          durationInFrames={THE_GAUNTLET_DURATION}
          width={MAIN_COMPOSITION_WIDTH}
          height={MAIN_COMPOSITION_HEIGHT}
          fps={FPS}
          defaultProps={GAUNTLET_STATS}
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
          id="WorstMatchups"
          component={WorstMatchups}
          schema={worstMatchupsSchema}
          durationInFrames={WORST_MATCHUPS_DURATION}
          width={MAIN_COMPOSITION_WIDTH}
          height={MAIN_COMPOSITION_HEIGHT}
          fps={FPS}
          defaultProps={{
            matchups: WORST_MATCHUPS
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
        <Composition
          id="DQ"
          component={DQ}
          schema={dqSchema}
          durationInFrames={DQ_DURATION}
          width={MAIN_COMPOSITION_WIDTH}
          height={MAIN_COMPOSITION_HEIGHT}
          fps={FPS}
          defaultProps={DQ_STATS}
        />
        <Composition
          id="DayOfWeekActivity"
          component={DayOfWeekActivity}
          schema={dayOfWeekActivitySchema}
          durationInFrames={DAY_OF_WEEK_ACTIVITY_DURATION}
          width={MAIN_COMPOSITION_WIDTH}
          height={MAIN_COMPOSITION_HEIGHT}
          fps={FPS}
          defaultProps={DAY_OF_WEEK_STATS}
        />
        <Composition
          id="BusterRun"
          component={BusterRun}
          schema={busterRunSchema}
          durationInFrames={BUSTER_RUN_DURATION}
          width={MAIN_COMPOSITION_WIDTH}
          height={MAIN_COMPOSITION_HEIGHT}
          fps={FPS}
          defaultProps={BUSTER_RUN_STATS}
        />
      </Folder>
      <Composition
        id="VerticalStill"
        component={VerticalStill}
        schema={mainSchema}
        durationInFrames={1}
        width={1080}
        height={1440}
        fps={FPS}
        defaultProps={{
          thisIsMyRecapProps: {
            year: YEAR,
            user: ME
          },
          tournamentsProps: {
            year: YEAR,
            attendance: ATTENDANCE
          },
          performancesProps: {
            performances: PERFORMANCES
          },
          favouriteCharactersProps: {
            characters: FAVOURITE_CHARACTERS
          },
          highestUpsetProps: HIGHEST_UPSET,
          rivalryProps: RIVALRY_STATS,
          gauntletProps: GAUNTLET_STATS,
          game5WarriorProps: GAME_5_STATS,
          cleanSweepProps: CLEAN_SWEEP_STATS,
          dqProps: DQ_STATS,
          worstMatchupsProps: {
            matchups: WORST_MATCHUPS
          },
          dayOfWeekActivityProps: DAY_OF_WEEK_STATS,
          busterRunProps: BUSTER_RUN_STATS,
          gameStats: GAME_STATS,
          setsPlayed: TOTAL_SETS_MOCK
        }}
      />
    </>
  );
};
