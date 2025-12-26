<script lang="ts">
  import { prevItem, nextItem } from '@stores/navigation.svelte';

  const navigateTo = (item: Nullable<NavItem>) => {
    if (!item) return;
    if (item.link) {
      window.location.href = item.link;
    } else if (item.action) {
      item.action();
    }
  };
</script>

<div class="flex-row">
  {#if $prevItem}
    <button
      class="flex-row fade-in"
      class:inactive={!$prevItem}
      onclick={() => navigateTo($prevItem)}
      disabled={!$prevItem}
      draggable="false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        fill="white"
      >
        <polygon
          points="-75 0 -10 -65 -10 65"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect x="-30" y="-25" width="100" height="50" rx="5" />
      </svg>
      <p>
        Prev<span>: {$prevItem?.name}</span>
      </p>
    </button>
  {/if}

  {#if !$prevItem && $nextItem}
    <button style:visibility="hidden">Placeholder</button>
  {/if}

  {#if $nextItem}
    <button
      class="flex-row fade-in"
      class:inactive={!$nextItem}
      onclick={() => navigateTo($nextItem)}
      disabled={!$nextItem}
      draggable="false"
    >
      <p>
        Next<span>: {$nextItem?.name}</span>
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        fill="white"
        style:transform="rotate(180deg)"
      >
        <polygon
          points="-75 0 -10 -65 -10 65"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect x="-30" y="-25" width="100" height="50" rx="5" />
      </svg>
    </button>
  {/if}

  {#if $prevItem && !$nextItem}
    <button style:visibility="hidden">Placeholder</button>
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    width: 95%;
    max-width: 80rem;
    justify-content: space-between;

    button {
      fill: currentColor;
      justify-content: space-between;

      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        span {
          display: none;
        }
      }
    }

    @include respond-up(tablet) {
      align-items: flex-start;

      button {
        max-width: 20rem;

        p span {
          display: inline;
        }
      }
    }
  }
</style>
