<script lang="ts">
  import { IsMobile } from '$lib/hooks/is-mobile.svelte';
  import * as m from '$lib/paraglide/messages';
  import { localizeHref } from '$lib/paraglide/runtime';

  const mobile = new IsMobile();

  const players = [
    {
      name: 'ドラ右 (Doramigi)',
      slug: '82f63ee2',
      imageUrl: '/images/recaps/ドラ右.webp'
    },
    { name: 'Miya', slug: 'd8016ec8', imageUrl: '/images/recaps/Miya.webp' },
    {
      name: 'あcola (acola)',
      slug: '830dec1e',
      imageUrl: '/images/recaps/あcola.webp'
    },
    { name: 'Hurt', slug: '9b4e3c26', imageUrl: '/images/recaps/Hurt.webp' },
    { name: 'Sparg0', slug: 'b5230de8', imageUrl: '/images/recaps/Sparg0.webp' },
    { name: 'Sonix', slug: '0301d9f0', imageUrl: '/images/recaps/Sonix.webp' },
    { name: 'Syrup', slug: '0f333fd3', imageUrl: '/images/recaps/Syrup.webp' },
    { name: 'Zomba', slug: '880cbc79', imageUrl: '/images/recaps/Zomba.webp' },
    {
      name: 'カルメロ (Carmelo)',
      slug: '9e3d38c6',
      imageUrl: '/images/recaps/カルメロ.webp'
    },
    { name: 'らる (Raru)', slug: '50b1e9a9', imageUrl: '/images/recaps/らる.webp' },
    { name: 'Shuton', slug: '993a6b60', imageUrl: '/images/recaps/Shuton.webp' },
    { name: 'Tweek', slug: '0d650c15', imageUrl: '/images/recaps/Tweek.webp' },
    { name: 'Glutonny', slug: '7611d833', imageUrl: '/images/recaps/Glutonny.webp' },
    { name: 'MkLeo', slug: '3f297e74', imageUrl: '/images/recaps/MkLeo.webp' },
    {
      name: 'たまPだいふく (TamaPDaifuku)',
      slug: 'f2633635',
      imageUrl: '/images/recaps/たまPだいふく.webp'
    },
    { name: 'Light', slug: 'e2974569', imageUrl: '/images/recaps/Light.webp' },
    { name: 'Peabnut', slug: '9160966b', imageUrl: '/images/recaps/Peabnut.webp' },
    { name: 'Asimo', slug: 'ffa84c87', imageUrl: '/images/recaps/Asimo.webp' },
    { name: 'Wrath', slug: '9e90ab19', imageUrl: '/images/recaps/Wrath.webp' },
    { name: 'Tea', slug: 'ab90c078', imageUrl: '/images/recaps/Tea.webp' }
  ];

  type FeaturedProfile = (typeof players)[number];

  const urlToRecap = (player: FeaturedProfile) => `/user/${player.slug}`;
</script>

<section class="featured-profiles">
  <div class="header">
    <h2 class:heading={!mobile.current} class:heading2={mobile.current}>
      {m['home.featured_profiles.title']()}
    </h2>
    <p class="small-text">{m['home.featured_profiles.description']()}</p>
  </div>

  <div class="grid">
    {#each players as player (player.slug)}
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
