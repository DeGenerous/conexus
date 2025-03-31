<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  export let topic: ViewTopic;
  export let handleGatingChange = async (
    topic_id: number,
    contract_name: SupportedContracts,
    method: 'add' | 'remove',
  ) => {};
  export let getTopicGates = async (topic_id: number) => { return [] as TopicNFTGate[]};

  let topicGatings = writable<SupportedContracts[]>([]);
  const availableContracts: SupportedContracts[] = ['Potential', 'Ark', 'Moonsign', 'Apes'];
  let newGating = writable('');

  onMount(async () => {
    const gates = await getTopicGates(topic.id);
    $topicGatings = gates.map((gate) => (gate.contract_name));
  });

  async function handleRemoveGating(gatingToRemove: string) {
    topicGatings.update((prevGatings) =>
      prevGatings.filter((gating) => gating !== gatingToRemove),
    );

    const contract = availableContracts.find((g: SupportedContracts) => g === gatingToRemove);
    if (contract) await handleGatingChange(topic.id, contract, 'remove');
  }

  function handleAddGating() {
    newGating.update((value: SupportedContracts) => {
      if (value && !$topicGatings.includes(value)) {
        topicGatings.update((prev) => [...prev, value]);

        const contract = availableContracts.find((g) => g === value);
        if (contract) handleGatingChange(topic.id, contract, 'add');
      }
      return '';
    });
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="dream-box blur contracts-list">
  <div class="buttons-wrapper">
    <h2>Web3 Gating</h2>
    <div class="container buttons-wrapper contracts-wrapper">
      {#if $topicGatings.length > 0}
        {#each $topicGatings as gating}
          <div class="gating">
            <h3>{gating}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="close-svg"
              stroke="rgba(255, 60, 64, 0.85)"
              stroke-width="30"
              stroke-linecap="round"
              on:click={() => handleRemoveGating(gating)}
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

  <div class="buttons-wrapper">
    <select class="selector" bind:value={$newGating}>
      <option value="" hidden disabled>Select</option>
      {#each availableContracts.filter((contract) => !$topicGatings.includes(contract)) as gating}
        <option value={gating}>{gating}</option>
      {/each}
    </select>
    <button on:click={handleAddGating} disabled={!$newGating}>Gate Story</button>
  </div>
</div>

<style>
  .contracts-list {
    align-items: center;
    width: auto;
    max-width: 95vw;
  }

  .contracts-wrapper {
    flex-flow: row wrap;
    justify-content: center !important;
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
