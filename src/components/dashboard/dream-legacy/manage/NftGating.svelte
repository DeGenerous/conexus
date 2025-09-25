<script lang="ts">
  import { onMount } from 'svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let {
    topic_gates,
    handleGatingChange,
  }: {
    topic_gates: Gate[];
    handleGatingChange: (
      gate_id: string,
      method: 'add' | 'remove',
    ) => Promise<void>;
  } = $props();

  let allGates = $state<Gate[]>([]);
  let newGateId = $state('');

  const fetchGates = async () => {};

  onMount(fetchGates);

  async function handleRemoveGating(gate_id?: string) {
    if (!gate_id) return;

    topic_gates = topic_gates.filter((gate) => gate.id !== gate_id);

    const gateToRemove = allGates.find((g) => g.id === gate_id);
    if (!gateToRemove || !gateToRemove.id) return;

    await handleGatingChange(gateToRemove.id, 'remove');
  }

  async function handleAddGating() {
    if (newGateId === '') return;

    if (topic_gates.some((tg) => tg.id === newGateId)) {
      return;
    }

    const newGate = allGates.find((g) => g.id === newGateId);

    if (!newGate || !newGate.id) return;

    handleGatingChange(newGate.id, 'add').then(fetchGates);

    newGateId = '';
  }
</script>

<div class="flex-row">
  <h4>Web3 Gating</h4>
  <div class="container">
    {#if topic_gates && topic_gates.length > 0}
      {#each topic_gates as gate}
        {#if 'type' in gate}
          <button class="void-btn small-orange-tile">
            <p>
              {gate.name}
            </p>
            <CloseSVG
              onclick={() => handleRemoveGating(gate.id)}
              voidBtn={true}
              dark={true}
            />
          </button>
        {/if}
      {/each}
    {:else}
      <p class="validation">No NFT restriction selected</p>
    {/if}
  </div>
</div>

<div class="add-gating flex-row">
  <select bind:value={newGateId}>
    <option value="" hidden disabled>Select</option>
    {#each allGates as gate}
      <option value={gate.id}>{gate.name} type: {gate.type}</option>
    {/each}
  </select>

  <button class="orange-btn" onclick={handleAddGating} disabled={!newGateId}
    >Gate Story</button
  >
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    flex-wrap: wrap;
    justify-content: center;

    @include respond-up(tablet) {
      &.classes {
        justify-content: space-around;
      }
    }
  }

  .add-gating {
    justify-content: center;
  }
</style>
