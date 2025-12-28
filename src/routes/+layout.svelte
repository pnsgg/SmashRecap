<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import Spotlight from '$lib/components/Spotlight.svelte';
  import '../styles/app.css';

  let { children, data } = $props();
  const year = new Date().getFullYear();

  const siteName = 'SmashRecap';
  const title = `${siteName} - Your ${year} Smash Bros. Ultimate year in review`;
  const description =
    'Unwrap your journey through the tournaments, battles, and triumphs that made your Smash year unforgettable.';

  const image = '/images/og.png';
</script>

<svelte:head>
  <!-- Base Meta Tags -->
  <link rel="icon" href={favicon} />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content="Super Smash Bros" />
  <meta name="author" content="Gérald Leban" />
  <meta name="theme-color" content="#1b0015" />

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={data.canonicalUrl} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={title} />
  <meta name="twitter:creator" content="le_grld" />

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={data.canonicalUrl} />
  <meta property="og:image" content={image} />
  <meta property="og:image:alt" content={title} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
</svelte:head>

<Spotlight fillOpacity={0.125} />

{@render children()}
