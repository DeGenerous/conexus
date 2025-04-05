<script lang="ts">
  import { onMount } from 'svelte';

  import { default_sections } from '@constants/data';
  import { AdminApp } from '@lib/admin';
  import { CoNexusApp } from '@lib/view';
  import { checkUserState } from '@utils/route-guard';

  import Categories from '@components/dashboard/dream/manage/Categories.svelte';
  import NFTGates from '@components/dashboard/dream/manage/NFTGates.svelte';

  let admin = new AdminApp();
  let view = new CoNexusApp();

  let sections: Section[] = default_sections;
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
    localStorage.setItem('all topics', topicNames.join());
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

  type NAV = 'collection' | 'categories' | 'nft-gates';
  let nav: NAV = 'collection';
  const setNav = (newNav: NAV) => {
    nav = newNav;
  };
</script>

<div class="container blur buttons-wrapper">
  <button
    class="nav-button"
    on:click={() => setNav('collection')}
    class:selected={nav === 'collection'}
  >
    Collection
  </button>
  <button
    class="nav-button"
    on:click={() => setNav('categories')}
    class:selected={nav === 'categories'}
  >
    Categories
  </button>
  <button
    class="nav-button"
    on:click={() => setNav('nft-gates')}
    class:selected={nav === 'nft-gates'}
  >
    NFT Gates
  </button>
</div>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container-wrapper">
  {#key availabilityKey}
    {#if nav === 'collection'}
      {#await admin.fetchCollections()}
        <img class="loading-icon" src="/icons/loading.png" alt="Loading" />
      {:then collections}
        {storeAllTopics(collections)}
        {#each collections as { category_id, category_name, category_order, section_id, topics }}
          <section class="container blur">
            <div class="buttons-wrapper category-header">
              <form id="category-order" class="buttons-wrapper">
                <label for="category-order">Order:</label>
                <input
                  class="story-input order-input"
                  type="number"
                  value={category_order}
                  on:click|preventDefault={selectInput}
                  on:input={(event) =>
                    handleChangeCategoryOrder(event, category_id)}
                />
              </form>

              <p class="collection-header">{category_name}: {topics.length}</p>

              <form id="section" class="buttons-wrapper">
                <label for="section">Select section:</label>
                {#if sections}
                  <select
                    class="selector blur"
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
              </form>
            </div>
            <div class="tiles-collection">
              {#each sortTopicsByOrder(topics) as { topic_name, order, available, topic_id }}
                <a class="tile" href="/dashboard/dream/manage/{topic_name}">
                  <h2>{topic_name}</h2>
                  <form id="order" class="buttons-wrapper">
                    <label for="order" class="order-label">Order:</label>
                    <input
                      class="story-input order-input"
                      type="number"
                      value={order}
                      on:click|preventDefault={selectInput}
                      on:input={(event) => handleChangeOrder(event, topic_id)}
                    />
                  </form>
                  <button
                    class:green-button={available === 'available'}
                    class:red-button={available === 'unavailable'}
                    on:click|preventDefault={() =>
                      admin
                        .changeAvailability(
                          topic_id,
                          switchAvailable(available),
                        )
                        .then(() => (availabilityKey = available + topic_name))}
                  >
                    {available}
                  </button>
                </a>
              {/each}
            </div>
          </section>
        {/each}
      {/await}
    {:else if nav === 'nft-gates'}
      <NFTGates {classGates} {fetchClasses} {selectInput} />
    {:else if nav === 'categories'}
      <Categories />
    {/if}
  {/key}
</section>

<style>
  .container:not(.buttons-wrapper) {
    width: 100vw;
    padding-inline: 0;
    border-radius: 0;
  }

  .tiles-collection {
    background-image: none;
    background-color: rgba(22, 30, 95, 0.75);
  }

  .category-header {
    width: 95%;
    justify-content: space-between;
  }

  .tile {
    padding: 1vw;
    gap: 1vw;
  }

  .order-label {
    color: #010020;
    text-shadow: 0 0 0.1vw #010020;
  }

  .order-input {
    text-align: center;
    padding: 0;
    width: 3.5vw;
  }

  button {
    text-transform: capitalize;
  }

  @media only screen and (max-width: 600px) {
    .category-header {
      flex-flow: row-reverse wrap;
      justify-content: center;
      gap: 0.5em 2em;
    }

    .tile {
      padding: 1em;
      gap: 1em;
    }

    .order-input {
      padding: 0.25em 0.5em;
      width: 1.5em;
    }
  }
</style>
