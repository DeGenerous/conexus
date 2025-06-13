<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { AdminApp } from '@lib/admin';

  import CloseSVG from '@components/icons/Close.svelte';

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

<div class="dream-container">
  <div class="flex">
    <h4>NFT Classes</h4>
    <div class="container">
      {#if classGates.length > 0}
        {#each classGates as { id, name, start_token_id, end_token_id }}
          <button class="void-btn transition flex-row pad-8 pad-inline round-8 shad">
            <h5>{name}: {start_token_id} - {end_token_id}</h5>
            <CloseSVG
              onclick={async () => await handleDeleteClass(id)}
              voidBtn={true}
              dark={true}
            />
          </button>
        {/each}
      {:else}
        <p class="validation">There is no Classes for Potentials yet</p>
      {/if}
    </div>
  </div>

  <hr />

  <div class="flex-row">
    <h4>New Class</h4>
    <div class="new-class container flex-row">
      <div class="input-container">
        <label for="class-name">Class name</label>
        <input
          id="class-name"
          placeholder="Enter Name"
          bind:value={newClassName}
        />
      </div>
      <div class="input-container">
        <label for="ids-range">Select IDs range</label>
        <span class="flex-row">
          <input
            placeholder="from"
            bind:value={newClassRangeFrom}
            type="number"
            min="1"
            max="999"
            on:click|preventDefault={selectInput}
            on:input={validateRangeFrom}
            disabled={!newClassRangeTo}
          />
          <span>-</span>
          <input
            placeholder="to"
            bind:value={newClassRangeTo}
            type="number"
            min="2"
            max="1000"
            on:click|preventDefault={selectInput}
            on:input={validateRangeTo}
          />
        </span>
      </div>
    </div>
  </div>

  <button
    class="orange-btn"
    on:click={handleAddClass}
    disabled={!classValidation}>Add New Class</button
  >
</div>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  .dream-container {
    .container {
      flex-wrap: wrap;
      justify-content: center;
      
      @include respond-up(tablet) {
        &.new-class {
          flex-wrap: nowrap;
        }
      }

      button {
        @include dark-red(1, text);
        @include orange(0.85);

        &:hover,
        &:active {
          @include orange;
          @include scale-up(soft);
          @include box-shadow(deep);
        }

        h5 {
          color: inherit;
          text-shadow: none;
        }
      }

      input {
        min-width: 7.5rem !important;
      }
    }
  }
</style>
