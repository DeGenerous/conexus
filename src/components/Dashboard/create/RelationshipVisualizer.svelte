<!-- NewCharacter.svelte -->
<script>
  import { writable } from 'svelte/store';
  export let character;

  function handleCharacterChange(event) {
    character[event.target.name] = event.target.value;
  }
</script>

<div class="flex flex-col space-y-2 w-full">
  <label for="name" class="block text-white font-bold">Name</label>
  <input
    type="text"
    id="name"
    name="name"
    bind:value={character.name}
    placeholder="e.g. Nick Sanchez"
    class="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
  />
  <label for="description" class="block text-white font-bold">Description</label
  >
  <input
    type="text"
    id="description"
    name="description"
    bind:value={character.description}
    placeholder="e.g. a powerful wizard, and part-time firefighter"
    class="w-full border-gray-300 text-black p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
  />
</div>
