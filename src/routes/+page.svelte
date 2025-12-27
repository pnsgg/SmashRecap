<script lang="ts">
  import PlayerViewWrapper from '$remotion/PlayerViewWrapper.svelte';
  import type { PlayerRef } from '@remotion/player';

  let player = $state<PlayerRef>();

  let data = {
    titleText: 'Smash Recap',
    titleColor: 'rgb(255, 255, 255)',
    logoColor1: 'rgb(255, 0, 0)',
    logoColor2: 'rgb(0, 255, 0)'
  };
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<PlayerViewWrapper bind:player {data} />
