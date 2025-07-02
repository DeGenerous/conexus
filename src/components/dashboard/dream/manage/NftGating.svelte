<script lang="ts">
  import { onMount } from 'svelte';

  import { CoNexusApp } from '@lib/view';
  import { contractGetter } from '@constants/contracts';

  import CloseSVG from '@components/icons/Close.svelte';

  let {
    topic,
    handleGatingChange,
  }: {
    topic: ViewTopic;
    handleGatingChange: (
      topic_id: number,
      contract_name: SupportedContracts,
      method: 'add' | 'remove',
      class_id?: string,
    ) => Promise<void>;
  } = $props();

  let viewApp = new CoNexusApp();

  let topicGatings = $state<TopicNFTGateWithContract[]>([]);
  const availableContracts = $state<SupportedContracts[]>([
    'Potential',
    'Ark',
    'Apes',
  ]);
  let newGating = $state('');
  let newClassGating = $state('');

  const filterContracts = () =>
    availableContracts.filter(
      (contract) =>
        !topicGatings.map((gate) => gate.contract_name).includes(contract),
    );

  const fetchGates = async () => {
    topicGatings = await viewApp.fetchTopicGates(topic.id);
  };

  onMount(fetchGates);

  async function handleRemoveGating(
    topicGatings: TopicNFTGate[],
    gatingToRemove: string,
  ) {
    topicGatings.map(async (gate) => {
      if (gate.contract_name === gatingToRemove)
        await handleGatingChange(
          gate.topic_id,
          gate.contract_name,
          'remove',
        ).then(fetchGates);
    });
    topicGatings = topicGatings.filter(
      (gating) => gating.contract_name !== gatingToRemove,
    );
  }

  async function handleAddGating() {
    if (!newGating) return;

    handleGatingChange(
      topic.id,
      newGating as SupportedContracts,
      'add',
      newClassGating,
    ).then(fetchGates);

    newGating = '';
    newClassGating = '';
  }

  const setClassGating = (id: number) => {
    if (newClassGating === id.toString()) {
      newClassGating = '';
      return;
    }
    newClassGating = id.toString();
  };
</script>

<div class="flex-row">
  <h4>Web3 Gating</h4>
  <div class="container">
    {#if topicGatings.length > 0}
      {#each topicGatings as { contract_name, class_id }}
        <button class="void-btn small-orange-tile">
          <p>
            {contractGetter(contract_name).name}
            {#if class_id}
              {#await viewApp.fetchClassGate(class_id) then classGate}
                ({classGate?.name})
              {/await}
            {/if}
          </p>
          <CloseSVG
            onclick={() => handleRemoveGating(topicGatings, contract_name)}
            voidBtn={true}
            dark={true}
          />
        </button>
      {/each}
    {:else}
      <p class="validation">No NFT restriction selected</p>
    {/if}
  </div>
</div>

<div class="add-gating flex-row">
  <select bind:value={newGating} disabled={!filterContracts().length}>
    <option value="" hidden disabled>Select</option>
    {#each filterContracts() as gating}
      <option value={gating}>{contractGetter(gating).name}</option>
    {/each}
  </select>

  <button class="orange-btn" onclick={handleAddGating} disabled={!newGating}
    >Gate Story</button
  >
</div>

{#if newGating === 'Potential'}
  <hr />

  <h4>Select Class Restriction (Optional)</h4>
  {#await viewApp.fetchClassGates() then classGating}
    <div class="classes container">
      {#if classGating.length > 0}
        {#each classGating as { id, name }}
          <button
            class="void-btn dream-radio-btn"
            class:active={newClassGating == id.toString()}
            onclick={() => setClassGating(id)}
          >
            {name}
          </button>
        {/each}
      {/if}
    </div>
  {/await}
{/if}

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
