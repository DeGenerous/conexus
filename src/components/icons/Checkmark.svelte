<script lang="ts">
  let {
    onclick = () => {},
    text = 'Save',
    disabled = false,
  }: {
    onclick: (e: Event) => void | Promise<void>;
    text?: string;
    disabled?: boolean;
  } = $props();

  let svgFocus = $state<boolean>(false);
</script>

<button
  class="flex-row green-btn"
  {onclick}
  {disabled}
  onpointerover={() => {
    if (disabled) return;
    svgFocus = true;
  }}
  onpointerout={() => {
    if (disabled) return;
    svgFocus = false;
  }}
>
  {text}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    stroke-width="30"
    transform={svgFocus ? 'scale(1.1)' : ''}
  >
    <defs>
      <mask id="checkmark-svg-mask">
        <circle r="85" stroke="none" fill="white" />
        <path
          d="M -50 0 L -15 30 L 50 -35"
          fill="none"
          stroke="black"
          transform={svgFocus ? 'scale(1.2)' : ''}
        />
      </mask>
    </defs>
    <circle r="85" stroke="none" mask="url(#checkmark-svg-mask)" />
  </svg>
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    fill: $dark-green;
    stroke: $dark-green;
  }
</style>
