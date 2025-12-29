<script lang="ts" module>
  export type Props = {
    ref?: HTMLAnchorElement | HTMLButtonElement;
    href?: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium';
    icon?: Component<Partial<SVGAttributes<SVGSVGElement>>>;
    disabled?: boolean;
    extended?: boolean;
  } & (HTMLButtonAttributes | HTMLAnchorAttributes);
</script>

<script lang="ts">
  import type { Component } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes, SVGAttributes } from 'svelte/elements';

  let {
    ref = $bindable(),
    href,
    children,
    variant = 'primary',
    size = 'medium',
    icon: Icone,
    disabled = false,
    extended = false,
    ...restProps
  }: Props = $props();

  let svgSize = $derived(size === 'medium' ? 32 : 24);
</script>

{#if href && !disabled}
  <a
    bind:this={ref}
    data-variant={variant}
    data-size={size}
    data-extended={extended}
    {href}
    {...restProps as HTMLAnchorAttributes}
  >
    {#if Icone}
      <Icone width={svgSize} height={svgSize} />
    {/if}

    {#if children}
      <div class="label small-text">
        {@render children()}
      </div>
    {/if}
  </a>
{:else}
  <button
    bind:this={ref}
    data-variant={variant}
    data-size={size}
    data-extended={extended}
    {disabled}
    {...restProps as HTMLButtonAttributes}
  >
    {#if Icone}
      <Icone width={svgSize} height={svgSize} />
    {/if}

    {#if children}
      <div class="label small-text">
        {@render children()}
      </div>
    {/if}
  </button>
{/if}

<style lang="scss">
  a,
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    user-select: none;
    text-decoration: none;
    cursor: pointer;

    font-weight: 600;

    white-space: nowrap;
    max-width: fit-content;

    &[data-extended='true'] {
      max-width: unset;
      width: 100%;
    }

    &[data-size='small'] {
      height: 2.5rem;

      padding: 0.5rem 1.5rem;

      :global {
        &:has(svg) {
          // icone + text
          padding-left: 2rem;
        }
      }
    }

    &[data-size='medium'] {
      height: 3rem;

      padding: 0.75rem 1.5rem;

      :global {
        &:has(svg) {
          // icon + text
          padding-left: 2rem;
        }
      }
    }

    &[data-variant='primary'] {
      --bg: var(--red-pns);
      --bg-hover: var(--red-pns-75);
      --text: var(--really-white);
      --focus-ring: 2px solid var(--red-pns-75);
    }

    &[data-variant='secondary'] {
      --bg: var(--red-pns-10);
      --bg-hover: var(--red-pns-25);
      --text: var(--nearly-black);
      --focus-ring: 2px solid var(--red-pns-25);
    }

    &[data-variant='tertiary'] {
      --bg: #493344;
      --bg-hover: #493344;
      --text: var(--really-white);
      --focus-ring: 2px solid #493344;
    }

    background-color: var(--bg);
    color: var(--text);
    &:focus {
      outline: var(--focus-ring);
      outline-offset: 2px;
    }

    @media (hover: hover) {
      &:hover:not(:disabled) {
        background-color: var(--bg-hover);
      }
    }

    &:focus-visible {
      background-color: var(--bg-hover);
    }

    &:disabled {
      cursor: not-allowed;
      filter: brightness(0.8);
    }
  }
</style>
