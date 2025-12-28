<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    size?: 'small' | 'medium';
  } & Omit<HTMLInputAttributes, 'size'>;

  let { size = 'medium', ...props }: Props = $props();
</script>

<input data-size={size} {...props} />

<style lang="scss">
  input {
    background-color: var(--black-variant);

    &[data-size='small'] {
      --height: 2.5rem;
      --padding: 0.5rem 1.5rem;
    }

    &[data-size='medium'] {
      --height: 3.5rem;
      --padding: 0.75rem 1.5rem;
    }

    &:focus {
      outline: 2px solid var(--black-variant);
      outline-offset: 2px;
    }

    height: var(--height);
    padding: var(--padding);
    color: var(--white);
  }
</style>
