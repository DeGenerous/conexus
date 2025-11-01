<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import EditSVG from '@components/icons/Edit.svelte';

  const collection = new Collection();

  let collections = $state<Partial<CollectionResponse>[]>([]);

  type InputEntry = {
    value: string;
    editing: boolean;
  };

  type InputField = keyof Pick<
    UpdateCollectionRequest,
    'name' | 'description' | 'logo_uri' | 'purchase_link'
  >;

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
    console.log('collections', fetchedCollections);

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

  const changeInput = async (field: InputField, id: string) => {
    const fieldState = inputs[field];
    const entry = fieldState[id];

    if (!entry) {
      return;
    }

    const payload = { [field]: entry.value } as UpdateCollectionRequest;

    try {
      await collection.updateCollection(id, payload);

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
</script>

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
                View Collection: {collection.name}
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
              onclick={() => changeInput('name', collection.id!)}
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
              onclick={() => changeInput('description', collection.id!)}
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
              onclick={() => changeInput('logo_uri', collection.id!)}
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
              onclick={() => changeInput('purchase_link', collection.id!)}
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
  </section>
{/each}

<p>
  TODO: listCollections createERC20Collection createERC721Collection
  updateCollection deleteCollection
</p>

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
      p {
        max-width: 50vw;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
