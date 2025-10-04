<script lang="ts">
  import { type Snippet } from 'svelte';

  import SelectorSVG from '@components/icons/Selector.svelte';

  let { children, name }: { children: Snippet; name: string } = $props();

  let isOpen = $state(false);

  const toggleDropdown = () => {
    isOpen = !isOpen;
  };
</script>

<section class="dream-container" class:collapsed={!isOpen}>
  <button
    class="void-btn flex-row"
    class:active={isOpen}
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
    <div class="container transition">
      {@render children()}
    </div>
  {/if}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
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
  }
</style>
