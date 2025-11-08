<script lang="ts">
  import { onMount } from 'svelte';

  import Collection from '@lib/collection';
  import { toastStore } from '@stores/toast.svelte';

  import CloseSVG from '@components/icons/Close.svelte';
  import { availableGenres } from '@stores/view.svelte';

  let {
    topic_gates,
    handleGatingChange,
  }: {
    topic_gates: TopicGate[] | undefined;
    handleGatingChange: (
      gate_id: string,
      method: 'add' | 'remove',
    ) => Promise<void>;
  } = $props();

  let collection: Collection = new Collection();

  let allCollections = $state<Partial<CollectionResponse>[]>([]);
  let collectionGates = $state<Partial<GateResponse>[]>([]);

  let selectedCollectionId = $state<string>('');
  let selectedGateId = $state<string>('');

  let errorGates = $state<string>('');

  onMount(async () => {
    allCollections = await collection.listCollections();
  });

  $effect(() => {
    if (!selectedCollectionId) {
      return;
    }
    (async () => {
      try {
        errorGates = '';
        collectionGates = await collection.listGates(selectedCollectionId!);
      } catch (error) {
        console.error('Error fetching gates:', error);
        errorGates = 'Error fetching gates for the selected collection.';
      }
    })();
  });

  async function handleRemoveGating(id?: string) {
    if (!id) {
      toastStore.show('Unable to remove gate: missing ID', 'error');
      return;
    }

    const gateToRemove = collectionGates.find((g) => g.id === id);
    if (!gateToRemove || !gateToRemove.id) {
      toastStore.show('Unable to remove gate: gate not found', 'error');
      return;
    }

    try {
      await handleGatingChange(gateToRemove.id, 'remove');
      topic_gates = topic_gates?.filter((gate) => gate.gate_id !== id);
    } catch (error) {
      console.error('Error removing gate:', error);
    }
  }

  async function handleAddGating() {
    if (selectedGateId === '') {
      toastStore.show('Please select a gate to add', 'error');
      return;
    }

    if (topic_gates?.some((tg) => tg.gate_id === selectedGateId)) {
      toastStore.show('This gate is already added', 'error');
      return;
    }

    const newGate = collectionGates.find((g) => g.id === selectedGateId);
    if (!newGate || !newGate.id) {
      toastStore.show('Selected gate not found', 'error');
      return;
    }

    try {
      await handleGatingChange(newGate.id, 'add');
      topic_gates = [...(topic_gates ?? []), newGate as TopicGate];
      selectedGateId = '';
    } catch (error) {
      console.error('Error adding gate:', error);
    }
  }
</script>

<div class="flex-row">
  <h4>Web3 Gating</h4>
  <div class="container">
    {#if topic_gates && topic_gates.length > 0}
      {#each topic_gates as gate}
        <button class="void-btn small-orange-tile">
          <p>
            {gate.name}
          </p>
          <CloseSVG
            onclick={() => handleRemoveGating(gate.gate_id)}
            voidBtn={true}
            dark={true}
          />
        </button>
      {/each}
    {:else}
      <p class="validation">No Web3 restriction selected</p>
    {/if}
  </div>
</div>

<span class="flex-row flex-wrap">
  <select bind:value={selectedCollectionId}>
    <option value="" hidden disabled>Select Collection</option>
    {#each allCollections as collection}
      <option value={collection.id}>{collection.name}</option>
    {/each}
  </select>

  {#if errorGates}
    <p class="validation red-txt">{errorGates}</p>
  {:else}
    {@const availableGates = collectionGates.filter(
      (c) => !topic_gates?.some((tc: TopicGate) => tc.gate_id === c.id),
    )}
    <select
      bind:value={selectedGateId}
      disabled={!selectedCollectionId || availableGates.length === 0}
    >
      <option value="" hidden disabled>
        {#if !selectedCollectionId}
          No Collection Selected
        {:else if availableGates.length === 0}
          No Available Gates
        {:else}
          Select Gate
        {/if}
      </option>
      {#if availableGates.length}
        {#each availableGates as gate}
          <option value={gate.id}>{gate.name}</option>
        {/each}
      {/if}
    </select>
  {/if}

  <button
    class="orange-btn"
    onclick={handleAddGating}
    disabled={!selectedGateId}
  >
    Gate Story
  </button>
</span>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div .container {
    justify-content: center;
    flex-wrap: wrap;
  }

  span {
    width: 100%;
  }
</style>
