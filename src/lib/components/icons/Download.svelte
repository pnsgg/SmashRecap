<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  type Props = SVGAttributes<SVGSVGElement>;

  let { width, height, ...restProps }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  fill="currentColor"
  viewBox="0 0 24 24"
  {...restProps}
>
  ><path
    d="M3 19H21V21H3V19ZM13 13.1716L19.0711 7.1005L20.4853 8.51472L12 17L3.51472 8.51472L4.92893 7.1005L11 13.1716V2H13V13.1716Z"
  ></path></svg
>
