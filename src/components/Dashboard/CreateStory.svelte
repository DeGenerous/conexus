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

<div class="buttons-wrapper">
  <h3>Format:</h3>
  <button on:click={showParameters}>Table</button>
  <button on:click={showBlank}>Open</button>
</div>

<div class="container-wrapper">
  {#if selectedComponent === 'Blank'}
    <Blank />
  {:else}
    <Parameters />
  {/if}
</div>
