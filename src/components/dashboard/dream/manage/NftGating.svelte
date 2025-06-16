<script lang="ts">
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

  $effect(() => {
    fetchGates();
  });

  const filterContracts = () =>
    availableContracts.filter(
      (contract) =>
        !topicGatings.map((gate) => gate.contract_name).includes(contract),
    );

  const fetchGates = async () => {
    topicGatings = await viewApp.fetchTopicGates(topic.id);
  };

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
        <span
          class="gating flex-row gap-8 pad-8 round-8 shad"
          role="button"
          tabindex="0"
        >
          <h5>
            {contractGetter(contract_name).name}
            {#if class_id}
              {#await viewApp.fetchClassGate(class_id) then classGate}
                ({classGate?.name})
              {/await}
            {/if}
          </h5>
          <CloseSVG
            onclick={() => handleRemoveGating(topicGatings, contract_name)}
            voidBtn={true}
            dark={true}
          />
        </span>
      {/each}
    {:else}
      <p class="validation">No NFT restriction selected.</p>
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

    .gating {
      padding-left: 1rem;
      @include dark-red(0.85, text);
      @include orange(0.85);

      &:hover,
      &:active {
        @include dark-red(1, text);
        @include orange;
        @include scale-up(soft);
        @include box-shadow(deep);
      }

      h5 {
        color: inherit;
        text-shadow: none;
        text-transform: uppercase;
      }
    }

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
