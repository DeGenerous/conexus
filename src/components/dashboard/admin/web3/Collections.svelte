<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';

  import Gates from '@components/dashboard/admin/web3/Gates.svelte';
  import AddCollection from '@components/dashboard/admin/web3/AddCollection.svelte';
  import AddGate from '@components/dashboard/admin/web3/AddGate.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import EditSVG from '@components/icons/Edit.svelte';

  const collection = new Collection();

  let collections = $state<Partial<CollectionResponse>[]>([]);

  type InputEntry = {
    value: string;
    editing: boolean;
  };

  type InputField = 'name' | 'description' | 'logo_uri' | 'purchase_link';

  type InputMap = Record<string, InputEntry>;

  type InputsState = Record<InputField, InputMap>;

  let inputs = $state<InputsState>({
    name: {},
    description: {},
    logo_uri: {},
    purchase_link: {},
  });

  onMount(async () => {
    const fetchedCollections = await collection.listCollections();

    const nextInputs: InputsState = {
      name: {},
      description: {},
      logo_uri: {},
      purchase_link: {},
    };

    fetchedCollections.forEach((col) => {
      const id = col.id!;

      nextInputs.name[id] = {
        value: col.name ?? '',
        editing: false,
      };
      nextInputs.description[id] = {
        value: col.description ?? '',
        editing: false,
      };
      nextInputs.logo_uri[id] = {
        value: col.logo_uri ?? '',
        editing: false,
      };
      nextInputs.purchase_link[id] = {
        value: col.purchase_link ?? '',
        editing: false,
      };
    });

    inputs = nextInputs;
    collections = fetchedCollections;
  });

  const getCollectionValue = (id: string, field: InputField) => {
    const col = collections.find((item) => item.id === id);

    if (!col) {
      return '';
    }

    const record = col as Record<string, unknown>;
    const value = record[field];

    return typeof value === 'string' ? value : '';
  };

  const resetInput = (field: InputField, id: string) => {
    const fieldState = inputs[field];

    if (!fieldState[id]) {
      return;
    }

    const nextFieldState: InputMap = {
      ...fieldState,
      [id]: {
        value: getCollectionValue(id, field),
        editing: false,
      },
    };

    inputs = {
      ...inputs,
      [field]: nextFieldState,
    };
  };

  const toOptionalString = (value: unknown): string | undefined => {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number') {
      return value.toString();
    }

    return undefined;
  };

  const buildBasePayload = (
    collection: Partial<CollectionResponse>,
    standard: AvailableStandards,
  ): CollectionBase | null => {
    const { address, chain_id, symbol } = collection;
    const name = collection.name;

    if (
      !address ||
      typeof chain_id !== 'number' ||
      typeof name !== 'string' ||
      typeof symbol !== 'string'
    ) {
      console.error('Missing base collection data for update', {
        id: collection.id,
        standard,
      });
      return null;
    }

    return {
      address,
      chain_id,
      standard,
      name,
      purchase_link: toOptionalString(collection.purchase_link),
      symbol,
      description: toOptionalString(collection.description),
      logo_uri: toOptionalString(collection.logo_uri),
      rpc_uri: toOptionalString(collection.rpc_uri),
      block_explorer_uri: toOptionalString(collection.block_explorer_uri),
      network: collection.network,
      abi: toOptionalString(collection.abi),
    };
  };

  // Compose the backend's create-style payload before sending updates.
  const buildPayload = (
    collection: Partial<CollectionResponse>,
    standard: AvailableStandards,
  ): CreateERC20CollectionRequest | CreateERC721CollectionRequest | null => {
    const base = buildBasePayload(collection, standard);

    if (!base) {
      return null;
    }

    if (standard === 'erc20') {
      const erc20Details = collection as Partial<CollectionERC20>;

      if (typeof erc20Details.decimals !== 'number') {
        console.error('Missing ERC20 decimals for update', {
          id: collection.id,
        });
        return null;
      }

      return {
        base,
        erc20: {
          decimals: erc20Details.decimals,
          total_supply: toOptionalString(erc20Details.total_supply),
        },
      };
    }

    const erc721Details = collection as Partial<CollectionERC721>;

    return {
      base,
      erc721: {
        token_id_uri:
          typeof erc721Details.token_id_uri === 'string'
            ? erc721Details.token_id_uri
            : undefined,
        token_id_parser:
          typeof erc721Details.token_id_parser === 'string'
            ? erc721Details.token_id_parser
            : undefined,
        metadata_uri:
          typeof erc721Details.metadata_uri === 'string'
            ? erc721Details.metadata_uri
            : undefined,
        metadata_parser:
          typeof erc721Details.metadata_parser === 'string'
            ? erc721Details.metadata_parser
            : undefined,
        image_uri:
          typeof erc721Details.image_uri === 'string'
            ? erc721Details.image_uri
            : undefined,
        token_id_type:
          erc721Details.token_id_type === 'number' ||
          erc721Details.token_id_type === 'string'
            ? erc721Details.token_id_type
            : undefined,
        total_supply: toOptionalString(erc721Details.total_supply),
      },
    };
  };

  const changeInput = async (
    field: InputField,
    id: string,
    standard: AvailableStandards,
  ) => {
    const fieldState = inputs[field];
    const entry = fieldState[id];

    if (!entry) {
      return;
    }

    const targetCollection = collections.find((col) => col.id === id);

    if (!targetCollection) {
      return;
    }

    const updatedCollection = {
      ...targetCollection,
      [field]: entry.value,
    };

    const payload = buildPayload(updatedCollection, standard);

    if (!payload) {
      return;
    }

    try {
      if (standard === 'erc721') {
        await collection.updateERC721Collection(
          id,
          payload as CreateERC721CollectionRequest,
        );
      } else if (standard === 'erc20') {
        await collection.updateERC20Collection(
          id,
          payload as CreateERC20CollectionRequest,
        );
      }

      collections = collections.map((col) =>
        col.id === id
          ? ({
              ...col,
              [field]: entry.value,
            } as Partial<CollectionResponse>)
          : col,
      );

      inputs = {
        ...inputs,
        [field]: {
          ...fieldState,
          [id]: {
            ...entry,
            editing: false,
          },
        },
      };
    } catch (error) {
      resetInput(field, id);
    }
  };

  const deleteCollection = async (id: string) => {
    openModal(
      ensureMessage('delete this collection permanently'),
      'Delete',
      async () => {
        try {
          await collection.deleteCollection(id);
          collections = collections.filter((col) => col.id !== id);
        } catch (error) {
          console.error('Error deleting collection:', error);
        }
      },
    );
  };
</script>

<AddCollection />

<AddGate {collections} />

{#each collections as collection (collection.id)}
  <section class="dream-container fade-in">
    <div class="flex-row">
      {#if inputs.name[collection.id!]}
        <div class="container">
          <span class="flex-row flex-wrap gap">
            <span class="flex-row">
              <img src={collection.logo_uri} alt={collection.name} />
              <a
                href={collection.purchase_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Collection<strong>: {collection.name}</strong>
              </a>
            </span>

            <span class="flex-row">
              <p>ID: {collection.id}</p>
              <p>({collection.standard})</p>
            </span>
          </span>

          <hr />

          {#if inputs.name[collection.id!].editing}
            <CloseSVG onclick={() => resetInput('name', collection.id!)} />
          {/if}
          <input
            bind:value={inputs.name[collection.id!].value}
            type="text"
            placeholder="Enter collection name"
            size={inputs.name[collection.id!].value.length + 1}
            maxlength="50"
            disabled={!inputs.name[collection.id!].editing}
          />
          {#if inputs.name[collection.id!].editing}
            <SaveSVG
              onclick={() =>
                changeInput('name', collection.id!, collection.standard!)}
              disabled={collection.name === inputs.name[collection.id!].value}
            />
          {:else}
            <EditSVG bind:editing={inputs.name[collection.id!].editing} />
          {/if}
        </div>
      {/if}
    </div>

    <div class="flex-row">
      <span class="edit-wrapper flex">
        <h4>Description</h4>
        <span class="flex-row">
          {#if inputs.description[collection.id!].editing}
            <CloseSVG
              onclick={() => resetInput('description', collection.id!)}
            />
            <SaveSVG
              onclick={() =>
                changeInput(
                  'description',
                  collection.id!,
                  collection.standard!,
                )}
              disabled={collection.description ===
                inputs.description[collection.id!].value}
            />
          {:else}
            <EditSVG
              bind:editing={inputs.description[collection.id!].editing}
            />
          {/if}
        </span>
      </span>
      <textarea
        bind:value={inputs.description[collection.id!].value}
        rows="3"
        placeholder="Enter collection description"
        disabled={!inputs.description[collection.id!].editing}
      ></textarea>
    </div>

    <div class="flex-row">
      <span class="edit-wrapper flex">
        <h4>Logo URL</h4>
        <span class="flex-row">
          {#if inputs.logo_uri[collection.id!].editing}
            <CloseSVG onclick={() => resetInput('logo_uri', collection.id!)} />
            <SaveSVG
              onclick={() =>
                changeInput('logo_uri', collection.id!, collection.standard!)}
              disabled={collection.logo_uri ===
                inputs.logo_uri[collection.id!].value}
            />
          {:else}
            <EditSVG bind:editing={inputs.logo_uri[collection.id!].editing} />
          {/if}
        </span>
      </span>
      <textarea
        bind:value={inputs.logo_uri[collection.id!].value}
        placeholder="Enter collection logo URL"
        rows="3"
        disabled={!inputs.logo_uri[collection.id!].editing}
      ></textarea>
    </div>

    <div class="flex-row">
      <span class="edit-wrapper flex">
        <h4>Purchase Link</h4>
        <span class="flex-row">
          {#if inputs.purchase_link[collection.id!].editing}
            <CloseSVG
              onclick={() => resetInput('purchase_link', collection.id!)}
            />
            <SaveSVG
              onclick={() =>
                changeInput(
                  'purchase_link',
                  collection.id!,
                  collection.standard!,
                )}
              disabled={collection.purchase_link ===
                inputs.purchase_link[collection.id!].value}
            />
          {:else}
            <EditSVG
              bind:editing={inputs.purchase_link[collection.id!].editing}
            />
          {/if}
        </span>
      </span>
      <textarea
        bind:value={inputs.purchase_link[collection.id!].value}
        placeholder="Enter collection purchase link"
        rows="3"
        disabled={!inputs.purchase_link[collection.id!].editing}
      ></textarea>
    </div>

    <Gates collection_id={collection.id!} />

    <button class="red-btn" onclick={() => deleteCollection(collection.id!)}>
      Delete Collection
    </button>
  </section>
{/each}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-container {
    .container {
      flex-flow: row wrap;
      justify-content: center;

      > span {
        width: 100%;
        justify-content: space-between;

        span {
          width: 100%;
          justify-content: space-between;

          @include respond-up(large-desktop) {
            width: auto;
          }

          p {
            text-transform: uppercase;
            @include white-txt;
          }

          img {
            width: 2.5rem;
          }
        }
      }
    }

    @include mobile-only {
      a strong {
        display: none;
      }

      p {
        max-width: 50vw;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
