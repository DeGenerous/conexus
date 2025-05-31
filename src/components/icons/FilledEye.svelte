<script lang="ts">
  export let onClick = () => {};
</script>

<button class="void-btn flex" on:click={onClick} aria-label="Customization">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="15"
    stroke-linejoin="round"
    stroke-linecap="round"
  >
    <mask id="eye-circle">
      <path
        fill="white"
        stroke="white"
        d="M -80 0 Q 0 -90 80 0 Q 0 90 -80 0 Z"
      />
      <circle r="25" fill="black" stroke="black" />
    </mask>
    <circle r="15" stroke="none" />
    <path d="M -80 0 Q 0 -90 80 0 Q 0 90 -80 0 Z" mask="url(#eye-circle)" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $light-blue;
    stroke: $light-blue;

    &:hover,
    &:active,
    &:focus {
      fill: $cyan;
      stroke: $cyan;
      @include scale;
    }
  }
</style>
