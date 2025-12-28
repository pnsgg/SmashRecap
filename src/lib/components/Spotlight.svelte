<script lang="ts">
  type Props = {
    fill?: string;
    fillOpacity?: number;
  };

  let { fill = 'white', fillOpacity = 1 }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 3787 2842"
  fill="none"
  preserveAspectRatio="xMidYMid slice"
>
  <defs>
    <filter
      id="filter"
      x="0.860352"
      y="0.838989"
      width="3785.16"
      height="2840.26"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
      <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8"></feGaussianBlur>
    </filter>
    <pattern id="pattern" patternUnits="userSpaceOnUse" width="1024" height="1024">
      <image href="/images/stocks.svg" x="0" y="0" width="1024" height="1024" />
    </pattern>
    <mask id="spotlight-mask">
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          {fill}
          fill-opacity={fillOpacity}
        ></ellipse>
      </g>
    </mask>
  </defs>

  <!-- The pattern rect, masked by the spotlight -->
  <rect width="100%" height="100%" fill="url(#pattern)" mask="url(#spotlight-mask)" />
</svg>

<style>
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  svg {
    animation: fade-in 2s ease 0.75s 1 forwards;
    position: fixed;
    inset: 0;
    z-index: -1;
    opacity: 0;
    object-fit: cover;
    width: 100vw;
    height: 100vh;
  }
</style>
