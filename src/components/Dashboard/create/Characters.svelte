<script>
  import { writable } from 'svelte/store';
  import Dropdown from './Dropdown.svelte';
  import NewCharacter from './NewCharacter.svelte';

  export let mainCharacter;
  export let sideCharacters = [];
  export let setRelationships;

  let newSideCharacter = writable({
    name: '',
    description: '',
    physicality: '',
    psychology: '',
  });

  let sourceCharacter = '';
  let targetCharacter = '';
  let relationshipType = 'neutral';
  $: relationshipColor = relationshipType === 'friends'
    ? 'rgba(0, 185, 55, 0.5)'
    : relationshipType === 'enemies'
      ? 'rgba(255, 60, 64, 0.5)'
      : 'rgba(150, 150, 150, 0.5)'

  $: relationship = sourceCharacter + ' is ' + relationshipType + ' with ' + targetCharacter;

  function handleAddSideCharacter() {
    newSideCharacter.update((character) => {
      if (!character.name || !character.description) return character;
      sideCharacters = [...sideCharacters, character];
      return { name: '', description: '', physicality: '', psychology: '' };
    });
  }

  function handleRemoveSideCharacter(index) {
    sideCharacters = sideCharacters.filter((_, i) => i !== index);
  }
</script>

<Dropdown name="Characters">
  <div class="container-wrapper character-container">
    <h2>Main Character</h2>
    <NewCharacter character={mainCharacter} />
  </div>

  <hr>

  <div class="container-wrapper">
    <h2>Side Characters</h2>
    {#if sideCharacters.length > 0}
      <ul class="container-wrapper characters-container">
        {#each sideCharacters as character, index}
          <li class="container side-character">
            <h2>{character.name}</h2>
            <h3>{character.description}</h3>
            <h3>{character.physicality}</h3>
            <h3>{character.psychology}</h3>
            <button
              class="red-button"
              on:click|preventDefault={() => handleRemoveSideCharacter(index)}
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <NewCharacter character={newSideCharacter} />
  </div>
  
  <button on:click|preventDefault>Add Side Character</button>

  <hr>

  <div class="container-wrapper">
    <h2>Relationships</h2>
    <div class="buttons-wrapper relationship" style="background-color: {relationshipColor}">
      <div class="input-container">
        <label for="source">Source Character</label>
        <input
          class="story-input"
          type="text"
          placeholder="Enter character's name"
          bind:value={sourceCharacter}
        />
      </div>

      <div class="input-container">
        <label for="target">Target Character</label>
        <input
          class="story-input"
          type="text"
          placeholder="Enter character's name"
          bind:value={targetCharacter}
        />
      </div>
    </div>

    <div class="buttons-wrapper">
      <select class="selector" bind:value={relationshipType}>
        {#each ['friends', 'neutral', 'enemies'] as option}
          <option value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
        {/each}
      </select>
      <button on:click|preventDefault>Add Relationship</button>
    </div>
  </div>
</Dropdown>

<style>
  .characters-container {
    gap: 1vw;
  }

  .side-character {
    background-color: rgb(22, 30, 95);
    box-shadow: 0 0 0.5vw #010020;
  }

  .characters-container h2 {
    color: rgba(51, 226, 230, 0.9);
  }

  .characters-container h3 {
    line-height: 1.5;
  }

  .relationship {
    width: 70vw;
    flex-flow: column nowrap;
    background-color: rgba(150, 150, 150, 0.5);
    box-shadow: inset 0 0 0.5vw #010020;
    padding-block: 1vw;
    border-radius: 1.5vw;
  }

  .relationship label {
    color: rgb(51, 226, 230)
  }

  .relationship input {
    text-align: center;
    background-color: rgba(1, 0, 32, 0.75);
  }

  @media only screen and (max-width: 600px) {
    .characters-container {
      gap: 1em;
    }

    .characters-container h3 {
      line-height: 2;
    }

    .relationship {
      width: 90vw;
      padding-block: 1em;
      border-radius: 0.5em;
    }
  }
</style>
