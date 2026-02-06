<script lang="ts">
  import { tablePrompt } from '@stores/dream.svelte';

  let newWinningScenario: string = $state('');
  const addWinningScenario = () => {
    if (newWinningScenario === '') return;
    $tablePrompt.winning_scenarios = [
      ...($tablePrompt.winning_scenarios ?? []),
      newWinningScenario,
    ];
    newWinningScenario = '';
  };
  const removeWinningScenario = (index: number) => {
    $tablePrompt.winning_scenarios = (
      $tablePrompt.winning_scenarios ?? []
    ).filter((scenario, nr) => {
      return nr !== index;
    });
  };

  let newLosingScenario: string = $state('');
  const addLosingScenario = () => {
    if (newLosingScenario === '') return;
    $tablePrompt.losing_scenarios = [
      ...($tablePrompt.losing_scenarios ?? []),
      newLosingScenario,
    ];
    newLosingScenario = '';
  };
  const removeLosingScenario = (index: number) => {
    $tablePrompt.losing_scenarios = (
      $tablePrompt.losing_scenarios ?? []
    ).filter((scenario, nr) => {
      return nr !== index;
    });
  };

  let newKeyEvent: string = $state('');
  const addKeyEvent = () => {
    if (newKeyEvent === '') return;
    $tablePrompt.key_events = [...($tablePrompt.key_events ?? []), newKeyEvent];
    newKeyEvent = '';
  };
  const removeKeyEvent = (index: number) => {
    $tablePrompt.key_events = ($tablePrompt.key_events ?? []).filter(
      (event, nr) => {
        return nr !== index;
      },
    );
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

<section class="flex">
  <div class="scenario-section">
    <h4>
      Winning Scenarios{$tablePrompt.winning_scenarios?.length
        ? ': ' + $tablePrompt.winning_scenarios.length
        : ''}
    </h4>
    {#if $tablePrompt.winning_scenarios?.length && $tablePrompt.winning_scenarios.length > 0}
      <ul class="winning-scenarios flex">
        {#each $tablePrompt.winning_scenarios as scenario, index}
          <li class="flex">
            <p>{scenario}</p>
            <button
              class="red-btn"
              onclick={() => removeWinningScenario(index)}
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <input
      id="winning-scenario"
      type="text"
      placeholder="e.g. &quot;The detective solves the case and clears their name&quot;"
      bind:value={newWinningScenario}
    />
    <p class="transparent-white-txt caption-font">
      Ways the story could end well. Add as many as you like.
    </p>
    <button onclick={addWinningScenario} disabled={newWinningScenario === ''}>
      Add Winning Scenario
    </button>
  </div>

  <hr />

  <div class="scenario-section">
    <h4>
      Losing Scenarios{$tablePrompt.losing_scenarios?.length
        ? ': ' + $tablePrompt.losing_scenarios.length
        : ''}
    </h4>
    {#if $tablePrompt.losing_scenarios?.length && $tablePrompt.losing_scenarios.length > 0}
      <ul class="losing-scenarios flex">
        {#each $tablePrompt.losing_scenarios as scenario, index}
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
      placeholder="e.g. &quot;The villain escapes and the city falls into chaos&quot;"
      bind:value={newLosingScenario}
    />
    <p class="transparent-white-txt caption-font">
      Ways the story could end badly. Creates real stakes.
    </p>
    <button onclick={addLosingScenario} disabled={newLosingScenario === ''}>
      Add Losing Scenario
    </button>
  </div>

  <hr />

  <div class="scenario-section">
    <h4>
      Key Events{$tablePrompt.key_events?.length
        ? ': ' + $tablePrompt.key_events.length
        : ''}
    </h4>
    {#if $tablePrompt.key_events?.length && $tablePrompt.key_events.length > 0}
      <ul class="key-events flex">
        {#each $tablePrompt.key_events as event, index}
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
      placeholder="e.g. &quot;A trusted ally betrays the group at the worst possible moment&quot;"
      bind:value={newKeyEvent}
    />
    <p class="transparent-white-txt caption-font">
      Major plot beats, twists, or turning points you want the story to include.
    </p>
    <button onclick={addKeyEvent} disabled={newKeyEvent === ''}>
      Add Key Event
    </button>
  </div>
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    width: 100%;
  }

  .scenario-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    h4 {
      width: auto;
    }
  }

  h4 {
    text-align: center !important;
  }

  input {
    width: 100%;
    max-width: unset;
    text-align: left;
  }

  ul {
    margin-block: 1rem;

    li {
      transition: 0.3s ease;
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
