<!-- Scenarios.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';

  import Dropdown from './Dropdown.svelte';

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
  <h3>Winning Scenario</h3>
  {#if winningScenarios.length > 0}
    <ul class="container-wrapper winning-scenarios">
      {#each winningScenarios as scenario, index}
        <li class="buttons-wrapper">
          <h3>{scenario}</h3>
          <button class="red-button" on:click|preventDefault={() => removeWinningScenario(index)}
            >Remove</button
          >
        </li>
        <hr />
      {/each}
    </ul>
  {/if}
  <input
    class="story-input"
    type="text"
    placeholder="How does the story reach a happy or victorious ending?"
    bind:value={winningScenario}
  />
  <button class="primary-button" on:click|preventDefault={addWinningScenario}
    >Add Winning Scenario</button
  >

  <hr>

  <h3>Losing Scenario</h3>
  {#if losingScenarios.length > 0}
    <ul class="container-wrapper losing-scenarios">
      {#each losingScenarios as scenario, index}
        <li class="buttons-wrapper">
          <h3>{scenario}</h3>
          <button class="red-button" on:click|preventDefault={() => removeLosingScenario(index)}
            >Remove</button
          >
        </li>
        <hr />
      {/each}
    </ul>
  {/if}
  <input
    class="story-input"
    type="text"
    placeholder="What leads to failure, loss, or tragedy?"
    bind:value={losingScenario}
  />
  <button class="primary-button" on:click|preventDefault={addLosingScenario}
    >Add Winning Scenario</button
  >
</Dropdown>

<style>
  .winning-scenarios,
  .losing-scenarios {
    gap: 1vw;
  }

  .winning-scenarios h3,
  .losing-scenarios h3 {
    color: rgba(51, 226, 230, 0.9);
    line-height: 2.5vw;
  }

  .story-input {
    width: 95%;
  }

  @media only screen and (max-width: 600px) {
    .winning-scenarios,
    .losing-scenarios {
      gap: 1em;
    }

    .winning-scenarios h3,
    .losing-scenarios h3 {
      line-height: 1.5em;
    }

    .winning-scenarios li,
    .losing-scenarios li {
      flex-direction: column;
      gap: 1em;
    }
  }
</style>
