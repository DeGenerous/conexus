<script lang="ts">
  import { onMount } from 'svelte';

  import Curation from '@lib/curation';
  import { NAV_ROUTES } from '@constants/routes';
  import { normalizeMeta } from '@utils/potentials';
  import { POTENTIALS_COLLECTION_ID } from '@constants/curation';
  import { usePullRefreshContext } from '@utils/pull-refresh';

  import NFTSection from '@components/dashboard/omnihub/NFTs.svelte';

  const curation = new Curation();

  let noWalletDetected = $state<boolean>(false);

  let loading = $state<boolean>(true);

  let potentials = $state<Array<NFT>>([]);
  let potentialsPower = $state<number>(0);
  let userRank = $state<Nullable<string>>(null);
  let detachPullRefresh: Nullable<() => void> = null;
  const pullRefresh = usePullRefreshContext();

  function nftTileToNFT(nfts: NFTTile[]): Array<NFT> {
    return nfts.map((nft) => ({
      token_id: nft.normalized.token_id,
      name: nft.raw.name,
      image: nft.raw.image,
      level: nft.normalized.extra ? Number(nft.normalized.extra.level) : 0,
      attributes: nft.raw.attributes,
    }));
  }

  // allow users to manually bust the cached omnihub payload
  const installPullToRefresh = () => {
    detachPullRefresh?.();
    detachPullRefresh =
      pullRefresh?.register(async () => {
        await loadOmniHub(true);
      }) ?? null;
  };

  // central fetcher so both initial mount and pull-to-refresh share logic
  async function loadOmniHub(refresh = false) {
    if (!refresh) loading = true;
    noWalletDetected = false;

    const resetData = () => {
      potentials = [];
      potentialsPower = 0;
      userRank = null;
      loading = false;
    };

    let data: Nullable<OmnihubData> = null;

    try {
      data = await curation.omnihub(POTENTIALS_COLLECTION_ID, refresh);
    } catch (error) {
      resetData();
      return;
    }

    if (!data) {
      resetData();
      return;
    }

    if ('nft' in data && data.nft) {
      const potentialsMeta = normalizeMeta(data);

      potentials = data.nft.nfts ? nftTileToNFT(data.nft.nfts) : [];

      if (potentialsMeta) {
        potentialsPower = potentialsMeta.total_level
          ? potentialsMeta.total_level
          : 0;
        userRank = potentialsMeta.rank ? potentialsMeta.rank : null;
      } else {
        potentialsPower = 0;
        userRank = null;
      }
    } else {
      potentials = [];
      potentialsPower = 0;
      userRank = null;
    }

    loading = false;
  }

  onMount(() => {
    let cancelled = false;

    (async () => {
      await loadOmniHub();
      if (!cancelled) installPullToRefresh();
    })();

    return () => {
      cancelled = true;
      detachPullRefresh?.();
      detachPullRefresh = null;
    };
  });
</script>

{#if loading}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else if potentials.length}
  <NFTSection {potentials} {potentialsPower} {userRank} />
{:else}
  <section class="container flex-row flex-wrap">
    <div class="container fade-in">
      {#if noWalletDetected}
        <h5>
          Connect a wallet to activate OmniHub and access your assets, identity,
          and tools
        </h5>
        <button onclick={() => open('/dashboard/account', '_self')}>
          Open Your Profile
        </button>
      {:else}
        <h5 class="validation">
          No Potentials Detected Across Connected Wallets
        </h5>

        <hr />

        <p>
          If your Potential lies elsewhere, link the right access point through
          your profile
        </p>
        <button onclick={() => open('/dashboard/account', '_self')}>
          Connect Another Wallet
        </button>

        <hr />

        <p>
          Or explore the Marketplace to discover a Potential that resonates with
          your journey
        </p>
        <span class="flex-row flex-wrap">
          <a class="button-anchor" href={NAV_ROUTES.MAGIC_EDEN} target="_blank">
            <img src="/icons/magiceden.png" alt="Magic Eden marketplace" />
            Magic Eden
          </a>
          <a class="button-anchor" href={NAV_ROUTES.OPENSEA} target="_blank">
            <img src="/icons/opensea.png" alt="OpenSea marketplace" />
            OpenSea
          </a>
        </span>
      {/if}
    </div>
    <img
      class="fade-in"
      src="/omnihub/quarchon.avif"
      alt="Potential - Quarchon"
    />
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section.container {
    width: 100%;
    padding-bottom: 0;
    background-image: url('/omnihub/anchor-bg.avif');
    background-position: bottom;
    background-size: contain;

    > img {
      width: min(20rem, 100%);
    }

    > div {
      width: 100%;
      background-color: $transparent-black;
      animation: none;

      p {
        @include white-txt;
      }
    }

    @include respond-up(full-hd) {
      flex-flow: row nowrap;
      padding-bottom: 1.5rem;

      > img {
        margin-block: auto -1.5rem;
      }
    }
  }
</style>
