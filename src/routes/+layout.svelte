<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import Spotlight from '$lib/components/Spotlight.svelte';
  import '../styles/app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Spotlight fillOpacity={0.125} />

{@render children()}
