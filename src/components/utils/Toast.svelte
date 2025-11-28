<script lang="ts">
  import { cubicOut } from 'svelte/easing';

  let {
    message = '',
    type = 'info',
    onClose = () => {},
  }: {
    message: string;
    type: 'info' | 'error';
    onClose: () => void;
  } = $props();

  function liquidGlass(node: HTMLElement, { duration }: { duration: number }) {
    return {
      duration,
      css: (t: number) => {
        const eased = cubicOut(t);
        return `
          transform: scale(${eased * 0.5 + 0.5}, ${eased}) translateY(${(1 - eased) * -150}px);
          opacity: ${eased};
        `;
      },
    };
  }
</script>

<div class="toast-wrapper" transition:liquidGlass={{ duration: 400 }}>
  <button
    class="void-btn flex-row pad round blur"
    class:info={type === 'info'}
    class:error={type !== 'info'}
    onclick={onClose}
    type="button"
    aria-live={type === 'error' ? 'assertive' : 'polite'}
  >
    <p>{@html message}</p>
  </button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .toast-wrapper {
    will-change: transform, opacity;
    pointer-events: auto;
  }

  button {
    background-color: $dark-blue;
    max-width: 100%;
    width: fit-content;
    margin-inline: auto;
    @include white-txt;
    @include white-txt(1);

    &.info {
      @include green(0.85);
    }

    &.error {
      @include red(0.85);
    }

    &:hover,
    &:active,
    &:focus-visible {
      &.info {
        @include green;
      }

      &.error {
        @include red;
      }
    }
  }
</style>
