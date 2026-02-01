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
import { Trailer } from './Trailer';
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
            year: 2025,
            user: {
              gamerTag: 'Miya',
              image:
                'https://images.start.gg/images/user/1002311/image-1cfa44fda16c7d373c2942481aaea1bd.jpg',
              country: 'Japan',
              prefix: 'FENNEL',
              socialMedias: { x: 'manmamiya13' }
            }
          },
          tournamentsProps: {
            year: 2025,
            attendance: [
              { month: 'Jan', attendance: 6 },
              { month: 'Feb', attendance: 4 },
              { month: 'Mar', attendance: 6 },
              { month: 'Apr', attendance: 3 },
              { month: 'May', attendance: 4 },
              { month: 'Jun', attendance: 2 },
              { month: 'Jul', attendance: 1 },
              { month: 'Aug', attendance: 4 },
              { month: 'Sep', attendance: 3 },
              { month: 'Oct', attendance: 2 },
              { month: 'Nov', attendance: 2 },
              { month: 'Dec', attendance: 2 }
            ]
          },
          performancesProps: {
            performances: [
              {
                finalPlacement: 1,
                initialSeed: 6,
                tournament: {
                  image:
                    'https://images.start.gg/images/tournament/859066/image-43bf8c3e41734e140ca74f737cb290a8.png',
                  name: 'Weekly Smash Party ～スマパ～ #212',
                  date: 'Dec 10',
                  location: '中野区',
                  attendees: 67
                }
              },
              {
                finalPlacement: 1,
                initialSeed: 5,
                tournament: {
                  image:
                    'https://images.start.gg/images/tournament/818138/image-6a76a77f0c823891314780af67cc07bc.png',
                  name: 'Weekly Smash Party ～スマパ～ #200',
                  date: 'Aug 20',
                  location: '中野区',
                  attendees: 74
                }
              },
              {
                finalPlacement: 1,
                initialSeed: 3,
                tournament: {
                  image:
                    'https://images.start.gg/images/tournament/744261/image-15889b625c0ffff5782ab0121f1d3baa.png?ehk=eiZqMk05g3xoE9caLksE%2Bs0hPuuvwLB59tFDT1DADIg%3D&ehkOptimized=owOSUNfFqiXK%2FHtrsiuh9e8ld6NNDSqbSIesV5Kcciw%3D',
                  name: 'Riptide 2025',
                  date: 'Sep 05',
                  location: 'Sandusky',
                  attendees: 2069
                }
              },
              {
                finalPlacement: 1,
                initialSeed: 3,
                tournament: {
                  image:
                    'https://images.start.gg/images/tournament/777707/image-e88c178c13f6cbf9d3b7dac31f08d3b5.png',
                  name: 'Supernova 2025',
                  date: 'Aug 07',
                  location: 'Chantilly',
                  attendees: 4590
                }
              },
              {
                finalPlacement: 1,
                initialSeed: 3,
                tournament: {
                  image:
                    'https://images.start.gg/images/tournament/726021/image-c931b2a168829adc629e3606ec2d3402.png?ehk=75YXN5HE3y3Uu1p4sHj7k5gJg9xxoNihutOIIDu90bI%3D&ehkOptimized=cjg547%2Frbtz8zx9UrIxWLq4Kp9wl3oHbUz%2FVBbLNka0%3D',
                  name: 'Battle of BC 7',
                  date: 'Mar 28',
                  location: 'Vancouver',
                  attendees: 1756
                }
              }
            ]
          },
          favouriteCharactersProps: {
            characters: [
              {
                name: 'Mr. Game & Watch',
                count: 412,
                image: '/images/chara_1/mr_game_and_watch.webp'
              },
              { name: 'Steve', count: 74, image: '/images/chara_1/steve.webp' },
              { name: 'Wolf', count: 30, image: '/images/chara_1/wolf.webp' }
            ]
          },
          highestUpsetProps: {
            tournament: {
              name: 'Weekly Smash Party ～スマパ～ #200',
              date: 'Aug 20',
              image:
                'https://images.start.gg/images/tournament/818138/image-6a76a77f0c823891314780af67cc07bc.png'
            },
            opponent: {
              gamerTag: 'KEN',
              prefix: 'SBI',
              avatar:
                'https://images.start.gg/images/user/285335/image-e1a02071945fd348b4394738062c870a.JPG?ehk=T0rBWYQc9hoht0TmQFLEliIS%2Be%2BOkECZaa0wb2iNfF8%3D&ehkOptimized=geSClQnm454a4zK%2F7h9sNCirGu%2Beb1UaNBAJpB6Wjss%3D'
            },
            match: { score: '2 - 0', factor: 4, round: 'Winners Semi-Final' }
          },
          game5WarriorProps: { totalSets: 333, wins: 73, winRate: 71.23287671232876 },
          worstMatchupsProps: {
            matchups: [
              {
                characterName: 'Steve',
                count: 55,
                winCount: 33,
                lossCount: 22,
                looseRate: 40,
                image: '/images/chara_1/steve.webp'
              },
              {
                characterName: 'Olimar',
                count: 33,
                winCount: 21,
                lossCount: 12,
                looseRate: 36.36363636363637,
                image: '/images/chara_1/olimar.webp'
              },
              {
                characterName: 'Sonic',
                count: 42,
                winCount: 31,
                lossCount: 11,
                looseRate: 26.190476190476193,
                image: '/images/chara_1/sonic.webp'
              }
            ]
          },
          gauntletProps: {
            encountered: [
              'Dr. Mario',
              'Steve',
              'Olimar',
              'Min Min',
              'R.O.B.',
              'Sonic',
              'Sora',
              'Joker',
              'Kazuya',
              'Pac-Man',
              'Samus',
              'Captain Falcon',
              'Zelda',
              'Snake',
              'Rosalina',
              'Duck Hunt',
              'Yoshi',
              'Wario',
              'Hero',
              'Luigi',
              'Ice Climbers',
              'Pichu',
              'Daisy',
              'Chrom',
              'Roy',
              'Pyra & Mythra',
              'Falco',
              'Corrin',
              'Mega Man',
              'Palutena',
              'Fox',
              'Cloud',
              'Pikachu',
              'Mario',
              'Peach',
              'Wii Fit Trainer',
              'Marth',
              'Ike',
              'Bayonetta',
              'Mii Brawler',
              'Donkey Kong',
              'Diddy Kong',
              'Incineroar',
              'Villager',
              'Greninja',
              'Piranha Plant',
              'Shulk',
              'Zero Suit Samus',
              'Wolf',
              'Young Link',
              'Sephiroth',
              'Jigglypuff',
              'Mr. Game & Watch',
              'Isabelle',
              'Banjo-Kazooie',
              'Lucario'
            ]
          },
          cleanSweepProps: { totalSets: 333, totalSweeps: 193 },
          dqProps: { totalDQs: 2 },
          dayOfWeekActivityProps: {
            activity: [
              { day: 'Mon', count: 5 },
              { day: 'Tue', count: 1 },
              { day: 'Wed', count: 1 },
              { day: 'Thu', count: 7 },
              { day: 'Fri', count: 3 },
              { day: 'Sat', count: 11 },
              { day: 'Sun', count: 11 }
            ]
          },
          busterRunProps: {
            finalPlacement: 33,
            initialSeed: 1,
            spr: -10,
            tournament: {
              image:
                'https://images.start.gg/images/tournament/763140/image-0215d294f4b532a9023c2a1273d246eb.png?ehk=8xaz2MgSf6ULriCk%2F7t7AAqPkUy7RVNBrQR1wqRY4Cw%3D&ehkOptimized=PUQT05Fk4x%2B7elotCACZd%2F6WQRQQpVi0n%2FUsHMCK%2FpA%3D',
              name: 'Weekly Smash Party ～スマパ～ #177',
              date: 'Mar 05',
              location: '中野区',
              attendees: 69
            }
          },
          rivalryProps: {
            rival: {
              gamerTag: 'KEN',
              wins: 9,
              losses: 3,
              image:
                'https://images.start.gg/images/user/285335/image-e1a02071945fd348b4394738062c870a.JPG?ehk=T0rBWYQc9hoht0TmQFLEliIS%2Be%2BOkECZaa0wb2iNfF8%3D&ehkOptimized=geSClQnm454a4zK%2F7h9sNCirGu%2Beb1UaNBAJpB6Wjss%3D'
            },
            nemesis: {
              gamerTag: 'あcola',
              wins: 1,
              losses: 4,
              image:
                'https://images.start.gg/images/user/1787719/image-35fd5b39c6aaedb64a3aefce818370c2.jpg?ehk=X%2FEHj7gWLTCd9d8AatiRAHg7ohd2%2FtruyLEalBfmdhs%3D&ehkOptimized=pdf7tlJy0ZqW6An9C6TUbZJ8jkLSM9Ajfd77fVgJ6a0%3D'
            }
          },
          gameStats: { won: 765, lost: 220, winRate: 77.66497461928934 },
          setsPlayed: 333
        }}
      />
      <Composition
        id="Trailer"
        component={Trailer}
        durationInFrames={900}
        width={1920}
        height={1080}
        fps={FPS}
      />
    </>
  );
};
