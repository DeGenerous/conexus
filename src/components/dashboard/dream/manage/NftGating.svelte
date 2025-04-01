<script lang="ts">
  import { onMount } from 'svelte';

  import { CoNexusApp } from '@lib/view';
  import { getPotentialClassName, getPotentialIDsRange } from '@utils/nfts';

  export let topic: ViewTopic;
  export let handleGatingChange = async (
    topic_id: number,
    contract_name: SupportedContracts,
    // token_ids: number[],
    method: 'add' | 'remove',
  ) => {};

  let viewApp = new CoNexusApp();

  // let topicGatings: TopicNFTGate[] = [];
  const availableContracts: SupportedContracts[] = ['Potential', 'Ark', 'Apes'];
  const newGating = {
    topic_id: topic.id,
    contract_name: '',
    // token_ids: 
  };

  // let gatingType: 'collection' | 'ids' = 'collection';
  // let [rangeFrom, rangeTo]: [number, number] = [1, 1000];

  // onMount(async () => {
  //   topicGatings = await fetchGates();
  // });

  const fetchGates = async () => {
    return await viewApp.fetchTopicGates(topic.id);
  }

  async function handleRemoveGating(topicGatings: TopicNFTGate[], gatingToRemove: string) {
    topicGatings.map(async (gate) => {
      if (gate.contract_name === gatingToRemove)
      await handleGatingChange(
        gate.topic_id,
        gate.contract_name,
        // gate.token_ids,
        'remove'
      );
    });
    // topicGatings = topicGatings.filter((gating) => (gating.contract_name !== gatingToRemove));
  }

  async function handleAddGating() {
    if (!newGating.contract_name) return;

    // let token_ids: number[];
    // if (gatingType === 'ids') token_ids = [rangeFrom, rangeTo];

    handleGatingChange(
      newGating.topic_id,
      newGating.contract_name as SupportedContracts,
      // newGating.token_ids,
      'add'
    );

    // topicGatings = await fetchGates();
    resetGate();
  }

  const resetGate = () => {
    newGating.contract_name = '';
    // gatingType = 'collection';
    // [rangeFrom, rangeTo] = [1, 1000];
  }

  // const validateRangeFrom = () => {
  //   if (rangeFrom < 1) rangeFrom = 1;
  //   if (rangeFrom >= rangeTo) rangeFrom = rangeTo - 1;
  //   if (rangeFrom > 999) rangeFrom = 999;
  // }

  // const validateRangeTo = () => {
  //   if (rangeTo < 2) rangeTo = 2;
  //   if (rangeTo <= rangeFrom) rangeTo = rangeFrom + 1;
  //   if (rangeTo > 1000) rangeTo = 1000;
  // }

  // const selectInput = (event: Event) => {
  //   const input = event.target as HTMLInputElement;
  //   input.select();
  // };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
{#await fetchGates() then topicGatings: TopicNFTGate[]}
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

    <!-- <div class="buttons-wrapper">
      <h2>Restriction Type</h2>
      <div class="container dream-radio-buttons">
        <span
          class:active={gatingType === 'collection'}
          on:click={() => (gatingType = 'collection')}
          role="button"
          tabindex="0"
        >
          NFT Collection
        </span>
        <span
          class:active={gatingType === 'ids'}
          on:click={() => (gatingType = 'ids')}
          role="button"
          tabindex="0"
        >
          Selected NFTs
        </span>
      </div>
    </div> -->

    <!-- {#if gatingType === 'ids'}
      <div class="buttons-wrapper">
        <h2>Select Range</h2>
        <div class="container buttons-wrapper">
          <input
            class="story-input"
            bind:value={rangeFrom}
            on:click|preventDefault={selectInput}
            on:input={validateRangeFrom}
            min="1"
            max="999"
            type="number"
          />
          <span>-</span>
          <input
            class="story-input"
            bind:value={rangeTo}
            on:click|preventDefault={selectInput}
            on:input={validateRangeTo}
            min="2"
            max="1000"
            type="number"
          />
        </div>
      </div>

      {#if newGating.contract_name === 'Potential'}
        <div class="buttons-wrapper">
          <h2>Class</h2>
          <div class="container dream-radio-buttons class-toggle">
            <span
              class:active={rangeFrom == 1 && rangeTo == 10}
              on:click={() => [rangeFrom, rangeTo] = getPotentialIDsRange('NeYon')}
              role="button"
              tabindex="0"
            >
              NeYon
            </span>
            <span
              class:active={rangeFrom == 11 && rangeTo == 208}
              on:click={() => [rangeFrom, rangeTo] = getPotentialIDsRange('Oracle')}
              role="button"
              tabindex="0"
            >
              Oracle
            </span>
            <span
              class:active={rangeFrom == 209 && rangeTo == 406}
              on:click={() => [rangeFrom, rangeTo] = getPotentialIDsRange('Assassin')}
              role="button"
              tabindex="0"
            >
              Assassin
            </span>
            <span
              class:active={rangeFrom == 407 && rangeTo == 604}
              on:click={() => [rangeFrom, rangeTo] = getPotentialIDsRange('Engineer')}
              role="button"
              tabindex="0"
            >
              Engineer
            </span>
            <span
              class:active={rangeFrom == 605 && rangeTo == 802}
              on:click={() => [rangeFrom, rangeTo] = getPotentialIDsRange('Spy')}
              role="button"
              tabindex="0"
            >
              Spy
            </span>
            <span
              class:active={rangeFrom == 803 && rangeTo == 1000}
              on:click={() => [rangeFrom, rangeTo] = getPotentialIDsRange('Soldier')}
              role="button"
              tabindex="0"
            >
              Soldier
            </span>
          </div>
        </div>
      {/if}
    {/if} -->

    <div class="buttons-wrapper add-gating">
      <select class="selector" bind:value={newGating.contract_name}>
        <option value="" hidden disabled>Select</option>
        {#each availableContracts.filter((contract) => (
          !topicGatings.map((gate) => (gate.contract_name)).includes(contract)
        )) as gating}
          <option value={gating}>{gating}</option>
        {/each}
      </select>
      <button on:click={handleAddGating} disabled={!newGating.contract_name}>Gate Story</button>
    </div>
  </div>
{/await}

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
