<script lang="ts">
  import { resolve } from '$app/paths';
  import { Button, type ButtonProps } from '$lib/components/Button';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import { getPlayerStats } from '$lib/remotes/players.remote';
  import { createBlueSkyIntent, createXIntent } from '$lib/socialIntents';
  import type { MainProps } from '$remotion/Main';
  import { YEAR } from '$remotion/mock';
  import PlayerViewWrapper from '$remotion/PlayerViewWrapper.svelte';
  import type { PlayerRef } from '@remotion/player';

  let { data } = $props();

  const mobile = new IsMobile();

  let player = $state<PlayerRef | undefined>();
  let downloadButton = $state<HTMLAnchorElement | undefined>();
  let isDownloading = $state(false);
  let downloadButtonProps = $state<ButtonProps>();

  let userId = $derived(data.userId);

  const renderRecap = async (stats: MainProps) => {
    isDownloading = true;

    const req = await fetch(`/api/render`, {
      headers: {
        Authorization: `Bearer ${'coucou'}`
      },
      method: 'POST',
      body: JSON.stringify(stats)
    });

    if (!req.ok) {
      const message = await req.text();
      console.error('Render failed:', message);
      isDownloading = false;
      return;
    }

    // Download the video
    const download = `${stats.thisIsMyRecapProps.user.prefix} ${stats.thisIsMyRecapProps.user.gamerTag}'s SmashRecap ${stats.thisIsMyRecapProps.year}.mp4`;
    const blob = await req.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = download;
    a.click();
    isDownloading = false;
    URL.revokeObjectURL(url);
  };
</script>

{#await getPlayerStats({ userId, year: 2025 })}
  <div style="width: 100%">
    <p class="heading">Your recap for {YEAR} is loading...</p>
  </div>
{:then stats}
  {@const videoProps = {
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
    highestUpsetProps: stats.highestUpset,
    game5WarriorProps: {
      totalSets: stats.sets.total,
      wins: stats.sets.lastgames
    },
    rivalsProps: stats.rivals,
    gauntletProps: stats.gauntlet,
    cleanSweepProps: {
      totalSets: stats.sets.total,
      totalSweeps: stats.sets.cleansweeps
    }
  }}
  <div class="my-recap">
    <div id="remotion-root">
      <PlayerViewWrapper bind:player data={videoProps} />
    </div>

    <div class="instructions">
      <div class="actions">
        <Button
          bind:ref={downloadButton}
          id="download-button"
          extended
          size={mobile.current ? 'small' : 'medium'}
          onclick={() => renderRecap(videoProps)}
          disabled={isDownloading}
          {...downloadButtonProps}
        >
          {#if isDownloading}
            Downloading...
          {:else}
            Download Video
          {/if}
        </Button>
        <div class="posts">
          <Button
            extended
            target="_blank"
            href={createXIntent({
              text: `This is my Smash Recap! Get your own: ${data.canonicalUrl}\n\n[Delete this placeholder, download and drag your MP4 video in here]`
            })}
            variant="secondary"
            size={mobile.current ? 'small' : 'medium'}
          >
            Post #SmashRecap on X
          </Button>
          <Button
            extended
            target="_blank"
            href={createBlueSkyIntent({
              text: `This is my Smash Recap! Get your own: ${data.canonicalUrl}\n\n[Delete this placeholder, download and drag your MP4 video in here]`,
              isMobile: data.userAgentInfo.isMobile
            })}
            variant="secondary"
            size={mobile.current ? 'small' : 'medium'}
          >
            Post #SmashRecap on Bluesky
          </Button>
        </div>
      </div>
      <Button
        extended
        href={resolve('/')}
        size={mobile.current ? 'small' : 'medium'}
        variant="tertiary"
      >
        Recap another user
      </Button>
    </div>
  </div>
{/await}

<style lang="scss">
  p.heading {
    text-align: center;
  }

  .my-recap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    min-height: calc(100svh - 2 * 2rem);

    @media screen and (min-width: 768px) {
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
      min-height: auto;

      margin: 0 auto;
      width: 100%;
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
      justify-content: space-between;
      width: 100%;
      flex: 1;

      @media screen and (min-width: 768px) {
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
</style>
