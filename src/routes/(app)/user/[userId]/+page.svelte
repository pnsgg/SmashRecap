<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import { createBlueSkyIntent, createXIntent } from '$lib/socialIntents';
  import PlayerViewWrapper from '$remotion/PlayerViewWrapper.svelte';
  import type { PlayerRef } from '@remotion/player';

  let { data } = $props();

  const intentText = `This is my Smash Recap! Get your own: ${data.canonicalUrl}\n\n[Delete this placeholder, download and drag your MP4 video in here]`;

  const xIntent = createXIntent({
    text: intentText
  });

  const blueSkyIntent = createBlueSkyIntent({
    text: intentText,
    isMobile: data.userAgentInfo.isMobile
  });

  const mobile = new IsMobile();

  let player = $state<PlayerRef | undefined>();
</script>

<div class="my-recap">
  <div id="remotion-root">
    <PlayerViewWrapper
      bind:player
      data={{
        background: true,
        year: 2025,
        user: {
          gamerTag: 'RouxChov',
          image: 'https://github.com/gerald-lbn.png',
          country: 'France',
          prefix: 'PNS',
          pronouns: 'He/Him',
          socialMedias: {
            x: 'le_grld'
          }
        }
      }}
    />
  </div>

  <div class="instructions">
    <div class="actions">
      <Button
        extended
        size={mobile.current ? 'small' : 'medium'}
        onclick={() => alert('Download your video')}
      >
        Download your video
      </Button>
      <div class="posts">
        <Button
          extended
          target="_blank"
          href={xIntent}
          variant="secondary"
          size={mobile.current ? 'small' : 'medium'}
        >
          Post #SmashRecap on X
        </Button>
        <Button
          extended
          target="_blank"
          href={blueSkyIntent}
          variant="secondary"
          size={mobile.current ? 'small' : 'medium'}
        >
          Post #SmashRecap on BlueSky
        </Button>
      </div>
    </div>
    <Button extended size={mobile.current ? 'small' : 'medium'} variant="tertiary">
      Recap another user
    </Button>
  </div>
</div>

<style lang="scss">
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
