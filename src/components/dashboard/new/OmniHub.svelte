<script lang="ts">
  import { onMount } from 'svelte';

  import Curation from '@lib/curation';
  import { showProfile } from '@stores/modal.svelte';

  import NFTSection from '@components/omnihub/NFTs.svelte';

  const curation = new Curation();

  let noWalletDetected = $state<boolean>(false);

  let loading = $state<boolean>(true);

  let potentials = $state<Array<NFTTile>>([]);
  let potentialsPower = $state<number>(0);
  let userRank = $state<Nullable<string>>(null);

  function nftToNFTTile(nfts: NFTs[]): Array<NFTTile> {
    return nfts.map((nft) => ({
      token_id: nft.normalized.token_id,
      name: nft.raw.name,
      image: nft.raw.image,
      level: nft.raw.level,
      attributes: nft.raw.attributes,
    }));
  }

  onMount(async () => {
    const data = await curation.omnihub('00000000-0000-0000-0000-000000000001');

    if (!data) {
      loading = false;
      noWalletDetected = true;
      return;
    }

    potentials = data.nfts ? nftToNFTTile(data.nfts) : [];
    potentialsPower = data.total_level;
    userRank = data.rank ? data.rank : null;

    loading = false;
  });
</script>

<section class="transparent-container flex-row flex-wrap">
  <h5 class="learn-label">Explore Platform Knowledge</h5>
  <a class="button-anchor purple-btn" href="/learn"> Learn & Explore </a>
</section>

{#if loading}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  <section class="omnihub transparent-container flex-row flex-wrap">
    <span class="opaque-container fade-in">
      {#if noWalletDetected}
        <h5>
          Connect a wallet to activate OmniHub and access your assets, identity,
          and tools.
        </h5>
        <button class="button-glowing" onclick={() => ($showProfile = true)}>
          Open Your Profile
        </button>
      {:else}
        <NFTSection {potentials} {potentialsPower} {userRank} />
      {/if}
    </span>
    <img
      class="fade-in"
      src="/omnihub/quarchon.avif"
      alt="Potential - Quarchon"
    />
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .learn-label {
    &::after {
      content: ':';
    }
  }

  section {
    @include auto-width;

    @include respond-up(small-desktop) {
      width: auto;
    }

    &.omnihub {
      padding-bottom: 0;
      background-image: url('/omnihub/anchor-bg.avif');
      background-position: bottom;
      background-size: contain;

      span {
        width: 100%;
      }

      img {
        width: 20rem;
      }

      @include respond-up(small-desktop) {
        span {
          width: auto;
        }
      }

      @include respond-up(large-desktop) {
        margin-inline: 0;
        padding-top: 2rem;

        span {
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>
