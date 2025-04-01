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

  let topicGatings: TopicNFTGate[] = [];
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
    console.log(topicGatings);
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
    console.log(topicGatings);
  }

  async function handleAddGating() {
    if (!newGating) return;

    handleGatingChange(topic.id, newGating as SupportedContracts, 'add', newClassGating).then(
      fetchGates,
    );

    newGating = '';
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="dream-box blur contracts-list">
  <div class="buttons-wrapper">
    <h2>Web3 Gating</h2>
    <div class="container buttons-wrapper">
      {#if topicGatings.length > 0}
        {#each topicGatings as { contract_name }}
          <div class="gating">
            <h3>{contract_name}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="close-svg"
              stroke="rgba(255, 60, 64, 0.85)"
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

  <div class="buttons-wrapper add-gating">
    <select class="selector" bind:value={newGating}>
      <option value="" hidden disabled>Select</option>
      {#each availableContracts.filter((contract) => !topicGatings
            .map((gate) => gate.contract_name)
            .includes(contract)) as gating}
        <option value={gating}>{gating}</option>
      {/each}
    </select>

    {#if newGating === 'Potential'}
      <div class="buttons-wrapper">
        <h3>Potential Class Gating</h3>
        <select class="selector" bind:value={newClassGating}>
          <option value="" hidden disabled>Select</option>
          {#await viewApp.fetchClassGates()}
            <option value="" hidden disabled>Select</option>
          {:then classGating}
            {#each classGating as { id, name }}
              <option value={id}>{name}</option>
            {/each}
          {/await}
        </select>
      </div>
    {/if}
    <button on:click={handleAddGating} disabled={!newGating}>Gate Story</button>
  </div>
</div>

<style>
  .contracts-list {
    width: auto;
    max-width: 95vw;
  }

  .gating {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    background-color: rgba(56, 117, 250, 0.5);
    border-radius: 1vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  .gating h3 {
    color: #dedede;
  }

  .add-gating {
    width: 100%;
  }

  /* .buttons-wrapper input {
    background-color: rgba(36, 65, 189, 0.1);
    border-color: rgb(36, 65, 189);
    text-align: center;
  } */

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
      padding: 1em;
      border-radius: 0.5em;
    }
  }
</style>
