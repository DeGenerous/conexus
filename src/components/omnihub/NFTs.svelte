<script lang="ts">
  import { onMount } from 'svelte';

  import {
    SetCache,
    SELECTED_POTENTIAL_KEY,
    SELECTED_POTENTIAL_TTL,
  } from '@constants/cache';
  import getNFTs from '@utils/potentials';
  import { potentials, potentialsPower } from '@stores/omnihub.svelte';
  import { showProfile } from '@stores/modal.svelte';

  import Ranks from '@components/omnihub/Ranks.svelte';

  let nftsDetected = $state<boolean>(true);

  onMount(async () => {
    nftsDetected = await getNFTs();
  });
</script>

{#if nftsDetected}
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
            class="potential-tile"
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
          <div class="loading-tile potential-tile">
            <div class="loading-animation"></div>
            <span class="loading-animation"></span>
          </div>
        {/each}
      {/if}
    </div>
  </span>

  <Ranks />
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
    justify-content: space-between;
    margin-bottom: -1rem;
    animation: none;
    background-color: $royal-purple;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    @include box-glow(inset, 0.25);

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

    @include respond-up(tablet) {
      padding: 0;
      box-shadow: none;
      background-color: transparent;

      div {
        padding: 0.5rem 1.5rem;
        animation: none;
        background-color: $royal-purple;
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
</style>
