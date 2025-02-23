<script>
  import Blank from './create/Blank.svelte';
  import Parameters from './create/Parameters.svelte';

  let selectedComponent = 'Parameters';

  function showBlank() {
    selectedComponent = 'Blank';
  }

  function showParameters() {
    selectedComponent = 'Parameters';
  }
</script>

<div class="toggle-buttons">
  <button on:click={showParameters}> Show Parameters </button>
  <button on:click={showBlank}> Show Blank </button>
</div>

<div class="create-content">
  {#if selectedComponent === 'Blank'}
    <Blank />
  {:else}
    <Parameters />
  {/if}
</div>

<style>
  .toggle-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: center;
  }

  .create-content {
    display: flex;
    justify-content: center;
  }
</style>
