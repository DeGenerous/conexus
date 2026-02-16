<script lang="ts">
  import {
    SetCache,
    POTENTIALS_KEY,
    SELECTED_POTENTIAL_KEY,
    TTL_HOUR,
  } from '@constants/cache';

  import Ranks from '@components/console/omnihub/Ranks.svelte';

  let {
    potentials,
    potentialsPower,
    userRank,
  }: {
    potentials: NFT[];
    potentialsPower: number;
    userRank: Nullable<string>;
  } = $props();

  let sorting = $state<'id' | 'level'>('level');

  let sortedPotentials = $derived<NFT[]>(
    [...potentials].sort((a: NFT, b: NFT) => {
      if (sorting === 'id') {
        return Number(a.token_id) - Number(b.token_id);
      }

      return Number(b.level) - Number(a.level);
    }),
  );
</script>

<p>
  A singular platform to manage your journey. From staking tokens to tracking
  incoming rewards and customizing your character sheet, OmniHub brings all your
  essential tools into one seamless, story-driven interface. Power, progress,
  and personalization — all in one place.
</p>

<div class="collection-header console-collection-header">
  <div class="flex-row gap-8">
    <h4>Potentials:</h4>
    <span class="flex pad-8">{potentials.length}</span>
  </div>

  <div class="flex-row gap-8">
    <h4>
      <strong class="pc-only">Total&nbsp;</strong>Power:
    </h4>
    <span class="flex pad-8">{potentialsPower}</span>
  </div>

  {#if potentials.length > 4}
    <span class="flex-row">
      <select bind:value={sorting}>
        <option value="id"> Sort by ID </option>
        <option value="level"> Sort by Level </option>
      </select>
    </span>
  {/if}
</div>

<div class="tiles-collection console-collection">
  {#if sortedPotentials.length}
    {#each sortedPotentials as nft}
      <a
        class="tile potential-tile"
        href="/console/potential"
        onclick={() => {
          SetCache(POTENTIALS_KEY, potentials, TTL_HOUR);
          SetCache(SELECTED_POTENTIAL_KEY, nft, TTL_HOUR);
        }}
      >
        <img src={nft.image} alt={nft.name} />
        <h5>{nft.name}</h5>
      </a>
    {/each}
  {:else}
    {#each Array(5) as _}
      <div class="loading-tile potential-tile">
        <div class="loading-animation"></div>
        <span class="loading-animation"></span>
      </div>
    {/each}
  {/if}
</div>

<Ranks {userRank} />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .collection-header {
    width: 100vw;
    margin-inline: -1.5rem;
    border-radius: 0;
    flex-flow: row wrap;
    justify-content: space-between;
    margin-bottom: -1.5rem;
    animation: none;
    background-color: $royal-purple;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    border: none;

    @include respond-up(small-desktop) {
      width: calc(100% + 3rem);
      margin-inline: 0;
    }

    div {
      h4 {
        @include orange(1, text);
      }

      span {
        height: 2.5rem;
        min-width: 2.5rem;
        border-radius: 1rem;
        @include orange(1, text);
        @include dark-red(0.75);
        @include box-shadow(soft, inset);
        @include font(h4);
      }
    }

    & > span {
      width: 100%;

      select {
        @include orange-border;
        @include orange(1, text);
        @include dark-red(0.75);
        @include box-shadow(soft, inset);
      }
    }

    @include respond-up(tablet) {
      & > span {
        width: auto;
      }

      div {
        h4 {
          strong {
            display: inline;
          }
        }
      }
    }
  }
</style>
