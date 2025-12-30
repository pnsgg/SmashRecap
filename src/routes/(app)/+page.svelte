<script lang="ts">
  import { Button } from '$lib/components/Button';
  import MagnifyingGlass from '$lib/components/icons/MagnifyingGlass.svelte';
  import PNS from '$lib/components/icons/PNS.svelte';
  import StartggIcon from '$lib/components/icons/StartggIcon.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import PlayerViewWrapper from '$remotion/PlayerViewWrapper.svelte';
  import type { PlayerRef } from '@remotion/player';

  const mobile = new IsMobile();

  const year = new Date().getFullYear();
  let player = $state<PlayerRef | undefined>();
</script>

<div class="info">
  <div class="branding-heading">
    <div class="branding">
      <PNS />
      <span>#SmashRecap</span>
    </div>
    <h1 class:heading={!mobile.current} class:heading2={mobile.current}>
      Your {year} Smash Bros. Ultimate year in review
    </h1>
  </div>
  <p>
    Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year
    unforgettable.
  </p>
  <div class="actions">
    <Button extended href="/login" icon={StartggIcon} size={mobile.current ? 'small' : 'medium'}>
      Continue with start.gg
    </Button>
    <div class="divider">
      <hr />
      <span class="small-text">OR</span>
      <hr />
    </div>
    <Button
      extended
      icon={MagnifyingGlass}
      size={mobile.current ? 'small' : 'medium'}
      variant="tertiary"
    >
      Search for a player
    </Button>
  </div>
</div>
<div class="preview">
  <p class="small-text">+10,000 recaps generated</p>
  <!-- <img src="/images/preview.png" alt="Preview of the 2025 SmashRecap" class="render" /> -->
  <div id="remotion-root">
    <PlayerViewWrapper
      bind:player
      autoPlay={false}
      data={{
        year: 2025,
        user: {
          gamerTag: 'RouxChov',
          image: '/images/rouxchov.jpg',
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
</div>

<style lang="scss">
  .info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    @media screen and (min-width: 640px) {
      max-width: 600px;
      gap: 1.5rem;
    }

    .branding-heading {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .branding {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        span {
          color: var(--red-pns);
          text-transform: uppercase;
          font-size: 24px;
          line-height: 1.6;
          font-weight: 700;
          letter-spacing: -2px;
        }
      }
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .divider {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: var(--really-white);

        hr {
          width: 100%;
        }
      }
    }
  }

  .preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 500px;
    width: 100%;

    p.small-text {
      color: var(--nearly-black);
      background-color: var(--really-white);
      padding: 0.5rem 1rem;
      text-transform: uppercase;
      text-align: center;
    }

    #remotion-root {
      width: 100%;
      aspect-ratio: 1 / 1;
      border: 2px solid var(--really-white);
    }
  }
</style>
