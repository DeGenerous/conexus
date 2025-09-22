<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';

  import { SetCache, ALL_TOPICS_KEY, TTL_DAY } from '@constants/cache';
  import AdminApp from '@lib/admin';
  import CoNexusApp from '@lib/view';
  import { toastStore } from '@stores/toast.svelte';

  import StoryList from '@components/dashboard/dream-legacy/manage/collection/StoryList.svelte';

  export let selectInput = (event: Event) => {};

  let admin = new AdminApp();
  let view = new CoNexusApp();

  let sections: Section[] = [];
  let collections: Collection[] = [];

  let debounceTimeout: NodeJS.Timeout;

  let items: any[] = [];
  let topicBuckets: Record<number, CollectionTopic[]> = {}; // id → list

  const isCoarsePointer = (): boolean =>
    matchMedia('(pointer: coarse)').matches;

  const fetchCollections = async () => {
    collections = await admin.fetchCollections();
    updateCollections();
    topicBuckets = Object.fromEntries(
      collections.map((c) => [
        c.category_id,
        [...c.topics]
          .sort((a, b) => a.order - b.order)
          .map((t) => ({ ...t, id: t.topic_id })),
      ]),
    );
  };

  // Make a sortable id‑based copy
  const updateCollections = () => {
    items = collections
      .map((c) => ({ ...c, id: c.category_id }))
      .sort(
        (a: Collection, b: Collection) => a.category_order - b.category_order,
      );
    storeAllTopics(items);
  };

  onMount(async () => {
    sections = await view.getSections();
    await fetchCollections();
    updateCollections();
  });

  // Change order of every category based on position in array
  const persistOrder = () => {
    items.forEach(async ({ category_id }, i) => {
      await admin.changeSectionCategoryOrder(category_id, i + 1, false);
      items[i].category_order = i + 1;
    });
    toastStore.show('All categories reordered successfully');
  };

  // Change order of single category
  const handleChangeCategoryOrder = (event: Event, category_id: number) => {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;
    if (Number(input.value) < 0) input.value = '0';
    if (Number(input.value) > 99) input.value = '99';
    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';
      await admin.changeSectionCategoryOrder(category_id, Number(input.value));
      await fetchCollections();
      updateCollections();
    }, 1000);
  };

  // Cahce all topics for switching between
  const storeAllTopics = (collections: Collection[]) => {
    const allTopics = collections
      .map((collection) => collection.topics.sort((a, b) => a.order - b.order))
      .flat();
    const topicNames = allTopics.map(({ topic_name }) => topic_name);
    SetCache(ALL_TOPICS_KEY, topicNames.join(']['), TTL_DAY);
  };
</script>

{#if !items.length}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  <section
    class="flex"
    use:dndzone={{
      items,
      type: 'category',
      dragDisabled: isCoarsePointer(),
    }}
    on:consider={(e) => (items = e.detail.items)}
    on:finalize={(e) => {
      items = e.detail.items;
      persistOrder();
    }}
  >
    {#each items as c (c.id)}
      <span class="collection-wrapper flex">
        <div class="collection-header fade-in">
          <h2>{c.category_name}: {c.topics.length}</h2>

          <span class="controls container flex-row">
            <div class="input-container">
              <label for="category-order-{c.category_id}">Order</label>
              <input
                id="category-order-{c.category_id}"
                type="number"
                value={c.category_order}
                on:click={selectInput}
                on:input={(event) =>
                  handleChangeCategoryOrder(event, c.category_id)}
              />
            </div>

            <div class="input-container">
              <label for="section">Section</label>
              {#if sections}
                <select
                  id="section"
                  value={c.section_id}
                  on:change={(event) => {
                    const target = event.target as HTMLSelectElement;
                    if (target) {
                      admin.changeCategorySection(
                        parseInt(target.value),
                        c.category_id,
                      );
                    }
                  }}
                >
                  {#each sections as { id, name }}
                    <option value={id}>{name}</option>
                  {/each}
                </select>
              {/if}
            </div>
          </span>
        </div>

        <StoryList
          topics={topicBuckets[c.category_id]}
          category_Id={c.category_id}
          {fetchCollections}
          {selectInput}
          {isCoarsePointer}
        />
      </span>
    {/each}
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  input[type='number'] {
    width: 5rem;
    @include dark-blue(0.75);
  }

  .input-container {
    @include respond-up(tablet) {
      flex-direction: row;

      label {
        position: static;
      }
    }
  }

  section {
    outline: none !important;
  }

  .collection-wrapper {
    outline: none !important;
  }

  .collection-header {
    flex-wrap: wrap;
    justify-content: space-between;
    padding-inline: 0;
    margin-block: 1rem -1rem;

    h2 {
      width: 100%;
      text-align: center;
    }

    .controls {
      width: 100%;
      margin-inline: 0;
      border-radius: 0;
      @include box-glow(inset, 0.25);
    }

    @include respond-up(small-desktop) {
      flex-wrap: nowrap;
      align-items: flex-end;
      padding-left: 1.5rem;

      h2 {
        width: auto;
        text-align: left;
      }

      .controls {
        width: auto;
        border-top-left-radius: 1rem;
      }
    }
  }
</style>
