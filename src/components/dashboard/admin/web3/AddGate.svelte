<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';

  import Dropdown from '@components/utils/Dropdown.svelte';

  const DEFAULT_COLLECTION_ID = '00000000-0000-0000-0000-000000000001';

  const collection = new Collection();

  let {
    collections,
  }: {
    collections: Partial<CollectionResponse>[];
  } = $props();

  let base = $state<GateBase>({
    name: '',
    collection_id: DEFAULT_COLLECTION_ID,
    gate_kind: 'erc721_token',
  });

  let erc20_token = $state<{ min_amount: string }>({
    min_amount: '1',
  });

  let erc721_token = $state<{ specific_token_ids: string }>({
    specific_token_ids: '',
  });

  let erc721_class = $state<{ token_id_min: string; token_id_max: string }>({
    token_id_min: '',
    token_id_max: '',
  });

  const isPositiveInteger = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return false;
    }

    const parsed = Number(trimmed);
    return Number.isInteger(parsed) && parsed > 0;
  };

  const tokenIdsAreValid = (value: string) => {
    const raw = value.trim();

    if (!raw) {
      return true;
    }

    const tokens = raw
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean);

    if (!tokens.length) {
      return false;
    }

    return tokens.every((token) => isPositiveInteger(token));
  };

  let tokenIdsProvided = $derived(
    Boolean(erc721_token.specific_token_ids.trim().length),
  );

  let classRangeProvided = $derived(
    Boolean(
      erc721_class.token_id_min.trim().length ||
        erc721_class.token_id_max.trim().length,
    ),
  );

  let classRangeReady = $derived(
    erc721_class.token_id_min.trim().length > 0 &&
      erc721_class.token_id_max.trim().length > 0,
  );

  let classRangeValid = $derived.by(() => {
    if (!classRangeReady) {
      return false;
    }

    if (
      !isPositiveInteger(erc721_class.token_id_min) ||
      !isPositiveInteger(erc721_class.token_id_max)
    ) {
      return false;
    }

    return (
      Number(erc721_class.token_id_min) <= Number(erc721_class.token_id_max)
    );
  });

  $effect(() => {
    if (tokenIdsProvided) {
      if (
        erc721_class.token_id_min.trim().length > 0 ||
        erc721_class.token_id_max.trim().length > 0
      ) {
        erc721_class = { token_id_min: '', token_id_max: '' };
      }
    }
  });

  $effect(() => {
    if (classRangeReady && erc721_token.specific_token_ids) {
      erc721_token = { specific_token_ids: '' };
    }
  });

  const validation = $derived.by(() => {
    const nameValid = base.name.trim().length > 0;
    const collectionValid = Boolean(base.collection_id);

    if (!nameValid || !collectionValid) {
      return false;
    }

    if (base.gate_kind === 'erc20_token') {
      return isPositiveInteger(erc20_token.min_amount);
    }

    if (base.gate_kind === 'erc721_token') {
      if (classRangeProvided && !classRangeValid) {
        return false;
      }

      if (classRangeValid) {
        return true;
      }

      return tokenIdsAreValid(erc721_token.specific_token_ids);
    }

    return false;
  });

  const parseTokenIds = (value: string): number[] => {
    return value
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean)
      .map((token) => Number(token))
      .filter((token) => Number.isInteger(token) && token > 0);
  };

  const resetGateData = () => {
    base = {
      ...base,
      name: '',
      gate_kind: 'erc721_token',
    };
    erc20_token = { min_amount: '1' };
    erc721_token = { specific_token_ids: '' };
    erc721_class = { token_id_min: '', token_id_max: '' };
  };

  const createGate = async () => {
    if (!validation) {
      return;
    }

    const payloadBase = {
      name: base.name.trim(),
      collection_id: base.collection_id,
      gate_kind: base.gate_kind,
    } as GateBase;

    if (base.gate_kind === 'erc20_token') {
      await collection.createERC20TokenGate({
        ...payloadBase,
        min_amount: Number(erc20_token.min_amount),
        gate_kind: 'erc20_token',
      });
    } else {
      if (classRangeValid) {
        await collection.createERC721ClassGate({
          ...payloadBase,
          gate_kind: 'erc721_class',
          token_id_min: Number(erc721_class.token_id_min),
          token_id_max: Number(erc721_class.token_id_max),
        });
      } else {
        const tokens = parseTokenIds(erc721_token.specific_token_ids);

        await collection.createERC721NFTGate({
          ...payloadBase,
          gate_kind: 'erc721_token',
          specific_token_ids: tokens.length > 0 ? tokens : undefined,
        });
      }
    }

    resetGateData();
  };
</script>

<Dropdown name="Add New Gate" table={true}>
  <section class="flex">
    <div class="container">
      <div class="gate-name input-container">
        <label for="gate-name">Gate Name</label>
        <input
          id="gate-name"
          type="text"
          bind:value={base.name}
          class:red-border={!base.name.trim()}
          placeholder="Enter Gate Name"
        />
      </div>

      <div class="gate-collection input-container">
        <label for="collection-id">Collection</label>
        <select id="collection-id" bind:value={base.collection_id}>
          {#if !collections.length}
            <option value={DEFAULT_COLLECTION_ID}>Default Collection</option>
          {/if}
          {#each collections as item (item.id)}
            <option value={item.id}>
              {item.name ?? 'Unnamed Collection'} ({item.id})
            </option>
          {/each}
        </select>
      </div>
    </div>

    <div class="flex-row">
      <h4>Gate Kind</h4>
      <div class="radio container">
        <button
          class="void-btn dream-radio-btn"
          class:active={base.gate_kind === 'erc20_token'}
          onclick={() => (base.gate_kind = 'erc20_token')}
        >
          ERC-20 Token
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={base.gate_kind === 'erc721_token'}
          onclick={() => (base.gate_kind = 'erc721_token')}
        >
          ERC-721
        </button>
      </div>
    </div>

    <div class="flex-row">
      <h4>Configuration</h4>
      <div class="container">
        {#if base.gate_kind === 'erc20_token'}
          <div class="input-container">
            <label for="erc20-min-amount">Minimum Amount</label>
            <input
              id="erc20-min-amount"
              type="number"
              min="1"
              step="1"
              bind:value={erc20_token.min_amount}
              class:red-border={!isPositiveInteger(erc20_token.min_amount)}
              placeholder="E.g. 100"
            />
          </div>
        {:else}
          <div class="input-container">
            <label for="erc721-token-ids">Allowed Token IDs</label>
            <textarea
              id="erc721-token-ids"
              bind:value={erc721_token.specific_token_ids}
              class:red-border={!tokenIdsAreValid(erc721_token.specific_token_ids)}
              disabled={classRangeReady}
              placeholder="Comma-separated list, e.g. 1, 5, 6, 10"
            ></textarea>
            <p class="helper-text">
              Leave blank to allow any token ID. Filling values disables range inputs.
            </p>
          </div>
          <div class="range-container">
            <div class="input-container">
              <label for="token-id-min">Token ID Min</label>
              <input
                id="token-id-min"
                type="number"
                min="1"
                step="1"
                bind:value={erc721_class.token_id_min}
                class:red-border={
                  !tokenIdsProvided &&
                  erc721_class.token_id_min.trim().length > 0 &&
                  !isPositiveInteger(erc721_class.token_id_min)
                }
                disabled={tokenIdsProvided}
                placeholder="E.g. 1"
              />
            </div>
            <div class="input-container">
              <label for="token-id-max">Token ID Max</label>
              <input
                id="token-id-max"
                type="number"
                min="1"
                step="1"
                bind:value={erc721_class.token_id_max}
                class:red-border={
                  !tokenIdsProvided &&
                  erc721_class.token_id_max.trim().length > 0 &&
                  (!isPositiveInteger(erc721_class.token_id_max) ||
                    (classRangeReady &&
                      Number(erc721_class.token_id_min) >
                        Number(erc721_class.token_id_max)))
                }
                disabled={tokenIdsProvided}
                placeholder="E.g. 10000"
              />
            </div>
            <p class="helper-text">
              Provide both values to gate by range. Doing so disables token ID input.
            </p>
          </div>
        {/if}
      </div>
    </div>

    <button class="orange-btn" onclick={createGate} disabled={!validation}>
      Create Gate
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
        .gate-name {
          width: auto;

          input {
            width: 20rem;
          }
        }

        .gate-collection {
          width: auto;
        }
      }

      @include respond-up(large-desktop) {
        flex-wrap: nowrap;
      }
    }

    .range-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @include respond-up(tablet) {
        flex-direction: row;
        align-items: flex-start;
      }
    }

    .helper-text {
      font-size: 0.75rem;
      margin-top: 0.5rem;
      opacity: 0.75;
      max-width: 25rem;
    }
  }
</style>
