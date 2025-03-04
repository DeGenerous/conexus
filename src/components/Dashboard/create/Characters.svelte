<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Dropdown from './Dropdown.svelte';
  import RelationshipVisualizer from './RelationshipVisualizer.svelte';

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
  <div class="text-lg font-bold text-center mb-4 text-white">
    <label for="mainCharacter" class="block mb-1">Main Character</label>
    <!-- <NewCharacter bind:character={mainCharacter} /> -->
  </div>

  <div
    class="text-lg font-bold flex flex-col space-y-1 text-center items-center mb-4 text-white"
  >
    <label for="sideCharacters" class="block mb-1">Side Characters</label>
    <ul>
      {#each sideCharacters as character, index}
        <li>
          {character.name}: {character.description}
          <button
            class="text-white text-md bg-red-700 rounded-md p-1 m-2"
            on:click={() => handleRemoveSideCharacter(index)}
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
    <!-- <NewCharacter bind:character={$newSideCharacter} /> -->
    <button
      class="p-2 rounded-md bg-blue-600"
      on:click={handleAddSideCharacter}
    >
      Add Side Character
    </button>
  </div>

  <div class="text-lg font-bold text-center mb-4 text-white">
    <label for="relationship" class="block mb-1">Relationship</label>
    <!-- <RelationshipVisualizer
      {mainCharacter}
      {sideCharacters}
      {setRelationships}
    /> -->
  </div>
</Dropdown>
