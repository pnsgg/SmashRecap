<script lang="ts">
  import { searchPlayerQuery } from '$lib/remotes/players.remote';
  import { Command, Dialog } from 'bits-ui';
  import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
  import Spinner from 'phosphor-svelte/lib/Spinner';
  import { Debounced } from 'runed';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';

  let {
    open = $bindable(false)
  }: {
    open: boolean;
  } = $props();

  let value = $state('');
  let debouncedValue = new Debounced(() => value, 500);

  const fullPlayerName = (gamerTag: string, prefix: string | null): string => {
    if (prefix) return `${prefix} ${gamerTag}`;
    return gamerTag;
  };
</script>

<Dialog.Root
  bind:open
  onOpenChange={(open) => {
    if (!open) value = '';
  }}
>
  <Dialog.Overlay class="dialog-overlay" />
  <Dialog.Content class="dialog-content">
    <Command.Root class="command-root" shouldFilter={false}>
      <div class="input-wrapper">
        <MagnifyingGlass class="search-icon" size={20} />
        <Command.Input bind:value placeholder={m['search.placeholder']()} class="command-input" />
      </div>

      <Command.List class="command-list">
        {#await searchPlayerQuery(debouncedValue.current)}
          <div class="loading-state">
            <Spinner class="spinner" size={24} />
            <span>{m['search.searching']()}</span>
          </div>
        {:then results}
          {#if results.length === 0 && value.length > 0}
            <Command.Empty class="command-empty">{m['search.no_results']()}</Command.Empty>
          {:else if results.length > 0}
            <Command.Group>
              {#each results as player (player.slug)}
                {@const slug = player.slug.replace('user/', '')}
                <Command.LinkItem
                  class="command-link"
                  href={localizeHref(`/user/${slug}`)}
                  value={player.slug}
                >
                  <div class="player-item-content">
                    {#if player.image}
                      <img src={player.image} alt={player.gamerTag} class="player-avatar" />
                    {:else}
                      <div class="player-avatar-placeholder">
                        <span class="player-avatar-fallback-text">?</span>
                      </div>
                    {/if}
                    <div class="player-info">
                      <span class="player-gamertag">
                        {fullPlayerName(player.gamerTag, player.prefix)}
                      </span>
                      {#if player.country}
                        <span class="player-country">{player.country}</span>
                      {/if}
                    </div>
                  </div>
                </Command.LinkItem>
              {/each}
            </Command.Group>
          {/if}
        {:catch}
          <div class="error-info">
            <span class="error-title">{m['search.error_title']()}</span>
            <span class="error-message">{m['search.error_fetch_failed']()}</span>
          </div>
        {/await}
      </Command.List>
    </Command.Root>
  </Dialog.Content>
</Dialog.Root>

<style>
  :global(.dialog-content) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 600px;
    background-color: var(--nearly-black);
    color: var(--really-white);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    overflow: hidden;
    padding: 0;

    :global(.command-root) {
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: var(--nearly-black);

      .input-wrapper {
        display: flex;
        align-items: center;
        padding: 1rem;
        background: var(--really-white);
        color: var(--nearly-black);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        gap: 0.75rem;

        :global(.command-input) {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.125rem;
          font-family: inherit;
          background: transparent;

          &::placeholder {
            /*color: var(--really-white);*/
            opacity: 0.4;
          }
        }
      }

      :global(.command-list) {
        max-height: 400px;
        overflow-y: auto;
        padding: 0.5rem;

        .loading-state,
        :global(.command-empty) {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: var(--really-white);
          gap: 0.5rem;
          opacity: 0.6;
        }

        :global(.spinner) {
          animation: spin 1s linear infinite;
        }

        :global(.command-link) {
          text-decoration: none;
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-size: 1rem;
          color: var(--really-white);
          transition: background-color 0.15s ease;
          display: flex;
          align-items: center;

          &[data-selected] {
            background-color: var(--red-pns-10);
            color: var(--red-pns);
          }

          .player-item-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;

            .player-avatar {
              width: 2rem;
              height: 2rem;
              border-radius: 9999px;
              object-fit: cover;
              background-color: rgba(255, 255, 255, 0.1);
            }

            .player-avatar-placeholder {
              width: 2rem;
              height: 2rem;
              border-radius: 9999px;
              background-color: rgba(255, 255, 255, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;

              .player-avatar-fallback-text {
                font-size: 0.75rem;
                opacity: 0.5;
              }
            }

            .player-info {
              display: flex;
              flex-direction: column;

              .player-gamertag {
                font-weight: 600;
                font-size: 1rem;
              }

              .player-country {
                font-size: 0.8rem;
                opacity: 0.7;
              }
            }
          }
        }

        .error-info {
          display: flex;
          flex-direction: column;

          .error-title {
            font-weight: 600;
            font-size: 1rem;
          }

          .error-message {
            font-size: 0.8rem;
            opacity: 0.7;
          }
        }
      }
    }
  }

  :global(.dialog-overlay) {
    position: fixed;
    inset: 0;
    background-color: color-mix(in srgb, var(--nearly-black) 100%, transparent 80%);
    /*backdrop-filter: blur(4px);*/
    z-index: 999;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
