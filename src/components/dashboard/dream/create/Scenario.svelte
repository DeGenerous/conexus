<script lang="ts">
  import { tablePrompt } from '@stores/dream.svelte';
  import Dropdown from '../../../utils/Dropdown.svelte';

  let newWinningScenario: string = $state('');
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

  let newLosingScenario: string = $state('');
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

  let newKeyEvent: string = $state('');
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
  <h4>
    Winning Scenarios{$tablePrompt.winningScenarios.length
      ? ': ' + $tablePrompt.winningScenarios.length
      : ''}
  </h4>
  {#if $tablePrompt.winningScenarios.length > 0}
    <ul class="winning-scenarios flex">
      {#each $tablePrompt.winningScenarios as scenario, index}
        <li class="flex">
          <p>{scenario}</p>
          <button class="red-btn" onclick={() => removeWinningScenario(index)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    id="winning-scenario"
    type="text"
    placeholder="How could the story reach a victorious ending? List the possibilities."
    bind:value={newWinningScenario}
  />
  <button onclick={addWinningScenario} disabled={newWinningScenario === ''}>
    Add Winning Scenario
  </button>

  <hr />

  <h4>
    Losing Scenarios{$tablePrompt.losingScenarios.length
      ? ': ' + $tablePrompt.losingScenarios.length
      : ''}
  </h4>
  {#if $tablePrompt.losingScenarios.length > 0}
    <ul class="losing-scenarios flex">
      {#each $tablePrompt.losingScenarios as scenario, index}
        <li class="flex">
          <p>{scenario}</p>
          <button class="red-btn" onclick={() => removeLosingScenario(index)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    id="losing-scenario"
    type="text"
    placeholder="How could the story end as a failure? List the possibilities."
    bind:value={newLosingScenario}
  />
  <button onclick={addLosingScenario} disabled={newLosingScenario === ''}>
    Add Losing Scenario
  </button>

  <hr />

  <h4>
    Key Events{$tablePrompt.keyEvents.length
      ? ': ' + $tablePrompt.keyEvents.length
      : ''}
  </h4>
  {#if $tablePrompt.keyEvents.length > 0}
    <ul class="key-events flex">
      {#each $tablePrompt.keyEvents as event, index}
        <li class="flex">
          <p>{event}</p>
          <button class="red-btn" onclick={() => removeKeyEvent(index)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    id="key-event"
    type="text"
    placeholder="What major events shape the story? List key twists, challenges, or turning points."
    bind:value={newKeyEvent}
  />
  <button onclick={addKeyEvent} disabled={newKeyEvent === ''}>
    Add Key Event
  </button>
</Dropdown>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  h4 {
    text-align: center !important;
  }

  input {
    width: 100%;
    max-width: unset;
    text-align: left;
  }

  ul {
    li {
      transition: 0.3s ease-in-out;
      padding: 0.5rem;
      border-radius: 0.5rem;
      @include gray(0.5);
      @include box-shadow;

      @include respond-up(small-desktop) {
        flex-direction: row;

        p {
          text-align: left;
        }
      }

      &:hover,
      &:active {
        @include bright;
        @include scale-up(1.01);
        @include box-shadow(deep);
      }

      p {
        @include white-txt;
      }

      button {
        flex: none;
      }
    }

    &.winning-scenarios {
      li {
        @include deep-green(0.5);
      }
    }

    &.losing-scenarios {
      li {
        @include deep-red(0.5);
      }
    }

    &.key-events {
      li {
        @include blue(0.5);
      }
    }
  }
</style>
