<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import FeaturedProfiles from '$lib/components/FeaturedProfiles.svelte';
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
  <section id="hero">
    {@render children()}
  </section>

  <section>
    <FeaturedProfiles />
  </section>
</main>

<Credits />

<style lang="scss">
  main {
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
        padding-top: 8rem;
      }
    }
  }
</style>
