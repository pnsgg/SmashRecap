<script lang="ts">
  import PNS from '$lib/components/icons/PNS.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = HTMLAttributes<HTMLDivElement>;

  let props: Props = $props();
</script>

<div class="credits" {...props}>
  <div class="credit">
    <span class="small-text">developed by</span>
    <a href="https://x/@le_grld">
      <img src="/images/x.svg" alt="X icon" width="20" height="20" />
      <span class="paragraph">@le_grld</span>
    </a>
  </div>
  <div class="credit">
    <span class="small-text">source code</span>
    <a href="https://github.com/pnsgg/smashrecap">
      <img src="/images/github-mark-white.svg" alt="X icon" width="20" height="20" />
      <span class="paragraph">GitHub</span>
    </a>
  </div>
  <div class="credit">
    <span class="small-text">supported by</span>
    <a href="https://pns.gg">
      <PNS />
    </a>
  </div>
</div>

<style lang="scss">
  .credits {
    display: flex;
    justify-content: center;
    gap: 2.25rem;

    .credit {
      display: inline-flex;
      flex-direction: column;

      & > span {
        text-transform: uppercase;
      }

      & > a {
        text-decoration: none;
        color: inherit;

        display: inline-flex;
        gap: 6px;
        align-items: center;

        &:visited {
          color: inherit;
        }

        span.paragraph {
          font-weight: bold;
        }
      }
    }
  }
</style>
