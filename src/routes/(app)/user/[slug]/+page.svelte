<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { Button } from '$lib/components/Button';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import { getPlayerStats } from '$lib/remotes/players.remote';
  import { createBlueSkyIntent, createXIntent } from '$lib/socialIntents';
  import type { MainProps } from '$remotion/Main';
  import { YEAR } from '$remotion/mock';
  import PlayerViewWrapper from '$remotion/PlayerViewWrapper.svelte';
  import type { PlayerRef } from '@remotion/player';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime.js';

  let { data } = $props();

  const mobile = new IsMobile();

  let player = $state<PlayerRef | undefined>();

  let userSlug = $derived(data.userSlug);
  let shareUrl = $derived(page.url.href);
  let isDebug = $derived(page.url.searchParams.get('debug') === 'true');
</script>

<div class="content">
  {#await getPlayerStats({ slug: userSlug, year: 2025 })}
    <div class="loading-container">
      <p class="heading">{m['recap.loading']({ year: YEAR })}</p>
    </div>
  {:then stats}
    {@const videoProps: MainProps = {
    thisIsMyRecapProps: {
      year: stats.year,
      user: stats.user
    },
    tournamentsProps: {
      year: stats.year,
      attendance: stats.tournamentsByMonth
    },
    performancesProps: {
      performances: stats.bestPerformances
    },
    favouriteCharactersProps: {
      characters: stats.mostPlayedCharactersByPlayer
    },
    highestUpsetProps: stats.highestUpset ?? null,
    game5WarriorProps: {
      totalSets: stats.sets.lastgames.count,
      wins: stats.sets.lastgames.winCount,
      winRate: stats.sets.lastgames.winRate
    },
    worstMatchupsProps: {
      matchups: stats.worstMatchups
    },
    gauntletProps: stats.gauntlet,
    cleanSweepProps: {
      totalSets: stats.sets.total,
      totalSweeps: stats.sets.cleansweeps
    },
    dqProps: {
      totalDQs: stats.dqs
    },
    dayOfWeekActivityProps: {
      activity: stats.dayOfWeekActivity
    },
    busterRunProps: stats.worstPerformance ?? null,
    rivalryProps: stats.rivalry ?? null,
    gameStats: stats.gameStats,
    setsPlayed: stats.sets.total,
  }}
    {#if videoProps.tournamentsProps.attendance.reduce((acc, month) => acc + month.attendance, 0) > 0}
      <div class="my-recap">
        <div id="remotion-root">
          <PlayerViewWrapper bind:player data={videoProps} autoPlay />
        </div>

        <div class="instructions">
          <div class="actions">
            {#if isDebug}
              <Button onclick={() => alert(JSON.stringify(videoProps, null, 2))} extended>
                Debug me
              </Button>
            {/if}
            <div class="posts">
              <Button
                extended
                target="_blank"
                href={createXIntent({
                  text: m['recap.share_text']({ url: shareUrl })
                })}
                variant="secondary"
                size={mobile.current ? 'small' : 'medium'}
              >
                {m['recap.share_x']()}
              </Button>
              <Button
                extended
                target="_blank"
                href={createBlueSkyIntent({
                  text: m['recap.share_text']({ url: shareUrl }),
                  isMobile: data.userAgentInfo.isMobile
                })}
                variant="secondary"
                size={mobile.current ? 'small' : 'medium'}
              >
                {m['recap.share_bluesky']()}
              </Button>
            </div>
          </div>
          <Button
            extended
            href={localizeHref('/')}
            size={mobile.current ? 'small' : 'medium'}
            variant="tertiary"
          >
            {m['recap.recap_another']()}
          </Button>
        </div>
      </div>
    {:else}
      <div class="no-stats">
        <p class="heading">
          {m['recap.no_stats']({ year: YEAR })} <br />
          {m['recap.no_stats_desc']()}
        </p>
        <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
          <Button href={resolve('/')} size={mobile.current ? 'small' : 'medium'} variant="tertiary">
            {m['recap.try_another']()}
          </Button>
        </div>
      </div>
    {/if}
  {:catch error}
    <div class="loading-container">
      <p class="heading">{error.message}</p>
      <Button href={resolve('/')} size={mobile.current ? 'small' : 'medium'} variant="tertiary">
        {m['recap.try_another']()}
      </Button>
    </div>
  {/await}
</div>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    justify-content: normal;
    align-items: center;
    min-height: calc(100svh - 2 * 2rem);
    padding: 1rem 1rem 0 1rem;

    @media screen and (min-width: 768px) {
      justify-content: center;
    }
  }

  p.heading {
    text-align: center;
  }

  .my-recap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;

    @media screen and (min-width: 768px) {
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;

      margin: 0 auto;
      max-width: 1000px;
      padding: 2rem;

      border: 2px solid var(--really-white);

      background-color: var(--nearly-black);
    }

    #remotion-root {
      width: 100%;
      aspect-ratio: 1 / 1;
      border: 2px solid var(--really-white);

      @media screen and (min-width: 768px) {
        border: none;
      }
    }

    .instructions {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
      flex: 1;

      @media screen and (min-width: 768px) {
        justify-content: space-between;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .posts {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    justify-content: center;
    align-items: center;
    height: 90svh;
    flex: 1;

    p {
      padding: 0 1rem;
    }
  }

  .no-stats {
    width: 100%;
  }
</style>
