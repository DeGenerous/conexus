<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';
  import { tippy } from 'svelte-tippy';

  import { AdminApp } from '@lib/admin';
  import { toastStore } from '@stores/toast.svelte';

  export let topics: CollectionTopic[] = [];
  export let fetchCollections = async () => {};
  export let selectInput = (event: Event) => {};

  const admin = new AdminApp();

  let debounceTimeout: NodeJS.Timeout;

  let items: any[] = [];

  // Make a sortable id‑based copy
  const updateTopics = () => {
    items = topics
      .map((t) => ({ ...t, id: t.topic_id }))
      .sort((a: CollectionTopic, b: CollectionTopic) => a.order - b.order);
  };

  onMount(() => updateTopics());

  // Change order of every topic based on position in array
  const persistOrder = () => {
    items.forEach(async ({ topic_id }, i) => {
      await admin.editTopicOrder(topic_id, i + 1, false);
      items[i].order = i + 1;
    });
    toastStore.show('All topics reordered successfully');
  };

  // Change order of single topic
  const handleChangeOrder = (event: Event, topic_id: number) => {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;
    if (Number(input.value) < 1) input.value = '1';
    if (Number(input.value) > 99) input.value = '99';
    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';
      await admin.editTopicOrder(topic_id, Number(input.value));
      await fetchCollections();
      updateTopics();
    }, 1000);
  };

  // Switch availability
  const switchAvailable = (available: string) => {
    if (available === 'available') return 'unavailable';
    else return 'available';
  };

  const handleSwitchAvailable = async (id: number, key: string) => {
    await admin.changeAvailability(id, switchAvailable(key));
    await fetchCollections();
    updateTopics();
  };
</script>

<div
  class="tiles-collection"
  use:dndzone={{ items, type: 'row' }}
  on:consider={(e) => (items = e.detail.items)}
  on:finalize={(e) => {
    items = e.detail.items;
    persistOrder();
  }}
>
  {#each items as t (t.id)}
    <a
      class="tile"
      href="/dashboard/dream/manage/{t.topic_name}"
      draggable="false"
    >
      <h4>{t.topic_name}</h4>
      <div class="input-container">
        <label for="story-order-{t.topic_id}">Order</label>
        <input
          id="story-order-{t.topic_id}"
          type="number"
          value={t.order}
          on:click={selectInput}
          on:input={(event) => handleChangeOrder(event, t.topic_id)}
        />
      </div>
      <button
        use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
        class:green-btn={t.available === 'available'}
        class:red-btn={t.available === 'unavailable'}
        on:click|preventDefault={() =>
          handleSwitchAvailable(t.topic_id, t.available)}
      >
        {t.available}
      </button>
    </a>
  {/each}
</div>

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

  .tiles-collection {
    min-height: unset;

    .tile {
      padding-block: 1rem;
      gap: 1rem;

      h4 {
        height: 100%;
      }
    }
  }
</style>
