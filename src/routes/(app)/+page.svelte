<script lang="ts">
  import { Button } from '$lib/components/Button';
  import FeaturedProfiles from '$lib/components/FeaturedProfiles.svelte';
  import MagnifyingGlass from '$lib/components/icons/MagnifyingGlass.svelte';
  import PNS from '$lib/components/icons/PNS.svelte';
  import StartggIcon from '$lib/components/icons/StartggIcon.svelte';
  import SearchPlayer from '$lib/components/SearchPlayer.svelte';
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import * as m from '$lib/paraglide/messages';

  let { data } = $props();

  const mobile = new IsMobile();
  const year = 2025;
  let searchOpen = $state(false);
</script>

<SearchPlayer bind:open={searchOpen} />

<section id="hero">
  <div class="info">
    <div class="branding-heading">
      <div class="branding">
        <PNS />
        <span>#SmashRecap</span>
      </div>
      <h1 class:heading={!mobile.current} class:heading2={mobile.current}>
        {m['home.title']({ year })}
      </h1>
    </div>
    <p>
      {m['home.description']()}
    </p>
    <div class="actions">
      <Button
        extended
        href="/login"
        icon={StartggIcon}
        size={mobile.current ? 'small' : 'medium'}
        aria-label={m['actions.continue_with_sgg']()}
      >
        {m['actions.continue_with_sgg']()}
      </Button>
      <div class="divider">
        <hr />
        <span class="small-text">{m['common.or']()}</span>
        <hr />
      </div>
      <Button
        extended
        icon={MagnifyingGlass}
        size={mobile.current ? 'small' : 'medium'}
        variant="tertiary"
        onmousedown={() => (searchOpen = true)}
        ontouchstart={() => (searchOpen = true)}
      >
        {m['actions.search_player']()}
      </Button>
    </div>
  </div>

  <div class="preview">
    {#if data.totalRecaps === 0}
      <p class="small-text">{m['home.be_first']()}</p>
    {:else}
      <p class="small-text">{m['home.recaps_generated']({ count: data.totalRecaps })}</p>
    {/if}
    <div id="remotion-root">
      <video autoplay muted loop playsinline src="/videos/Glutonny.webm"></video>
    </div>
  </div>
</section>

<section>
  <FeaturedProfiles />
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    padding: 2rem 1.25rem;

    @media screen and (min-width: 640px) {
      flex-direction: row;

      margin: 0 auto;
      max-width: 1400px;
      align-items: center;
      justify-content: space-between;
    }
  }

  section#hero {
    @media screen and (min-width: 640px) {
      padding-top: 10rem;
    }
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

      #remotion-root > video {
        width: 100%;
        aspect-ratio: 1 / 1;
        border: 2px solid var(--really-white);
      }
    }
  }
</style>
