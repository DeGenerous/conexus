<script lang="ts">
  import Collection from '@lib/collection';
  import { regexpWeb3Address } from '@constants/regexp';

  import Dropdown from '@components/utils/Dropdown.svelte';

  const collection = new Collection();

  let base = $state<CollectionBase>({
    address: '',
    chain_id: 1, // 1 - Ethereum Mainnet, 8453 - Base Mainnet
    standard: 'erc721', // erc20 for fungible, erc721 for non-fungible
    name: '',
    symbol: '',
    network: 'ethereum-mainnet',
    purchase_link: undefined, // optional
    description: undefined, // optional
    logo_uri: undefined, // optional
    rpc_uri: undefined, // optional
    block_explorer_uri: undefined, // optional
    abi: undefined, // optional
  });

  let erc20 = $state<CollectionERC20>({
    total_supply: undefined,
    decimals: 18,
  });

  let erc721 = $state<CollectionERC721>({
    total_supply: undefined,
    image_uri: undefined,
    token_id_uri: undefined, // optional
    token_id_parser: undefined, // optional
    token_id_type: 'number', // optional
    metadata_uri: undefined, // optional
    metadata_parser: undefined, // optional
  });

  $effect(() => {
    if (base.network === 'ethereum-mainnet') {
      base.chain_id = 1;
    } else if (base.network === 'base-mainnet') {
      base.chain_id = 8453;
    }
  });

  let validation = $derived(
    base.name &&
      regexpWeb3Address.test(base.address) &&
      base.symbol.startsWith('$') &&
      base.symbol.length > 1,
  );

  const createCollection = async () => {
    if (base.standard === 'erc20') {
      await collection.createERC20Collection({ base, erc20 });
    } else if (base.standard === 'erc721') {
      await collection.createERC721Collection({ base, erc721 });
    }
  };
</script>

<Dropdown name="Add New Collection" table={true}>
  <section class="flex">
    <div class="container">
      <div class="collection-name input-container">
        <label for="name">Name</label>
        <input
          class:red-border={!base.name}
          id="name"
          type="text"
          bind:value={base.name}
          placeholder="Enter Collection Name"
        />
      </div>

      <div class="collection-address input-container">
        <label for="address">Contract Address</label>
        <input
          class:red-border={!regexpWeb3Address.test(base.address)}
          id="address"
          type="text"
          bind:value={base.address}
          placeholder="0x0000000000000000000000000000000000000000"
        />
      </div>
    </div>

    <div class="flex-row">
      <h4>Web3 Data</h4>
      <div class="container">
        <div class="collection-symbol input-container">
          <label for="symbol">Symbol</label>
          <input
            class:red-border={!base.symbol.startsWith('$') ||
              base.symbol.length < 2}
            id="symbol"
            type="text"
            bind:value={base.symbol}
            placeholder="E.g. $SYMBOL"
          />
        </div>

        <div class="collection-network input-container">
          <label for="network">Network</label>
          <select id="network" bind:value={base.network}>
            <option value="ethereum-mainnet">Ethereum</option>
            <option value="base-mainnet">Base</option>
          </select>
        </div>

        <div class="collection-chain input-container">
          <label for="chain-id">Chain ID</label>
          <input
            id="chain-id"
            type="number"
            bind:value={base.chain_id}
            placeholder="Chain ID"
            disabled
          />
        </div>
      </div>
    </div>

    <div class="flex-row">
      <h4>Standard</h4>
      <div class="radio container">
        <button
          class="void-btn dream-radio-btn"
          class:active={base.standard === 'erc20'}
          onclick={() => (base.standard = 'erc20')}
        >
          ERC-20 (Fungible Token)
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={base.standard === 'erc721'}
          onclick={() => (base.standard = 'erc721')}
        >
          ERC-721 (NFT)
        </button>
      </div>
    </div>

    <div class="flex-row">
      <h4>Additional Data</h4>
      <div class="container">
        {#if base.standard === 'erc20'}
          <div class="input-container">
            <label for="total-supply">Total Supply</label>
            <input
              id="total-supply"
              type="number"
              bind:value={erc20.total_supply}
              placeholder="E.g. 1000000000"
            />
          </div>
          <div class="input-container">
            <label for="decimals">Decimals</label>
            <input
              id="decimals"
              type="number"
              bind:value={erc20.decimals}
              placeholder="E.g. 18"
            />
          </div>
        {:else if base.standard === 'erc721'}
          <div class="collection-supply input-container">
            <label for="total-supply">Total Supply</label>
            <input
              id="total-supply"
              type="number"
              bind:value={erc721.total_supply}
              placeholder="E.g. 10000"
            />
          </div>
          <div class="collection-image-uri input-container">
            <label for="image-uri">Image URI</label>
            <input
              id="image-uri"
              type="text"
              bind:value={erc721.image_uri}
              placeholder="E.g. https://example.com/image.png"
            />
          </div>
        {/if}
      </div>
    </div>

    <div class="flex-row">
      <h4>Description</h4>
      <textarea
        bind:value={base.description}
        placeholder="Enter a description for the collection..."
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Purchase Link</h4>
      <textarea
        bind:value={base.purchase_link}
        placeholder="Enter a purchase link for the collection..."
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Logo URL</h4>
      <textarea
        bind:value={base.logo_uri}
        placeholder="Enter a logo URL for the collection..."
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>RPC URL</h4>
      <textarea
        bind:value={base.rpc_uri}
        placeholder="Enter an RPC URL for the collection..."
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Block Explorer</h4>
      <textarea
        bind:value={base.block_explorer_uri}
        placeholder="Enter a Block Explorer URL for the collection..."
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>ABI</h4>
      <textarea
        bind:value={base.abi}
        placeholder="Enter an ABI for the collection..."
      ></textarea>
    </div>

    <button onclick={createCollection} disabled={!validation}>
      Create Collection
    </button>
  </section>
</Dropdown>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    .container {
      justify-content: center;
      flex-wrap: wrap;

      &.radio {
        justify-content: space-around;
      }

      @include respond-up(small-desktop) {
        .collection-name,
        .collection-supply {
          width: auto;

          input {
            width: 20rem;
          }
        }

        .collection-symbol,
        .collection-network {
          width: auto;
        }

        .collection-network select {
          width: 17.5rem;
        }

        .collection-chain {
          width: auto;

          input {
            width: 5rem;
          }
        }

        .collection-address,
        .collection-image-uri {
          width: 100%;
          max-width: 40rem;

          input {
            width: 100%;
            max-width: none;
          }
        }
      }

      @include respond-up(large-desktop) {
        flex-wrap: nowrap;
      }
    }
  }
</style>
