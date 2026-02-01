<script lang="ts">
  import PNS from '$lib/components/icons/PNS.svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import * as m from '$lib/paraglide/messages';

  type Props = HTMLAttributes<HTMLDivElement>;

  let props: Props = $props();
</script>

<div class="credits" {...props}>
  <div class="credit">
    <span class="small-text">{m['credits.developed_by']()}</span>
    <a href="https://x.com/le_grld" aria-label={m['credits.aria_developed_by']()}>
      <img src="/images/x.svg" alt="X icon" width="20" height="20" />
      <span class="paragraph">@le_grld</span>
    </a>
  </div>
  <div class="credit">
    <span class="small-text">{m['credits.source_code']()}</span>
    <a href="https://github.com/pnsgg/smashrecap" aria-label={m['credits.aria_source_code']()}>
      <img src="/images/github-mark-white.svg" alt="X icon" width="20" height="20" />
      <span class="paragraph">GitHub</span>
    </a>
  </div>
  <div class="credit">
    <span class="small-text">{m['credits.supported_by']()}</span>
    <a href="https://pns.gg" aria-label={m['credits.aria_supported_by']()}>
      <PNS />
    </a>
  </div>
</div>

<style lang="scss">
  .credits {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    padding-bottom: 2rem;
    padding-left: 2rem;
    padding-right: 2rem;

    @media screen and (min-width: 768px) {
      flex-direction: row;
      gap: 2.25rem;
    }

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
