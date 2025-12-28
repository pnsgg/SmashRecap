<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import Credits from '$lib/components/Credits.svelte';
  import Spotlight from '$lib/components/Spotlight.svelte';
  import '../../styles/app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Spotlight fillOpacity={0.125} />

<main>
  {@render children()}
  <Credits class="credits" />
</main>

<style lang="scss">
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    min-height: 100svh;

    padding: 2rem 1.25rem;

    @media screen and (min-width: 640px) {
      flex-direction: row;

      margin: 0 auto;
      max-width: 1400px;
      align-items: center;
      justify-content: space-between;
    }
  }

  :global(.credits) {
    @media screen and (min-width: 640px) {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 1.25rem;
    }
  }
</style>
