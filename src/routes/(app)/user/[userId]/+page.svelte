<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { Button, type ButtonProps } from '$lib/components/Button';
  import Download from '$lib/components/icons/Download.svelte';
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
  let renderingProgress = $state<number | undefined>(undefined);
  let downloadButtonProps = $state<ButtonProps>();

  let userId = $derived(data.userId);
  let shareUrl = $derived(page.url.href);

  const downloadFromUrl = (url: string, name: string): void => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderRecap = async (stats: MainProps) => {
    isDownloading = true;

    const year = stats.thisIsMyRecapProps.year;
    const filename =
      `${stats.thisIsMyRecapProps.user.prefix ?? ''} ${stats.thisIsMyRecapProps.user.gamerTag}'s SmashRecap ${stats.thisIsMyRecapProps.year}.mp4`.trim();

    // Trigger the render
    const renderReq = await fetch(`/api/render`, {
      method: 'POST',
      body: JSON.stringify({ stats, userId, filename, year })
    });

    if (!renderReq.ok) {
      isDownloading = false;
      renderingProgress = undefined;
      return;
    }

    const renderResponse = await renderReq.json();
    if ('url' in renderResponse) {
      isDownloading = false;
      renderingProgress = undefined;
      return downloadFromUrl(renderResponse.url, filename);
    }

    const { renderId, bucketName } = renderResponse;

    const checkProgress = async () => {
      const progressReq = await fetch('/api/render/progress', {
        method: 'POST',
        body: JSON.stringify({ renderId, bucketName, userId: data.userId, year })
      });

      if (!progressReq.ok) {
        const message = await progressReq.text();
        throw new Error(message);
      }

      return progressReq.json();
    };

    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const progress = await checkProgress();
        if (progress.type === 'error') {
          alert('Render failed: ' + progress.message);
          isDownloading = false;
          renderingProgress = undefined;
          return;
        }

        if (progress.type === 'done') {
          isDownloading = false;
          renderingProgress = undefined;

          const downloadUrl = `/api/download?url=${encodeURIComponent(progress.url)}&filename=${encodeURIComponent(filename)}`;
          downloadFromUrl(downloadUrl, filename);
          break;
        }
        renderingProgress = progress.progress;
      } catch {
        isDownloading = false;
        renderingProgress = undefined;
        return;
      }
    }
  };
</script>

{#await getPlayerStats({ userId, year: 2025 })}
  <div class="loading-container">
    <p class="heading">Your recap for {YEAR} is loading...</p>
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
    highestUpsetProps: stats.highestUpset,
    game5WarriorProps: {
      totalSets: stats.sets.total,
      wins: stats.sets.lastgames.count,
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
    busterRunProps: stats.worstPerformance,
    rivalryProps: stats.rivalry
  }}
  {#if videoProps.tournamentsProps.attendance.reduce((acc, month) => acc + month.attendance, 0) > 0}
    <div class="my-recap">
      <div id="remotion-root">
        <PlayerViewWrapper bind:player data={videoProps} autoPlay />
      </div>

      <div class="instructions">
        <div class="actions">
          <Button onclick={() => alert(JSON.stringify(videoProps, null, 2))} extended>
            Debug me
          </Button>
          <Button
            bind:ref={downloadButton}
            id="download-button"
            extended
            size={mobile.current ? 'small' : 'medium'}
            onclick={() => renderRecap(videoProps)}
            disabled={isDownloading}
            icon={Download}
            {...downloadButtonProps}
          >
            {#if isDownloading}
              {#if renderingProgress !== undefined}
                Progress: {Math.round(renderingProgress * 100)}%
              {:else}
                Downloading...
              {/if}
            {:else}
              Download Video
            {/if}
          </Button>
          <div class="posts">
            <Button
              extended
              target="_blank"
              href={createXIntent({
                text: `This is my SmashRecap! Get your own: ${shareUrl}\n\n[Delete this placeholder, download and drag your MP4 video in here]`
              })}
              variant="secondary"
              size={mobile.current ? 'small' : 'medium'}
            >
              Share your SmashRecap on X
            </Button>
            <Button
              extended
              target="_blank"
              href={createBlueSkyIntent({
                text: `This is my SmashRecap! Get your own: ${shareUrl}\n\n[Delete this placeholder, download and drag your MP4 video in here]`,
                isMobile: data.userAgentInfo.isMobile
              })}
              variant="secondary"
              size={mobile.current ? 'small' : 'medium'}
            >
              Share your SmashRecap on Bluesky
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
  {:else}
    <div class="no-stats">
      <p class="heading">
        No tournament attendance found for {YEAR}. <br /> Recap cannot be generated.
      </p>
      <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
        <Button href={resolve('/')} size={mobile.current ? 'small' : 'medium'} variant="tertiary">
          Try another user
        </Button>
      </div>
    </div>
  {/if}
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

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .no-stats {
    width: 100%;
  }
</style>
