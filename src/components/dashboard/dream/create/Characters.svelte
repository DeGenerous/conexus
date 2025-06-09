<script lang="ts">
  import dreamData from '@constants/dream';
  import { tablePrompt } from '@stores/dream.svelte';

  import Dropdown from './Dropdown.svelte';
  import NewCharacter from './NewCharacter.svelte';

  let newSideCharacter: Character = {
    name: '',
    description: '',
    physicality: '',
    psychology: '',
  };
  const addSideCharacter = () => {
    $tablePrompt.sideCharacters = [
      ...$tablePrompt.sideCharacters,
      newSideCharacter,
    ];
    newSideCharacter = {
      name: '',
      description: '',
      physicality: '',
      psychology: '',
    };
  };
  const removeSideCharacter = (index: number) => {
    $tablePrompt.sideCharacters = $tablePrompt.sideCharacters.filter(
      (character, nr) => {
        return nr !== index;
      },
    );
  };

  let newRelationship: Relationship = {
    type: 'neutral',
    details: '',
    connection: ['', ''],
  };
  const addRelationship = () => {
    $tablePrompt.relationships = [
      ...$tablePrompt.relationships,
      newRelationship,
    ];
    newRelationship = {
      type: 'neutral',
      details: '',
      connection: ['', ''],
    };
  };
  const removeRelationship = (index: number) => {
    $tablePrompt.relationships = $tablePrompt.relationships.filter(
      (character, nr) => {
        return nr !== index;
      },
    );
  };

  $: relationshipExamples =
    newRelationship.type === 'friends'
      ? 'Family, Mentor/Protégé, Allies of Convenience, Unbreakable Bond...'
      : newRelationship.type === 'enemies'
        ? 'Betrayer, Rival, Respectful Opponent, Mortal Enemy, Frenemy...'
        : 'Stranger, Tenuous Trust, Business Relationship, Mysterious Past...';

  const setRelationshipColor = (type: string, opacity: number = 1) => {
    if (type === 'friends') return `rgba(0, 185, 55, ${opacity})`;
    if (type === 'enemies') return `rgba(255, 60, 64, ${opacity})`;
    return `rgba(150, 150, 150, ${opacity})`;
  };

  $: characterValidation =
    newSideCharacter.name && newSideCharacter.description;

  $: relationsValidation =
    newRelationship.connection[0] &&
    newRelationship.connection[1] &&
    newRelationship.connection[0] !== newRelationship.connection[1];
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<Dropdown name="Add Characters">
  <div class="container-wrapper character-container">
    <h2>Main Character</h2>
    <NewCharacter bind:character={$tablePrompt.mainCharacter} />
  </div>

  <hr />

  <div class="container-wrapper">
    <h2>Side Characters</h2>
    {#if $tablePrompt.sideCharacters.length > 0}
      <ul class="container-wrapper characters-container">
        {#each $tablePrompt.sideCharacters as character, index}
          <li class="container added-prompt side-character">
            <h2 class="character-name">{character.name}</h2>
            <div class="flex-row">
              <h2>Description</h2>
              <h3>{character.description}</h3>
            </div>
            {#if character.physicality}
              <div class="flex-row">
                <h2>Physicality</h2>
                <h3>{character.physicality}</h3>
              </div>
            {/if}
            {#if character.psychology}
              <div class="flex-row">
                <h2>Psychology</h2>
                <h3>{character.psychology}</h3>
              </div>
            {/if}
            <button
              class="red-button"
              on:click={() => removeSideCharacter(index)}
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <NewCharacter bind:character={newSideCharacter} />
  </div>

  {#if (newSideCharacter.name || newSideCharacter.description) && !characterValidation}
    <p class="validation">
      Provide both Name and Description for the new character
    </p>
  {/if}
  <button on:click={addSideCharacter} disabled={!characterValidation}
    >Add Side Character</button
  >

  <hr />

  <h2>Relationships</h2>
  {#if $tablePrompt.relationships.length > 0}
    <ul class="container-wrapper characters-container relationships-container">
      {#each $tablePrompt.relationships as { type, details, connection }, index}
        <li
          class="container added-prompt side-character"
          style="background-color: {setRelationshipColor(type, 0.5)}"
        >
          <h2 class="character-name">{connection[0]}</h2>
          {#if details}
            <h3 class="relationship-details">
              {details}
            </h3>
          {/if}
          <h2 class="character-name">{connection[1]}</h2>
          <button class="red-button" on:click={() => removeRelationship(index)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <div class="container-wrapper dream-container relationship">
    <div class="flex-row">
      <h2>Type</h2>
      <div class="container dream-radio-buttons">
        {#each dreamData.relationship as type}
          <span
            class:active={type === newRelationship.type}
            role="button"
            tabindex="0"
            on:click={() => (newRelationship.type = type as any)}
          >
            {dreamData.capitalize(type)}
          </span>
        {/each}
      </div>
    </div>

    <div class="flex-row">
      <h2>Details</h2>
      <input
        id="relationship-details"
        class="dream-input dream-textfield"
        type="text"
        placeholder={'E.g. ' + relationshipExamples}
        bind:value={newRelationship.details}
      />
    </div>

    <div class="flex-row">
      <h2>Connection</h2>
      <div class="container relationship-characters">
        <select
          class="selector"
          style="border-color: {setRelationshipColor(
            newRelationship.type,
            0.75,
          )}"
          bind:value={newRelationship.connection[0]}
        >
          <option value="" selected={true} disabled hidden>Select</option>
          {#if $tablePrompt.mainCharacter.name}
            <option value={$tablePrompt.mainCharacter.name}
              >{$tablePrompt.mainCharacter.name}</option
            >
          {/if}
          {#if $tablePrompt.sideCharacters}
            {#each $tablePrompt.sideCharacters as { name }}
              <option value={name}>{name}</option>
            {/each}
          {:else}
            <option value="" disabled>None</option>
          {/if}
        </select>

        <div
          class="relationship-line"
          style="background-color: {setRelationshipColor(
            newRelationship.type,
            0.75,
          )}"
        ></div>

        <select
          class="selector"
          style="border-color: {setRelationshipColor(
            newRelationship.type,
            0.75,
          )}"
          bind:value={newRelationship.connection[1]}
        >
          <option value="" selected={true} disabled hidden>Select</option>
          {#if $tablePrompt.mainCharacter.name}
            <option value={$tablePrompt.mainCharacter.name}
              >{$tablePrompt.mainCharacter.name}</option
            >
          {/if}
          {#if $tablePrompt.sideCharacters}
            {#each $tablePrompt.sideCharacters as { name }}
              <option value={name}>{name}</option>
            {/each}
          {:else}
            <option value="" disabled>None</option>
          {/if}
        </select>
      </div>
    </div>
  </div>

  {#if $tablePrompt.sideCharacters.length < 1 && !$tablePrompt.mainCharacter.name}
    <p class="validation">There is no characters added.</p>
  {/if}

  {#if newRelationship.connection[0] && newRelationship.connection[1] && newRelationship.connection[0] == newRelationship.connection[1]}
    <p class="validation">
      A character cannot have a relationship with themselves! Please select two
      different characters.
    </p>
  {/if}

  <button on:click={addRelationship} disabled={!relationsValidation}
    >Add Relationship</button
  >
</Dropdown>

<style>
  .characters-container {
    gap: 1vw;
  }

  .side-character {
    box-shadow: 0 0.25vw 0.5vw #010020;
    gap: 1vw;
  }

  .side-character h2 {
    line-height: 1.5;
  }

  .side-character .flex-row {
    justify-content: flex-end;
  }

  .side-character h3 {
    width: 85%;
    color: #dedede;
    line-height: 1.5;
    background-color: rgba(22, 30, 95, 0.75);
    padding: 1vw;
    border-radius: 1.5vw;
    box-shadow: inset 0 0 0.5vw #010020;
  }

  .character-name {
    color: rgb(51, 226, 230);
  }

  .relationship {
    width: auto;
  }

  #relationship-details {
    resize: none;
  }

  .dream-radio-buttons {
    width: 74vw !important;
  }

  .relationship-characters {
    width: 74vw;
    justify-content: center !important;
    gap: 0;
  }

  .relationship-characters .selector {
    border-width: 0.25vw;
  }

  .relationship-line {
    width: 10vw;
    height: 0.5vw;
  }

  .relationships-container {
    flex-flow: row wrap;
  }

  .relationships-container h2 {
    color: #dedede;
  }

  .relationship-details {
    text-align: center;
    width: auto !important;
    background-color: rgba(1, 0, 32, 0.5) !important;
  }

  @media only screen and (max-width: 600px) {
    .characters-container {
      gap: 1em;
    }

    .side-character {
      width: 100%;
      gap: 1em;
    }

    .side-character .flex-row {
      justify-content: center;
    }

    .side-character h2 {
      display: none;
    }

    .side-character h3 {
      width: 100%;
      line-height: 2;
    }

    .character-name {
      display: block !important;
    }

    .relationship {
      width: 100vw;
    }

    .dream-radio-buttons {
      width: 95vw !important;
    }

    .relationship-characters {
      width: 95vw;
      gap: 1em;
    }

    .relationship-line {
      display: none;
    }

    .relationship-details {
      padding: 0.5em 1em !important;
    }
  }
</style>
