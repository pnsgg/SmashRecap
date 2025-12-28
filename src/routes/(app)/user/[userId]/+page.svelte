<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { createBlueSkyIntent, createXIntent } from '$lib/socialIntents';

  let { data } = $props();

  const intentText = `This is my Smash Recap! Get your own: ${data.canonicalUrl}\n\n[Delete this placeholder, download and drag your MP4 video in here]`;

  const xIntent = createXIntent({
    text: intentText
  });

  const blueSkyIntent = createBlueSkyIntent({
    text: intentText,
    isMobile: data.userAgentInfo.isMobile
  });
</script>

<div class="my-recap">
  <div class="preview">
    <img src="/images/preview.png" alt="User Preview" />
  </div>

  <div class="instructions">
    <div class="actions">
      <Button extended size="small" onclick={() => alert('Download your video')}>
        Download your video
      </Button>
      <div class="posts">
        <Button extended target="_blank" href={xIntent} variant="secondary" size="small">
          Post #SmashRecap on X
        </Button>
        <Button extended target="_blank" href={blueSkyIntent} variant="secondary" size="small">
          Post #SmashRecap on BlueSky
        </Button>
      </div>
    </div>
    <Button extended size="small" variant="tertiary">Recap another user</Button>
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
      padding: 2rem;

      border: 2px solid var(--really-white);

      background-color: var(--nearly-black);
    }

    .preview {
      border: 2px solid var(--really-white);

      @media screen and (min-width: 768px) {
        border: none;
      }

      img {
        aspect-ratio: 1 / 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
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
