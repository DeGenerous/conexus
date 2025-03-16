<script lang="ts">
  import { onMount } from 'svelte';

  import { default_sections } from '@constants/data';
  import { AdminApp } from '@lib/admin';
  import { CoNexusApp } from '@lib/view';
  import { checkUserState } from '@utils/route-guard';

  let admin = new AdminApp();
  let view = new CoNexusApp();

  let sections: Section[] = default_sections;

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

  const selectOrder = (event: Event) => {
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
</script>

<section class="container-wrapper">
  {#key availabilityKey}
    {#await admin.fetchCollections()}
      <img class="loading-icon" src="/icons/loading.png" alt="Loading" />
    {:then collections}
      {#each collections as { category_id, category_name, section_id, topics }}
        <section class="container blur">
          <div class="buttons-wrapper category-header">
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
                    on:click|preventDefault={selectOrder}
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
    {/await}
  {/key}
</section>

<style>
  .container {
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

  .order-input::-webkit-outer-spin-button,
  .order-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .order-input {
    appearance: textfield;
    text-align: center;
    padding: 0;
    width: 3.5vw;
  }

  button {
    text-transform: capitalize;
  }

  @media only screen and (max-width: 600px) {
    .category-header {
      flex-direction: column;
    }

    .tile {
      padding: 1em;
      gap: 1em;
    }

    .order-input {
      padding: 0.5em 1em;
      width: 1.5em;
    }
  }
</style>
