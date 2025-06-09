<script lang="ts">
  import { tablePrompt } from '@stores/dream.svelte';
  import Dropdown from './Dropdown.svelte';

  let newWinningScenario: string = '';
  const addWinningScenario = () => {
    if (newWinningScenario === '') return;
    $tablePrompt.winningScenarios = [
      ...$tablePrompt.winningScenarios,
      newWinningScenario,
    ];
    newWinningScenario = '';
  };
  const removeWinningScenario = (index: number) => {
    $tablePrompt.winningScenarios = $tablePrompt.winningScenarios.filter(
      (scenario, nr) => {
        return nr !== index;
      },
    );
  };

  let newLosingScenario: string = '';
  const addLosingScenario = () => {
    if (newLosingScenario === '') return;
    $tablePrompt.losingScenarios = [
      ...$tablePrompt.losingScenarios,
      newLosingScenario,
    ];
    newLosingScenario = '';
  };
  const removeLosingScenario = (index: number) => {
    $tablePrompt.losingScenarios = $tablePrompt.losingScenarios.filter(
      (scenario, nr) => {
        return nr !== index;
      },
    );
  };

  let newKeyEvent: string = '';
  const addKeyEvent = () => {
    if (newKeyEvent === '') return;
    $tablePrompt.keyEvents = [...$tablePrompt.keyEvents, newKeyEvent];
    newKeyEvent = '';
  };
  const removeKeyEvent = (index: number) => {
    $tablePrompt.keyEvents = $tablePrompt.keyEvents.filter((event, nr) => {
      return nr !== index;
    });
  };

  function handleEnterKey(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.repeat) return;
    const activeInput = document.activeElement as HTMLElement;
    switch (activeInput.id) {
      case 'winning-scenario': {
        event.preventDefault();
        addWinningScenario();
        break;
      }
      case 'losing-scenario': {
        event.preventDefault();
        addLosingScenario();
        break;
      }
      case 'key-event': {
        event.preventDefault();
        addKeyEvent();
        break;
      }
    }
  }
</script>

<svelte:window on:keypress={handleEnterKey} />

<Dropdown name="Describe Scenarios">
  <h3>Winning Scenario</h3>
  {#if $tablePrompt.winningScenarios.length > 0}
    <ul class="container-wrapper winning-scenarios">
      {#each $tablePrompt.winningScenarios as scenario, index}
        <li class="flex-row added-prompt">
          <h3>{scenario}</h3>
          <button
            class="red-button"
            on:click={() => removeWinningScenario(index)}
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    id="winning-scenario"
    class="dream-input"
    type="text"
    placeholder="How does the story reach a happy or victorious ending? List key moments that lead to success."
    bind:value={newWinningScenario}
  />
  <button on:click={addWinningScenario} disabled={newWinningScenario === ''}
    >Add Winning Scenario</button
  >

  <hr />

  <h3>Losing Scenario</h3>
  {#if $tablePrompt.losingScenarios.length > 0}
    <ul class="container-wrapper losing-scenarios">
      {#each $tablePrompt.losingScenarios as scenario, index}
        <li class="flex-row added-prompt">
          <h3>{scenario}</h3>
          <button
            class="red-button"
            on:click={() => removeLosingScenario(index)}
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    id="losing-scenario"
    class="dream-input"
    type="text"
    placeholder="What leads to failure, loss, or tragedy? List key missteps and dangers that lead to downfall."
    bind:value={newLosingScenario}
  />
  <button on:click={addLosingScenario} disabled={newLosingScenario === ''}
    >Add Losing Scenario</button
  >

  <hr />

  <h3>Key Events</h3>
  {#if $tablePrompt.keyEvents.length > 0}
    <ul class="container-wrapper losing-scenarios">
      {#each $tablePrompt.keyEvents as event, index}
        <li class="flex-row added-prompt">
          <h3>{event}</h3>
          <button class="red-button" on:click={() => removeKeyEvent(index)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    id="key-event"
    class="dream-input"
    type="text"
    placeholder="What major events shape the story? List key twists, challenges, or turning points."
    bind:value={newKeyEvent}
  />
  <button on:click={addKeyEvent} disabled={newKeyEvent === ''}
    >Add Key Event</button
  >
</Dropdown>

<style>
  h3 {
    color: #dedede;
  }

  .winning-scenarios,
  .losing-scenarios {
    gap: 1vw;
  }

  .dream-input {
    width: 85vw;
  }

  @media only screen and (max-width: 600px) {
    .winning-scenarios,
    .losing-scenarios {
      gap: 1em;
    }

    .dream-input {
      width: 90vw;
    }
  }
</style>
