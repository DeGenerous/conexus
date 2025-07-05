<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import { tippy } from 'svelte-tippy';

  import AdminApp from '@lib/admin';
  import { toastStore } from '@stores/toast.svelte';

  export let topics: CollectionTopic[] = [];
  export let catId: number; // ← receives category_id
  export let fetchCollections = async () => {};
  export let selectInput = (event: Event) => {};
  export let isCoarsePointer: () => boolean;

  const admin = new AdminApp();

  let debounceTimeout: NodeJS.Timeout;

  let items: any[] = [];
  $: items = topics.map((t) => ({ ...t, id: t.topic_id }));

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
  };

  let busy = false;
  async function handleFinalize(e: CustomEvent) {
    if (busy) return;
    busy = true;
    try {
      const { items: newItems, info } = e.detail;
      const draggedId = info.id;
      items = newItems;

      const isDestination = newItems.some((t) => t.topic_id === draggedId);
      if (!isDestination) return;

      const movedHere = topics.every((t) => t.topic_id !== draggedId);
      if (movedHere) await admin.editTopicCategory(draggedId, catId, false);

      await Promise.all(
        newItems.map((t, i) => admin.editTopicOrder(t.topic_id, i + 1, false)),
      );

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
  on:consider={(e) => (items = e.detail.items)}
  on:finalize={handleFinalize}
>
  {#each items as t (t.id)}
    <a class="tile" href="/dashboard/dream/manage/{t.topic_name}">
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
