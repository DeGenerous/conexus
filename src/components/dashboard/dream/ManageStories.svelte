<script lang="ts">
  import { onMount } from 'svelte';

  import { default_sections } from '@constants/data';
  import { AdminApp } from '@lib/admin';
  import { CoNexusApp } from '@lib/view';
  import { checkUserState } from '@utils/route-guard';

  let admin = new AdminApp();
  let view = new CoNexusApp();

  let sections: Section[] = default_sections;

  let newCategoryName: string = '';

  onMount(async () => {
    await checkUserState('/dashboard/dream/manage', true);
  });

  onMount(async () => {
    await view.getSections().then((data) => (sections = data));
  });

  let availabilityKey: string = '';
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
      await admin.changeTopicsOrder(topic_id, Number(input.value));
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

  const selectInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.select();
  };

  const sortTopicsByOrder = (topics: CollectionTopic[]) => {
    const sortedTopics = topics.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
    return sortedTopics;
  };

  const storeAllTopics = (collections: Collection[]) => {
    const allTopics = collections.map((collection) => collection.topics).flat();
    const topicNames = allTopics.map(({ topic_name }) => topic_name);
    localStorage.setItem('all topics', topicNames.join());
  };

  // CLASSES

  let classGates: ClassGate[] = [];

  const fetchClasses = async () => {
    classGates = await view.fetchClassGates();
    console.log(classGates); //
  };

  let newClassName: string = '';
  let newClassRangeFrom: number | undefined;
  let newClassRangeTo: number | undefined;

  const validateRangeFrom = () => {
    if (newClassRangeFrom === undefined) return;
    if (newClassRangeFrom < 1) newClassRangeFrom = 1;
    if (newClassRangeFrom > 999) newClassRangeFrom = 999;

    if (newClassRangeTo === undefined) return;
    if (newClassRangeFrom > newClassRangeTo)
      newClassRangeFrom = newClassRangeTo - 1;
  };

  const validateRangeTo = () => {
    if (newClassRangeTo === undefined) return;
    if (newClassRangeTo < 2) newClassRangeTo = 2;
    if (newClassRangeTo > 1000) newClassRangeTo = 1000;

    if (newClassRangeFrom === undefined) return;
    if (newClassRangeTo < newClassRangeFrom)
      newClassRangeTo = newClassRangeFrom + 1;
  };

  $: classValidation = newClassName && newClassRangeFrom && newClassRangeTo;

  function handleAddClass() {
    admin
      .createNewClassGate(newClassName, newClassRangeFrom!, newClassRangeTo!)
      .then(fetchClasses);
    newClassName = '';
    newClassRangeFrom = undefined;
    newClassRangeTo = undefined;
  }

  function handleDeleteClass(id: number) {
    admin.deleteClassGate(id).then(fetchClasses);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container-wrapper">
  {#key availabilityKey}
    {#await admin.fetchCollections()}
      <img class="loading-icon" src="/icons/loading.png" alt="Loading" />
    {:then collections}
      {storeAllTopics(collections)}
      {#each collections as { category_id, category_name, category_order, section_id, topics }}
        <section class="container blur">
          <div class="buttons-wrapper category-header">
            <div class="buttons-wrapper">
              <label for="category-order">Order:</label>
              <input
                class="story-input order-input"
                type="number"
                value={category_order}
                on:click|preventDefault={selectInput}
                on:input={(event) =>
                  handleChangeCategoryOrder(event, category_id)}
              />
            </div>

            <p class="collection-header">{category_name}: {topics.length}</p>

            <div class="buttons-wrapper">
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
            </div>
          </div>
          <div class="tiles-collection">
            {#each sortTopicsByOrder(topics) as { topic_name, order, available, prompt_id, topic_id }}
              <a class="tile" href="/dashboard/dream/manage/{topic_name}">
                <h2>{topic_name}</h2>
                <div class="buttons-wrapper">
                  <label for="order" class="order-label">Order:</label>
                  <input
                    class="story-input order-input"
                    type="number"
                    value={order}
                    on:click|preventDefault={selectInput}
                    on:input={(event) => handleChangeOrder(event, topic_id)}
                  />
                </div>
                <button
                  class:green-button={available === 'available'}
                  class:red-button={available === 'unavailable'}
                  on:click|preventDefault={() =>
                    admin
                      .changeAvailability(prompt_id, switchAvailable(available))
                      .then(() => (availabilityKey = available + topic_name))}
                >
                  {available}
                </button>
              </a>
            {/each}
          </div>
        </section>
      {/each}

      <div class="container blur buttons-wrapper new-category">
        <input
          class="story-input"
          bind:value={newCategoryName}
          placeholder="Enter Name"
        />
        <button on:click={() => admin.newCategory(newCategoryName)}
          >Add New Category</button
        >
      </div>

      {#await fetchClasses()}
        <h3>Loading classes...</h3>
      {:then}
        <div class="dream-box blur classes-list">
          <div class="buttons-wrapper">
            <h2>NFT Classes</h2>
            <div class="container buttons-wrapper added-classes">
              {#if classGates.length > 0}
                {#each classGates as { id, name, start_token_id, end_token_id }}
                  <div class="nft-class">
                    <h3>{name}: {start_token_id} - {end_token_id}</h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-100 -100 200 200"
                      class="close-svg"
                      stroke="rgba(32, 0, 1, 0.85)"
                      stroke-width="30"
                      stroke-linecap="round"
                      on:click={() => handleDeleteClass(id)}
                      role="button"
                      tabindex="0"
                    >
                      <path
                        d="M -65 -65 L 65 65 M -65 65 L 65 -65"
                        fill="none"
                      />
                    </svg>
                  </div>
                {/each}
              {:else}
                <h3>There is no Classes for Potentials yet.</h3>
              {/if}
            </div>
          </div>

          <hr />

          <section class="new-class">
            <div class="buttons-wrapper">
              <h2>Provide Class Name:</h2>
              <input
                class="story-input"
                placeholder="Enter Name"
                bind:value={newClassName}
              />
            </div>

            <div class="buttons-wrapper">
              <h2>Select IDs Range:</h2>
              <div class="buttons-wrapper class-range">
                <input
                  class="story-input range-input"
                  placeholder="from"
                  bind:value={newClassRangeFrom}
                  type="number"
                  min="1"
                  max="999"
                  on:click|preventDefault={selectInput}
                  on:input={validateRangeFrom}
                />
                <h3>-</h3>
                <input
                  class="story-input range-input"
                  placeholder="to"
                  bind:value={newClassRangeTo}
                  type="number"
                  min="2"
                  max="1000"
                  on:click|preventDefault={selectInput}
                  on:input={validateRangeTo}
                />
              </div>
            </div>
          </section>

          <button
            class="orange-button"
            on:click={handleAddClass}
            disabled={!classValidation}>Add New Class</button
          >
        </div>
      {/await}
    {/await}
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

  .new-category {
    width: 50vw;
    padding: 2vw;
    gap: 2vw;
    border-radius: 1.5vw;
  }

  .new-category input {
    width: 30vw;
  }

  .new-category button {
    width: 20vw;
  }

  .classes-list {
    width: auto;
    align-items: center;
    max-width: 95vw;
  }

  .classes-list * {
    white-space: nowrap;
    text-align: center;
  }

  .added-classes {
    flex-flow: row wrap !important;
    justify-content: center !important;
  }

  .nft-class {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    background-color: rgba(255, 140, 0, 0.75);
    border-radius: 1vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  .nft-class h3 {
    color: rgba(255, 255, 255, 0.9);
  }

  .new-class {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding-bottom: 0.5vw;
  }

  .range-input {
    width: 7vw;
    padding: 0.5vw;
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

    .new-category {
      width: 100vw;
      padding: 1.5em 1em;
      gap: 1em;
      border-radius: 0;
    }

    .new-category input {
      width: 95vw;
      text-align: center;
    }

    .new-category button {
      width: 50vw;
    }

    .classes-list {
      width: 100vw;
      max-width: none;
    }

    .nft-class {
      gap: 1em;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    .class-range {
      flex-direction: row;
    }

    .new-class {
      gap: 1em;
      padding: 0;
    }

    .classes-list input {
      width: 90vw;
    }

    .range-input {
      width: 35vw !important;
    }
  }
</style>
