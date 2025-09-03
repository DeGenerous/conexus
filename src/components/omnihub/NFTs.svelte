<script lang="ts">
  import { onMount } from 'svelte';

  import {
    SetCache,
    SELECTED_POTENTIAL_KEY,
    TTL_SHORT,
  } from '@constants/cache';
  import { showProfile } from '@stores/modal.svelte';

  import { nftTile } from '@stores/omnihub.svelte';

  import Ranks from '@components/omnihub/Ranks.svelte';
  import FilterSVG from '@components/icons/Filter.svelte';

  let {
    potentials,
    potentialsPower,
    userRank,
  }: {
    potentials: nftTile[];
    potentialsPower: number;
    userRank: Nullable<string>;
  } = $props();

  let nftsDetected = $state<boolean>(true);

  let sorting = $state<'id' | 'level'>('level');

  const sortedPotentials = () => {
    return potentials.sort((a: nftTile, b: nftTile) => {
      if (sorting === 'id') {
        return Number(a.id) - Number(b.id);
      } else {
        return Number(b.level) - Number(a.level);
      }
    });
  };
</script>

{#if nftsDetected}
  <span class="collection-wrapper flex">
    <div class="collection-header container">
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
            <option value="id" selected={sorting === 'id'}> Sort by ID </option>
            <option value="level" selected={sorting === 'level'}>
              Sort by Level
            </option>
          </select>
        </span>
      {/if}
    </div>

    <div class="tiles-collection">
      {#if potentials.length}
        {#each potentials as nft}
          <a
            class="potential-tile"
            href="/omnihub/portrait"
            onclick={() => SetCache(SELECTED_POTENTIAL_KEY, nft, TTL_SHORT)}
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
  </span>

  <Ranks {userRank} />
{:else}
  <section class="container">
    <p class="validation">No Potentials Detected Across Connected Wallets</p>

    <hr />

    <p class="text-glowing">
      If your Potential lies elsewhere, link the right access point through your
      profile.
    </p>
    <button class="button-glowing" onclick={() => ($showProfile = true)}>
      Connect Another Wallet
    </button>

    <hr />

    <p class="text-glowing">
      Or explore the Marketplace to discover a Potential that resonates with
      your journey.
    </p>
    <span class="flex-row">
      <a
        class="button-anchor button-glowing"
        href="https://magiceden.io/collections/ethereum/0xfa511d5c4cce10321e6e86793cc083213c36278e"
        target="_blank"
      >
        <img src="/icons/magiceden.png" alt="Magic Eden marketplace" />
        Magic Eden
      </a>
      <a
        class="button-anchor button-glowing"
        href="https://opensea.io/collection/potentials-eth"
        target="_blank"
      >
        <img src="/icons/opensea.png" alt="OpenSea marketplace" />
        OpenSea
      </a>
    </span>
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .collection-header {
    width: 100%;
    margin-inline: 0;
    border-radius: 0;
    flex-flow: row wrap;
    justify-content: space-between;
    margin-bottom: -1rem;
    animation: none;
    background-color: $royal-purple;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;

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
