<script lang="ts">
  let {
    onclick = () => {},
    text = '',
    disabled = false,
  }: {
    onclick: () => void;
    text?: string;
    disabled?: boolean;
  } = $props();
</script>

<button
  class="flex-row void-btn"
  class:text
  {onclick}
  aria-label="Reset"
  {disabled}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="20"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M 70 -50 A 85 85 0 1 0 85 0" fill="none" />
    <polygon points="70 -50 60 -90 30 -55" />
  </svg>
  {text}
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $soft-white;
    stroke: $soft-white;
    color: $soft-white;

    svg {
      width: 1.5rem;
    }

    &:hover,
    &:active,
    &:focus-visible {
      fill: $cyan;
      stroke: $cyan;
      color: $cyan;
      opacity: 1 !important;

      svg {
        transform: rotate(300deg);
      }
    }

    &.text {
      gap: 0.5rem;
      opacity: 0.5;
      text-transform: uppercase;

      svg {
        height: 1rem;
      }
    }
  }
</style>
