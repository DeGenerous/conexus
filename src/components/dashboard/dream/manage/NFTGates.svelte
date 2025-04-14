<script lang="ts">
  import { AdminApp } from '@lib/admin';

  let admin = new AdminApp();

  export let classGates: ClassGate[] = [];
  export let fetchClasses: () => Promise<void>;
  export let selectInput: (event: Event) => void;

  let newClassName: string = '';
  let newClassRangeFrom: number | undefined;
  let newClassRangeTo: number | undefined;

  async function handleDeleteClass(id: number) {
    admin.deleteClassGate(id).then(fetchClasses);
  }

  const validateRangeFrom = () => {
    if (newClassRangeFrom === undefined) return;
    if (newClassRangeFrom < 1) newClassRangeFrom = 1;
    if (newClassRangeFrom > 999) newClassRangeFrom = 999;

    if (newClassRangeTo === undefined) return;
    if (newClassRangeFrom > newClassRangeTo)
      newClassRangeFrom = newClassRangeTo - 1;
  };

  const validateRangeTo = () => {
    if (newClassRangeTo === undefined) return;
    if (newClassRangeTo < 2) newClassRangeTo = 2;
    if (newClassRangeTo > 1000) newClassRangeTo = 1000;

    if (newClassRangeFrom === undefined) return;
    if (newClassRangeTo < newClassRangeFrom)
      newClassRangeTo = newClassRangeFrom + 1;
  };

  $: classValidation = newClassName && newClassRangeFrom && newClassRangeTo;

  async function handleAddClass() {
    admin
      .createNewClassGate(newClassName, newClassRangeFrom!, newClassRangeTo!)
      .then(fetchClasses);
    newClassName = '';
    newClassRangeFrom = undefined;
    newClassRangeTo = undefined;
  }
</script>

<div class="dream-box blur classes-list">
  <div class="buttons-wrapper">
    <h2>NFT Classes</h2>
    <div class="container buttons-wrapper added-classes">
      {#if classGates.length > 0}
        {#each classGates as { id, name, start_token_id, end_token_id }}
          <div class="nft-class">
            <h3>{name}: {start_token_id} - {end_token_id}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-100 -100 200 200"
              class="close-svg"
              stroke="rgba(32, 0, 1, 0.85)"
              stroke-width="30"
              stroke-linecap="round"
              on:click={async () => await handleDeleteClass(id)}
              on:keydown={async (event) =>
                event.key === 'Enter' && (await handleDeleteClass(id))}
              role="button"
              tabindex="0"
            >
              <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
            </svg>
          </div>
        {/each}
      {:else}
        <h3>There is no Classes for Potentials yet.</h3>
      {/if}
    </div>
  </div>

  <hr />

  <section class="new-class">
    <div class="buttons-wrapper">
      <h2>Provide Class Name:</h2>
      <input
        class="story-input"
        placeholder="Enter Name"
        bind:value={newClassName}
      />
    </div>

    <div class="buttons-wrapper">
      <h2>Select IDs Range:</h2>
      <div class="buttons-wrapper class-range">
        <input
          class="story-input range-input"
          placeholder="from"
          bind:value={newClassRangeFrom}
          type="number"
          min="1"
          max="999"
          on:click|preventDefault={selectInput}
          on:input={validateRangeFrom}
        />
        <h3>-</h3>
        <input
          class="story-input range-input"
          placeholder="to"
          bind:value={newClassRangeTo}
          type="number"
          min="2"
          max="1000"
          on:click|preventDefault={selectInput}
          on:input={validateRangeTo}
        />
      </div>
    </div>
  </section>

  <button
    class="orange-button"
    on:click={handleAddClass}
    disabled={!classValidation}>Add New Class</button
  >
</div>

<style>
  .classes-list {
    width: auto;
    align-items: center;
    max-width: 95vw;
  }

  .classes-list * {
    white-space: nowrap;
    text-align: center;
  }

  .added-classes {
    flex-flow: row wrap !important;
    justify-content: center !important;
  }

  .nft-class {
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

  .nft-class h3 {
    color: rgba(255, 255, 255, 0.9);
  }

  .new-class {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding-bottom: 0.5vw;
  }

  .range-input {
    width: 7vw;
    padding: 0.5vw;
  }

  @media only screen and (max-width: 600px) {
    .classes-list {
      width: 100vw;
      max-width: none;
    }

    .nft-class {
      gap: 1em;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    .class-range {
      flex-direction: row;
    }

    .new-class {
      gap: 1em;
      padding: 0;
    }

    .classes-list input {
      width: 90vw;
    }

    .range-input {
      width: 35vw !important;
    }
  }
</style>
