<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { tippy } from 'svelte-tippy';

  import Topics from '@lib/topics';
  import { toastStore } from '@stores/toast.svelte';

  let {
    topics,
    category_Id,
    fetchCollections,
    isCoarsePointer,
  }: {
    topics: CollectionTopic[];
    category_Id: string;
    fetchCollections: () => Promise<void>;
    isCoarsePointer: () => boolean;
  } = $props();

  const topicManager = new Topics();

  let debounceTimeout: NodeJS.Timeout;

  let items = $state<CollectionTopic[]>(topics);

  const selectInput = (event: Event) => {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    input.select();
  };

  // Change order of single topic
  const handleChangeOrder = (
    event: Event,
    topic_id: string,
    category_id: string,
  ) => {
    clearTimeout(debounceTimeout);
    const input = event.target as HTMLInputElement;

    if (Number(input.value) < 1) input.value = '1';
    if (Number(input.value) > 99) input.value = '99';

    debounceTimeout = setTimeout(async () => {
      if (input.value == '') input.value = '0';

      await topicManager.changeSortOrderInCategory(
        topic_id,
        category_id,
        Number(input.value),
      );

      await fetchCollections();
    }, 1000);
  };

  // Switch availability
  const switchAvailable = (available: boolean) => {
    if (available) return false;
    else return true;
  };

  const handleSwitchAvailable = async (topic_id: string, key: boolean) => {
    await topicManager.changeAvailability(topic_id, switchAvailable(key));
    await fetchCollections();
  };

  let busy = false;
  async function handleFinalize(e: CustomEvent<DndEvent<CollectionTopic>>) {
    if (busy) return;
    busy = true;
    try {
      const { items: newItems, info } = e.detail;
      const draggedId = info.id;
      items = newItems;

      const isDestination = newItems.some((t) => t.topic_id === draggedId);
      if (!isDestination) return;

      const movedHere = topics.every((t) => t.topic_id !== draggedId);

      const orderChanged = newItems.some(
        (t, i) => t.topic_id !== (topics[i] && topics[i].topic_id),
      );

      // Dont reorder if order didnt change
      if (!movedHere && !orderChanged) {
        busy = false;
        return;
      }

      // if (movedHere)
      //   await topicManager.editTopicCategory(draggedId, category_Id, false);

      // await Promise.all(
      //   newItems.map((t, i) =>
      //     topicManager.changeSortOrder(t.topic_id, i + 1, false),
      //   ),
      // );

      toastStore.show(
        movedHere
          ? 'Topic moved to new category and reordered successfully'
          : 'All topics reordered successfully',
      );
      await fetchCollections();
    } catch (err) {
      console.error(err);
      toastStore.show('Failed to save: ' + String(err), 'error');
    } finally {
      busy = false;
    }
  }
</script>

<div
  class="tiles-collection"
  use:dndzone={{
    items,
    type: 'topic',
    dragDisabled: isCoarsePointer(),
  }}
  onconsider={(e) => (items = e.detail.items)}
  onfinalize={handleFinalize}
>
  {#each items as t (t.topic_id)}
    <a class="tile" href="/dashboard/dream/manage/{t.topic_name}">
      <h4>{t.topic_name}</h4>
      <div class="input-container">
        <label for="story-order-{t.topic_id}">Order</label>
        <input
          id="story-order-{t.topic_id}"
          type="number"
          value={t.order}
          onclick={selectInput}
          oninput={(event) => handleChangeOrder(event, t.topic_id, category_Id)}
        />
      </div>
      <button
        use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
        class:green-btn={t.available === true}
        class:red-btn={t.available === false}
        onclick={() => handleSwitchAvailable(t.topic_id, t.available)}
      >
        {t.available === true ? 'available' : 'unavailable'}
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
