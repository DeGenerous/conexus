<script lang="ts">
  import {
    SetCache,
    SELECTED_POTENTIAL_KEY,
    SELECTED_POTENTIAL_TTL,
  } from '@constants/cache';
  import { potentials, potentialsPower } from '@stores/omnihub.svelte';
</script>

<span class="collection-wrapper flex">
  <div class="collection-header">
    <h2>Potentials: {$potentials.length} | Total Power: {$potentialsPower}</h2>
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

  .nft {
    img {
      @include dark-border;
    }
  }
</style>
