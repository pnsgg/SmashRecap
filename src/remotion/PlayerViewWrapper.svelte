<script lang="ts">
  import { type PlayerRef } from '@remotion/player';
  import React from 'react';
  import { createRoot, type Root } from 'react-dom/client';
  import { onDestroy, onMount } from 'svelte';
  import { type PlayerSchema, PlayerView } from './PlayerView';

  let { data, player = $bindable<PlayerRef>() } = $props<{
    data: PlayerSchema;
    player?: PlayerRef;
  }>();
  let containerRef: HTMLDivElement;
  let root: Root;

  // used to rerender the player when changes made
  $effect(() => {
    // we need to access the property in the $effect, because Svelte doesn't automatically detect deep changes. Use flat structure or Svelte Store instead.
    render();
  });

  function render() {
    if (!containerRef || !root) return;
    root.render(
      React.createElement(PlayerView, {
        ref: (ref) => {
          // @ts-expect-error - React thing
          player = ref?.playerRef;
        },
        data
      })
    );
  }

  onMount(() => {
    root = createRoot(containerRef);
    render();
  });

  onDestroy(() => {
    root?.unmount();
  });
</script>

<div bind:this={containerRef}></div>
