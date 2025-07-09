<script lang="ts">
  import {
    potentials,
    potentialsPower,
    selectedPotential,
  } from '@stores/omnihub.svelte';
</script>

<span class="collection-wrapper flex">
  <div class="collection-header">
    <h2>Potentials: {$potentials.length} | Total Power: {$potentialsPower}</h2>
  </div>

  <div class="tiles-collection">
    {#if $potentials.length}
      {#each $potentials as { image, name }}
        <span class="nft gray-tile" role="button" tabindex="0">
          <img src={image} alt={name} />
          <h5>{name}</h5>
        </span>
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
