<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/Button';

  const statusCode = page.status;
  const message = page.error?.message;
</script>

<main>
  <div class="info">
    <h1 class="heading"><span class="code">{statusCode}</span> {message}</h1>
    {#if statusCode === 404}
      <p class="heading4">Looks like you went straight into the blast zone.</p>
    {:else}
      <p class="heading4">Something went wrong.</p>
    {/if}
  </div>

  {#if statusCode === 404}
    <Button href="/">Go upstage</Button>
  {:else}
    <Button href="/">Go back</Button>
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    min-height: 100svh;

    padding: 2rem 1.25rem;

    .info {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      text-align: center;

      h1 {
        span {
          color: var(--red-pns);
        }
      }
    }
  }
</style>
