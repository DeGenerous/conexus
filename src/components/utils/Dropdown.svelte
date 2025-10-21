<script lang="ts">
  import { type Snippet } from 'svelte';

  import SelectorSVG from '@components/icons/Selector.svelte';

  let {
    children,
    name,
    dropdownFunc = null,
    table = false,
  }: {
    children: Snippet;
    name: string;
    dropdownFunc?: Nullable<() => void>;
    table?: boolean;
  } = $props();

  let isOpen = $state(false);

  const toggleDropdown = () => {
    // fire optional hook so parents can lazy-load content the moment the drawer opens
    isOpen = !isOpen;
    dropdownFunc?.();
  };
</script>

<section class="dream-container" class:collapsed={!isOpen} class:table>
  <button
    class="void-btn flex-row"
    class:active={isOpen}
    aria-expanded={isOpen}
    onclick={toggleDropdown}
  >
    <h4>{name}</h4>
    <SelectorSVG
      focused={null}
      disabled={false}
      hideForMobiles={false}
      color={isOpen ? 'rgb(51, 226, 230)' : 'white'}
      rotate={isOpen ? '270' : '90'}
    />
  </button>
  {#if isOpen}
    <div class="transition" class:container={!table}>
      {@render children()}
    </div>
  {/if}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-container {
    button {
      width: 100%;
      justify-content: space-between;
      fill: $light-blue;
      stroke: $light-blue;
      color: $light-blue;

      h4 {
        padding-left: 3rem;
        width: 100%;
        color: inherit;
      }

      &:active,
      &:hover,
      &.active {
        fill: $cyan;
        stroke: $cyan;
        color: $cyan;
      }

      &:hover,
      &:focus-visible {
        @include bright;
      }
    }

    div {
      flex-direction: column;
      transition-timing-function: linear;

      // Fallback if no support
      opacity: 1;
      filter: none;

      @starting-style {
        opacity: 0.75;
        filter: brightness(75%);
      }
    }

    &.table {
      div {
        // padding: 0;
        background-color: transparent !important;
        border: none;
        border-radius: 0;
        animation: none !important;
      }
    }
  }
</style>
