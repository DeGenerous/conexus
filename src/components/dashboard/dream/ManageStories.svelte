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

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_to_interactive_role -->
<nav class="blur">
  <h3
    on:click={() => setNav('collection')}
    class:selected={nav === 'collection'}
    role="button"
    tabindex="0"
  >
    Collections
  </h3>
  <h3
    on:click={() => setNav('categories')}
    class:selected={nav === 'categories'}
    role="button"
    tabindex="0"
  >
    Categories
  </h3>
  <h3
    on:click={() => setNav('nft-gates')}
    class:selected={nav === 'nft-gates'}
    role="button"
    tabindex="0"
  >
    NFT Gates
  </h3>
</nav>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container-wrapper">
  {#if nav === 'collection'}
    {#key availabilityKey}
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

              <div class="collection-header">
                <p>{category_name}: {topics.length}</p>
              </div>

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
    {/key}
  {:else if nav === 'nft-gates'}
    <NFTGates {classGates} {fetchClasses} {selectInput} />
  {:else if nav === 'categories'}
    <Categories />
  {/if}
</section>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(36, 65, 189, 0.75);
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  nav h3 {
    width: 100%;
    color: rgba(255, 255, 255, 0.75);
    padding: 1vw;
  }

  nav h3:hover,
  nav h3:active {
    filter: brightness(125%);
    background-color: rgba(45, 90, 216, 0.5);
  }

  .selected {
    color: rgb(51, 226, 230);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
    background-color: rgba(45, 90, 216, 0.5);
  }

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
    nav h3 {
      padding: 1em;
    }

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
