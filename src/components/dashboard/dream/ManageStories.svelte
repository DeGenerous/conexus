<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { AdminApp } from '@lib/admin';
  import { CoNexusApp } from '@lib/view';
  import { checkUserState } from '@utils/route-guard';
  import { SetCache, ALL_TOPICS_KEY, ALL_TOPICS_TTL } from '@constants/cache';

  import Categories from '@components/dashboard/dream/manage/Categories.svelte';
  import NFTGates from '@components/dashboard/dream/manage/NFTGates.svelte';

  let admin = new AdminApp();
  let view = new CoNexusApp();

  let nav: 'collection' | 'categories' | 'nft-gates' = 'collection';

  let sections: Section[];
  let collections: Collection[] = [];
  let classGates: ClassGate[] = [];

  let availabilityKey: string = '';

  const fetchClasses = async () => {
    classGates = await view.fetchClassGates();
  };

  onMount(async () => {
    await checkUserState('/dashboard/dream/manage', true);
  });

  onMount(async () => {
    await view.getSections().then((data) => (sections = data));
    collections = await admin.fetchCollections();
    await fetchClasses();
  });

  const selectInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.select();
  };

  const storeAllTopics = (collections: Collection[]) => {
    const allTopics = collections.map((collection) => collection.topics).flat();
    const topicNames = allTopics.map(({ topic_name }) => topic_name);
    SetCache(ALL_TOPICS_KEY, topicNames.join(']['), ALL_TOPICS_TTL);
  };

  const switchAvailable = (available: string) => {
    if (available === 'available') return 'unavailable';
    else return 'available';
  };

  let debounceTimeout: NodeJS.Timeout;

  const handleChangeOrder = (event: Event, topic_id: number) => {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;
    if (Number(input.value) < 0) input.value = '0';
    if (Number(input.value) > 99) input.value = '99';
    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';
      await admin.editTopicOrder(topic_id, Number(input.value));
    }, 1000);
  };

  const handleChangeCategoryOrder = (event: Event, category_id: number) => {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;
    if (Number(input.value) < 0) input.value = '0';
    if (Number(input.value) > 99) input.value = '99';
    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';
      await admin.changeSectionCategoryOrder(category_id, Number(input.value));
    }, 1000);
  };

  const sortTopicsByOrder = (topics: CollectionTopic[]) => {
    const sortedTopics = topics.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
    return sortedTopics;
  };
</script>

<nav class="flex-row">
  <button
    class="void-btn blur"
    class:selected={nav === 'collection'}
    on:click={() => (nav = 'collection')}
  >
    Collections
  </button>
  <button
    class="void-btn blur"
    class:selected={nav === 'categories'}
    on:click={() => (nav = 'categories')}
  >
    Categories
  </button>
  <button
    class="void-btn blur"
    class:selected={nav === 'nft-gates'}
    on:click={() => (nav = 'nft-gates')}
  >
    NFT Gates
  </button>
</nav>

{#if nav === 'collection'}
  {#key availabilityKey}
    {#await admin.fetchCollections()}
      <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
    {:then collections}
      {storeAllTopics(collections)}
      {#each collections as { category_id, category_name, category_order, section_id, topics }}
        <div class="collection-header fade-in">
          <h2>{category_name}: {topics.length}</h2>

          <span class="controls container flex-row">
            <div class="input-container">
              <label for="category-order-{category_id}">Order</label>
              <input
                id="category-order-{category_id}"
                type="number"
                value={category_order}
                on:click|preventDefault={selectInput}
                on:input={(event) =>
                  handleChangeCategoryOrder(event, category_id)}
              />
            </div>

            <div class="input-container">
              <label for="section">Section</label>
              {#if sections}
                <select
                  id="section"
                  value={section_id}
                  on:change={(event) => {
                    const target = event.target as HTMLSelectElement;
                    if (target) {
                      admin.changeCategorySection(
                        parseInt(target.value),
                        category_id,
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

        <div class="tiles-collection fade-in">
          {#each sortTopicsByOrder(topics) as { topic_name, order, available, topic_id }}
            <a class="tile" href="/dashboard/dream/manage/{topic_name}">
              <h4>{topic_name}</h4>
              <div class="input-container">
                <label for="story-order-{topic_id}">Order</label>
                <input
                  id="story-order-{topic_id}"
                  type="number"
                  value={order}
                  on:click|preventDefault={selectInput}
                  on:input={(event) => handleChangeOrder(event, topic_id)}
                />
              </div>
              <button
                use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
                class:green-btn={available === 'available'}
                class:red-btn={available === 'unavailable'}
                on:click|preventDefault={() =>
                  admin
                    .changeAvailability(topic_id, switchAvailable(available))
                    .then(() => (availabilityKey = available + topic_name))}
              >
                {available}
              </button>
            </a>
          {/each}
        </div>
      {/each}
    {/await}
  {/key}
{:else if nav === 'nft-gates'}
  <NFTGates {classGates} {fetchClasses} {selectInput} />
{:else if nav === 'categories'}
  <Categories />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  nav {
    position: sticky;
    top: 4rem;
    z-index: 125;
    width: 100vw;
    justify-content: space-around;
    gap: 0;
    @include blue(0.75);
    @include box-shadow;

    button {
      width: 100%;
      padding: 0.5rem;
      @include white-txt(soft);
      @include font(h5);

      &:hover,
      &:active {
        @include bright;
        @include light-blue(0.5);
      }

      &.selected {
        @include cyan(1, text);
        @include light-blue(0.5);
      }
    }

    @include respond-up(small-desktop) {
      top: 0;
      width: clamp(20rem, calc(100% - 12rem), 85rem);
      border-radius: 1rem;

      button {
        &:first-of-type {
          border-top-left-radius: 1rem;
          border-bottom-left-radius: 1rem;
        }

        &:last-of-type {
          border-top-right-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }
      }
    }
  }

  .input-container {
    @include respond-up(tablet) {
      flex-direction: row;

      label {
        position: static;
      }
    }
  }

  input[type='number'] {
    width: 5rem;
    @include dark-blue(0.75);
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

  .tiles-collection {
    min-height: unset;

    .tile {
      padding-block: 1rem;
      gap: 1rem;
      justify-content: flex-end;

      h4 {
        height: 100%;
      }
    }
  }
</style>
