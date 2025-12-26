<script lang="ts">
  let {
    state,
    onclick = () => {},
    disabled = false,
    text = '',
    cta = false,
    voidBtn = false,
  }: {
    state: 'inside' | 'outside';
    onclick: () => void | Promise<void>;
    disabled?: boolean;
    text: string;
    cta?: boolean;
    voidBtn?: boolean;
  } = $props();
</script>

<button
  class:cta
  class:void-btn={voidBtn}
  class:flex-row={voidBtn}
  type="button"
  {onclick}
  {disabled}
>
  {#if state === 'outside'}
    <svg
      class="outside-door"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      fill="none"
      stroke-width="12"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <defs>
        <mask id="door-svg-mask">
          <rect
            x="-25"
            y="-75"
            width="100"
            height="150"
            rx="15"
            fill="none"
            stroke="white"
          />
          <line
            x1="-25"
            y1="-35"
            x2="-25"
            y2="35"
            stroke="black"
            stroke-width="14"
            stroke-linecap="square"
          />
        </mask>
      </defs>

      <path
        d="
          M 30 0
          L -80 0
          L -55 -25
          M -80 0
          L -55 25
        "
        fill="none"
      />
      <rect
        x="-25"
        y="-75"
        width="100"
        height="150"
        rx="15"
        mask="url(#door-svg-mask)"
      />
    </svg>
  {:else if state === 'inside'}
    <svg
      class="inside-door"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="#dedede"
      stroke-width="12"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <defs>
        <mask id="door-svg-mask">
          <rect
            x="-25"
            y="-75"
            width="100"
            height="150"
            rx="15"
            fill="none"
            stroke="white"
          />
          <line
            x1="-25"
            y1="-35"
            x2="-25"
            y2="35"
            stroke="black"
            stroke-width="14"
            stroke-linecap="square"
          />
        </mask>
      </defs>

      <path
        d="
          M -80 0
          L 30 0
          L 5 -25
          M 30 0
          L 5 25
        "
        fill="none"
      />
      <rect
        x="-25"
        y="-75"
        width="100"
        height="150"
        rx="15"
        mask="url(#door-svg-mask)"
      />
    </svg>
  {/if}
  {text}
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    stroke: currentColor;

    &:hover,
    &:active,
    &:focus-visible {
      .outside-door path {
        transform: translateX(-7.5%);
      }

      .inside-door path {
        transform: translateX(10%);
      }
    }

    &.void-btn {
      justify-content: flex-start;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      transition:
        background 0.3s ease,
        color 0.3s ease;
      @include light-blue(1, text);

      svg {
        width: 1rem;
      }

      &:hover,
      &:active,
      &:focus-visible {
        @include red(1, text);
        @include red(0.1);
        @include bright;
      }
    }
  }
</style>
