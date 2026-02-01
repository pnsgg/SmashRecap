<script lang="ts">
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';

  const mobile = new IsMobile();

  const players = [
    { name: 'ドラ右 (Doramigi)', id: 1815290, imageUrl: '/images/recaps/ドラ右.webp' },
    { name: 'Miya', id: 1002311, imageUrl: '/images/recaps/Miya.webp' },
    { name: 'あcola (acola)', id: 1787719, imageUrl: '/images/recaps/あcola.webp' },
    { name: 'Hurt', id: 836465, imageUrl: '/images/recaps/Hurt.webp' },
    { name: 'Sparg0', id: 94369, imageUrl: '/images/recaps/Sparg0.webp' },
    { name: 'Sonix', id: 165614, imageUrl: '/images/recaps/Sonix.webp' },
    { name: 'Syrup', id: 767151, imageUrl: '/images/recaps/Syrup.webp' },
    { name: 'Zomba', id: 252388, imageUrl: '/images/recaps/Zomba.webp' },
    { name: 'カルメロ (Carmelo)', id: 2262042, imageUrl: '/images/recaps/カルメロ.webp' },
    { name: 'らる (Raru)', id: 1787715, imageUrl: '/images/recaps/らる.webp' },
    { name: 'Shuton', id: 134839, imageUrl: '/images/recaps/Shuton.webp' },
    { name: 'Tweek', id: 10213, imageUrl: '/images/recaps/Tweek.webp' },
    { name: 'Glutonny', id: 2613, imageUrl: '/images/recaps/Glutonny.webp' },
    { name: 'MkLeo', id: 41259, imageUrl: '/images/recaps/MkLeo.webp' },
    {
      name: 'たまPだいふく (TamaPDaifuku)',
      id: 1816581,
      imageUrl: '/images/recaps/たまPだいふく.webp'
    },
    { name: 'Light', id: 95011, imageUrl: '/images/recaps/Light.webp' },
    { name: 'Peabnut', id: 37364, imageUrl: '/images/recaps/Peabnut.webp' },
    { name: 'Asimo', id: 964831, imageUrl: '/images/recaps/Asimo.webp' },
    { name: 'Wrath', id: 52384, imageUrl: '/images/recaps/Wrath.webp' },
    { name: 'Tea', id: 399160, imageUrl: '/images/recaps/Tea.webp' }
  ];

  type FeaturedProfile = (typeof players)[number];

  const urlToRecap = (player: FeaturedProfile) => `/user/${player.id}`;
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
      <a href={localizeHref(urlToRecap(player))} class="profile-link">
        <img
          src={player.imageUrl}
          alt={m['home.featured_profiles.profile_alt']({ name: player.name })}
        />
      </a>
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
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;

      @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

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
