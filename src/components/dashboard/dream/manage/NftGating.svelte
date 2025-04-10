<script lang="ts">
  import { onMount } from 'svelte';

  import { CoNexusApp } from '@lib/view';

  export let topic: ViewTopic;
  export let handleGatingChange = async (
    topic_id: number,
    contract_name: SupportedContracts,
    method: 'add' | 'remove',
    class_id?: string,
  ) => {};

  let viewApp = new CoNexusApp();

  let topicGatings: TopicNFTGateWithContract[] = [];
  const availableContracts: SupportedContracts[] = ['Potential', 'Ark', 'Apes'];
  let newGating = '';
  let newClassGating = '';

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="dream-box blur contracts-list">
  <div class="buttons-wrapper">
    <h2>Web3 Gating</h2>
    <div class="container buttons-wrapper added-gatings">
      {#if topicGatings.length > 0}
        {#each topicGatings as { contract_name, class_id }}
          <div class="gating">
            <h3>
              {contract_name}
              {#if class_id}
                {#await viewApp.fetchClassGate(class_id) then classGate}
                  ({classGate?.name})
                {/await}
              {/if}
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="close-svg"
              stroke="rgba(32, 0, 1, 0.85)"
              stroke-width="30"
              stroke-linecap="round"
              on:click={() => handleRemoveGating(topicGatings, contract_name)}
              role="button"
              tabindex="0"
            >
              <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
            </svg>
          </div>
        {/each}
      {:else}
        <h3>No NFT restriction selected.</h3>
      {/if}
    </div>
  </div>

  <div class="buttons-wrapper add-gating-container">
    <select class="selector" bind:value={newGating}>
      <option value="" hidden disabled>Select</option>
      {#each availableContracts.filter((contract) => !topicGatings
            .map((gate) => gate.contract_name)
            .includes(contract)) as gating}
        <option value={gating}>{gating}</option>
      {/each}
    </select>

    <button
      class="orange-button"
      on:click={handleAddGating}
      disabled={!newGating}>Gate Story</button
    >
  </div>

  {#if newGating === 'Potential'}
    <hr />
    <h3>Select Class Restriction (Optional)</h3>

    {#await viewApp.fetchClassGates() then classGating}
      <div class="buttons-wrapper">
        <div class="container dream-radio-buttons">
          {#if classGating.length > 0}
            {#each classGating as { id, name }}
              <span
                class:active={newClassGating == id.toString()}
                on:click={() => setClassGating(id)}
                role="button"
                tabindex="0"
              >
                {name}
              </span>
            {/each}
          {/if}
        </div>
      </div>
    {/await}
  {/if}
</div>

<style>
  .contracts-list {
    width: auto;
    align-items: center;
    max-width: 95vw;
  }

  .gating {
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

  .gating h3 {
    color: rgba(255, 255, 255, 0.9);
  }

  .added-gatings {
    flex-flow: row wrap !important;
    justify-content: center !important;
  }

  .active {
    color: rgb(255, 140, 0) !important;
    text-shadow: 0 0 0.1vw rgb(255, 140, 0);
  }

  @media only screen and (max-width: 600px) {
    .contracts-list {
      width: 100vw;
      max-width: none;
    }

    .contracts-list .container {
      flex-flow: row wrap;
    }

    .selector {
      width: 95vw;
    }

    .gating {
      gap: 1em;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    .add-gating-container {
      gap: 1em;
    }
  }
</style>
