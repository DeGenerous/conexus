<script lang="ts">
  let {
    editing = $bindable(false),
    text = 'Edit',
  }: {
    editing: boolean;
    text?: string;
  } = $props();
  let svgFocus = $state<boolean>(false);
</script>

<button
  class="flex-row"
  onpointerover={() => (svgFocus = true)}
  onpointerout={() => (svgFocus = false)}
  onclick={() => {
    editing = true;
    svgFocus = false;
  }}
  aria-label="Edit"
>
  {text}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    fill="none"
    stroke-width="15"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M -10 -60 L -75 -60 L -75 75 L 60 75 L 60 10" />
    <path
      d="M -30 30 L -25 0 L 45 -70 M -30 30 L 0 25 L 70 -45 C  90 -60 60 -90 45 -70"
      transform={svgFocus ? 'translate(-10 10)' : ''}
    />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: none;
    stroke: $white;

    &:hover:not(&:disabled),
    &:active:not(&:disabled),
    &:focus-visible:not(&:disabled) {
      stroke: $cyan;
      @include scale;
      @include bright;
    }
  }
</style>
