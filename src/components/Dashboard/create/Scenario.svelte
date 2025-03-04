<!-- Scenarios.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  export let winningScenarios = [];
  export let losingScenarios = [];
  const dispatch = createEventDispatcher();
  let winningScenario = '';
  let losingScenario = '';

  function addWinningScenario() {
    if (winningScenario) {
      dispatch('updateWinning', [...winningScenarios, winningScenario]);
      winningScenario = '';
    }
  }

  function removeWinningScenario(index) {
    dispatch(
      'updateWinning',
      winningScenarios.filter((_, i) => i !== index),
    );
  }

  function addLosingScenario() {
    if (losingScenario) {
      dispatch('updateLosing', [...losingScenarios, losingScenario]);
      losingScenario = '';
    }
  }

  function removeLosingScenario(index) {
    dispatch(
      'updateLosing',
      losingScenarios.filter((_, i) => i !== index),
    );
  }
</script>

<Dropdown name="Scenarios">
  <div class="text-lg font-bold text-center mb-4 text-white">
    <label for="winningScenario">Winning Scenario</label>
    <ul>
      {#each winningScenarios as scenario, index}
        <li>
          {scenario}
          <button on:click={() => removeWinningScenario(index)}>Remove</button>
        </li>
      {/each}
    </ul>
    <input bind:value={winningScenario} placeholder="Winning scenario..." />
    <button on:click={addWinningScenario}>Add Winning Scenario</button>
  </div>

  <div class="text-lg font-bold text-center mb-4 text-white">
    <label for="losingScenario">Losing Scenario</label>
    <ul>
      {#each losingScenarios as scenario, index}
        <li>
          {scenario}
          <button on:click={() => removeLosingScenario(index)}>Remove</button>
        </li>
      {/each}
    </ul>
    <input bind:value={losingScenario} placeholder="Losing scenario..." />
    <button on:click={addLosingScenario}>Add Losing Scenario</button>
  </div>
</Dropdown>

<style>
  ul {
    list-style-type: none;
  }
</style>
