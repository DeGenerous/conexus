<script lang="ts">
  import {
    SetCache,
    SELECTED_POTENTIAL_KEY,
    SELECTED_POTENTIAL_TTL,
  } from '@constants/cache';
  import { potentials, potentialsPower } from '@stores/omnihub.svelte';
</script>

<span class="collection-wrapper flex">
  <div class="collection-header container">
    <div class="flex-row gap-8 text-glowing">
      <h4>Potentials:</h4>
      <span class="flex pad-8">{$potentials.length}</span>
    </div>
    <div class="flex-row gap-8 text-glowing">
      <h4>
        <strong class="pc-only">Total</strong>Power:
      </h4>
      <span class="flex pad-8">{$potentialsPower}</span>
    </div>
  </div>

  <div class="tiles-collection">
    {#if $potentials.length}
      {#each $potentials as nft}
        <a
          class="nft gray-tile"
          href="/omnihub/portrait"
          onclick={() =>
            SetCache(SELECTED_POTENTIAL_KEY, nft, SELECTED_POTENTIAL_TTL)}
        >
          <img src={nft.image} alt={nft.name} />
          <h5>{nft.name}</h5>
        </a>
      {/each}
    {:else}
      {#each Array(5) as _}
        <div class="loading-tile gray-tile">
          <div class="loading-animation"></div>
          <span class="loading-animation"></span>
        </div>
      {/each}
    {/if}
  </div>
</span>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .collection-header {
    width: 100%;
    margin-inline: 0;
    border-radius: 0;
    justify-content: space-between;
    margin-bottom: -1rem;
    @include box-glow(inset, 0.25);

    div {
      span {
        height: 2.5rem;
        min-width: 2.5rem;
        border-radius: 1rem;
        @include orange(1, text);
        @include orange-border;
        @include dark-red(0.75);
        @include font(h4);
      }
    }

    @include respond-up(tablet) {
      padding: 0;
      animation: none;
      box-shadow: none;
      -webkit-backdrop-filter: none;
      backdrop-filter: none;

      div {
        padding: 1rem 1.5rem;
        animation: dark-glowing 15s linear infinite;
        -webkit-backdrop-filter: blur(1rem);
        backdrop-filter: blur(1rem);
        @include box-glow(inset, 0.25);

        &:first-of-type {
          border-top-right-radius: 1rem;
        }

        &:last-of-type {
          border-top-left-radius: 1rem;
        }

        h4 {
          strong {
            display: inline;
          }
        }
      }
    }
  }

  .tiles-collection {
    .nft {
      img {
        @include dark-border;
      }
    }
  }
</style>
