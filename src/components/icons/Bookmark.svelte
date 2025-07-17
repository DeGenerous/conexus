<script lang="ts">
  let {
    onclick = () => {},
    active = false,
    disabled = false,
  }: {
    onclick: () => void;
    active: boolean;
    disabled?: boolean;
  } = $props();
</script>

<button
  class="flex void-btn"
  class:active
  {onclick}
  aria-label="Add to Favorites"
  {disabled}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M5.65079137,21.7592566 C5.00211805,22.3152623 4,21.8543532 4,21 L4,5 C4,3.34314575 5.34314575,2 7,2 L17,2 C18.6568542,2 20,3.34314575 20,5 L20,21 C20,21.8543532 18.9978819,22.3152623 18.3492086,21.7592566 L12,16.3170778 L5.65079137,21.7592566 Z"
    />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    fill: $light-blue;

    svg {
      width: 2rem;
    }

    &:hover,
    &:active,
    &:focus {
      // fill: $cyan;
      @include bright;
      @include scale;
    }
  }
</style>
