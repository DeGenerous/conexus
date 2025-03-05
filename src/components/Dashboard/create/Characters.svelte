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

  <!-- Relationships -->
  <h2>Relationships</h2>
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

  @media only screen and (max-width: 600px) {
    .characters-container {
      gap: 1em;
    }

    .characters-container h3 {
      line-height: 2;
    }
  }
</style>
