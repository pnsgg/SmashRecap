<script lang="ts">
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import * as m from '$lib/paraglide/messages';

  const mobile = new IsMobile();

  const players = [
    { name: 'ドラ右 (Doramigi)', id: 1815290, imageUrl: '/images/recaps/ドラ右.png' },
    { name: 'Miya', id: 1002311, imageUrl: '/images/recaps/Miya.png' },
    { name: 'あcola (acola)', id: 1787719, imageUrl: '/images/recaps/あcola.png' },
    { name: 'Hurt', id: 836465, imageUrl: '/images/recaps/Hurt.png' },
    { name: 'Sparg0', id: 94369, imageUrl: '/images/recaps/Sparg0.png' },
    { name: 'Sonix', id: 165614, imageUrl: '/images/recaps/Sonix.png' },
    { name: 'Syrup', id: 767151, imageUrl: '/images/recaps/Syrup.png' },
    { name: 'Zomba', id: 252388, imageUrl: '/images/recaps/Zomba.png' },
    { name: 'カルメロ (Carmelo)', id: 2262042, imageUrl: '/images/recaps/カルメロ.png' },
    { name: 'らる (Raru)', id: 1787715, imageUrl: '/images/recaps/らる.png' },
    { name: 'Shuton', id: 134839, imageUrl: '/images/recaps/Shuton.png' },
    { name: 'Tweek', id: 10213, imageUrl: '/images/recaps/Tweek.png' },
    { name: 'Glutonny', id: 2613, imageUrl: '/images/recaps/Glutonny.png' },
    { name: 'MkLeo', id: 41259, imageUrl: '/images/recaps/MkLeo.png' },
    {
      name: 'たまPだいふく (TamaPDaifuku)',
      id: 1816581,
      imageUrl: '/images/recaps/たまPだいふく.png'
    },
    { name: 'Light', id: 95011, imageUrl: '/images/recaps/Light.png' },
    { name: 'Peabnut', id: 37364, imageUrl: '/images/recaps/Peabnut.png' },
    { name: 'Asimo', id: 964831, imageUrl: '/images/recaps/Asimo.png' },
    { name: 'Wrath', id: 52384, imageUrl: '/images/recaps/Wrath.png' },
    { name: 'Tea', id: 399160, imageUrl: '/images/recaps/Tea.png' }
  ];
</script>

<section class="featured-profiles">
  <div class="header">
    <h2 class:heading={!mobile.current} class:heading2={mobile.current}>
      {m['home.featured_profiles.title']()}
    </h2>
    <p class="small-text">{m['home.featured_profiles.description']()}</p>
  </div>

  <div class="grid">
    {#each players as player (player.id)}
      <img src={player.imageUrl} alt="" />
    {/each}
  </div>
</section>

<style lang="scss">
  .featured-profiles {
    margin-top: 4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media screen and (min-width: 640px) {
      margin-top: 6rem;
    }

    .header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      h2 {
        color: var(--really-white);
        margin: 0;
      }

      .small-text {
        color: var(--silver);
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.05em;
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 1.5rem;

      @media screen and (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      img {
        width: 100%;
        border: 2px solid var(--really-white);
      }
    }
  }
</style>
