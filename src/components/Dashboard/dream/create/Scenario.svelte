<!-- Scenarios.svelte -->
<script>
  import Dropdown from './Dropdown.svelte';

  export let winningScenarios = [
    'The protagonist defeats the villain and restores peace to their world.',
    'Two characters overcome obstacles and end up together.',
    'The main character outsmarts their captors and finds freedom.',
    'A flawed character atones for past mistakes and earns a second chance.',
    'The protagonist succeeds in an impossible challenge, proving everyone wrong.',
    'Warring factions reach a truce, avoiding complete destruction.',

  ];
  export let losingScenarios = [
    'The protagonist fights bravely but ultimately falls to the villain.',
    'The hero wins but dies in the process, leaving behind a legacy.',
    'The main character succumbs to temptation, becoming the very evil they fought.',
    'An adventure into the unknown ends in disaster, leaving no survivors.',
  ];
  export let keyEvents = [
    'The protagonist receives an invitation or challenge that sets the story in motion.',
    'An early challenge tests the hero’s skills and sets the stakes.',
    'A close ally is revealed to be working against the hero.',
    'The protagonist learns they were always destined for something greater.',
    'The hero faces their lowest point, nearly giving up.',
    'A wise figure imparts crucial advice or knowledge before disappearing.',
    'The protagonist discovers a dangerous power they must control.',
    'A countdown begins, forcing the hero into a desperate attempt to succeed.',
    'The final battle or confrontation between the protagonist and antagonist.',
    'A major reveal changes everything the character thought they knew.'
  ];

  let winningScenario = '';
  let losingScenario = '';
  let keyEvent = '';
</script>

<Dropdown name="Describe Scenarios">
  <h3>Winning Scenario</h3>
  {#if winningScenarios.length > 0}
    <ul class="container-wrapper winning-scenarios">
      {#each winningScenarios as scenario, index}
        <li class="buttons-wrapper added-prompt">
          <h3>{scenario}</h3>
          <button class="red-button">Remove</button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    class="story-input"
    type="text"
    placeholder="How does the story reach a happy or victorious ending? List key moments that lead to success."
    bind:value={winningScenario}
  />
  <button class="primary-button">Add Winning Scenario</button>

  <hr>

  <h3>Losing Scenario</h3>
  {#if losingScenarios.length > 0}
    <ul class="container-wrapper losing-scenarios">
      {#each losingScenarios as scenario, index}
        <li class="buttons-wrapper added-prompt">
          <h3>{scenario}</h3>
          <button class="red-button">Remove</button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    class="story-input"
    type="text"
    placeholder="What leads to failure, loss, or tragedy? List key missteps and dangers that lead to downfall."
    bind:value={losingScenario}
  />
  <button class="primary-button">Add Winning Scenario</button>

  <hr>

  <h3>Key Events</h3>
  {#if losingScenarios.length > 0}
    <ul class="container-wrapper losing-scenarios">
      {#each keyEvents as event, index}
        <li class="buttons-wrapper added-prompt">
          <h3>{event}</h3>
          <button class="red-button">Remove</button>
        </li>
      {/each}
    </ul>
  {/if}
  <input
    class="story-input"
    type="text"
    placeholder="What major events shape the story? List key twists, challenges, or turning points."
    bind:value={keyEvent}
  />
  <button class="primary-button">Add Winning Scenario</button>
</Dropdown>

<style>
  h3 {
    color: #dedede;
  }

  .winning-scenarios,
  .losing-scenarios {
    gap: 1vw;
  }

  .story-input {
    width: 85vw;
  }

  @media only screen and (max-width: 600px) {
    .winning-scenarios,
    .losing-scenarios {
      gap: 1em;
    }

    .story-input {
      width: 90vw;
    }
  }
</style>
