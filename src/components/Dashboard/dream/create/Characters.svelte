<script>
  import dreamData from '../../../../data/dream';

  import Dropdown from './Dropdown.svelte';
  import NewCharacter from './NewCharacter.svelte';

  const sideCharacters = [
    {
      name: 'Captain Orion Vale',
      description: 'A decorated starship captain renowned for leading dangerous expeditions into the unknown. Once a fearless leader, he now wrestles with the guilt of a failed mission that cost his crew dearly.',
      physicality: 'Rugged and battle-scarred, with silver-streaked black hair and sharp blue eyes that hold years of wisdom. Wears a reinforced navy-blue flight suit with insignias from past conquests and a worn leather belt carrying his laser pistol.',
      psychology: 'A deeply conflicted strategist who masks his self-doubt with unwavering confidence. He believes redemption lies beyond the stars and is willing to risk everything to uncover the truth hidden in deep space.',
    },
    {
      name: 'Lady Selene Duskbane',
      description: 'A powerful sorceress exiled from the Celestial Court for wielding forbidden magic. Now wandering the realm as an outcast, she seeks the ancient artifact that can restore her place among the stars.',
      physicality: 'Ethereal and graceful, with long silver hair flowing like liquid moonlight. Her violet eyes shimmer with arcane energy, and she wears a flowing obsidian robe embroidered with celestial runes. A crescent-shaped staff glows faintly in her grasp.',
      psychology: 'Cold and calculating, yet burdened by the loneliness of exile. Though she projects an aura of mystery and control, she secretly longs for companionship and the chance to prove her loyalty once more.',
    }
  ]

  let sideCharacter = {
    name: '',
    description: '',
    physicality: '',
    psychology: '',
  }

  let sourceCharacter = '';
  let targetCharacter = '';
  let selectedRealtionship = 'neutral';

  $: relationshipExamples = selectedRealtionship === 'friends'
    ? 'Family, Mentor/Protégé, Allies of Convenience, Unbreakable Bond...'
    : selectedRealtionship === 'enemies'
      ? 'Betrayer, Rival, Respectful Opponent, Mortal Enemy, Frenemy...'
      : 'Stranger, Tenuous Trust, Business Relationship, Mysterious Past...';

  const setRelationshipColor = (type) => {
    if (type === 'friends') return 'rgba(0, 185, 55, 0.75)';
    if (type === 'enemies') return 'rgba(255, 60, 64, 0.75)';
    return 'rgba(150, 150, 150, 0.75)';
  }
</script>

<Dropdown name="Add Characters">
  <div class="container-wrapper character-container">
    <h2>Main Character</h2>
    <NewCharacter />
  </div>

  <hr>

  <div class="container-wrapper">
    <h2>Side Characters</h2>
    {#if sideCharacters.length > 0}
      <ul class="container-wrapper characters-container">
        {#each sideCharacters as character, index}
          <li class="container added-prompt side-character">
            <h2 class="character-name">{character.name}</h2>
            <div class="buttons-wrapper">
              <h2>Description</h2>
              <h3>{character.description}</h3>
            </div>
            {#if character.physicality}
              <div class="buttons-wrapper">
                <h2>Physicality</h2>
                <h3>{character.physicality}</h3>
              </div>
            {/if}
            {#if character.psychology}
              <div class="buttons-wrapper">
                <h2>Psychology</h2>
                <h3>{character.psychology}</h3>
              </div>
            {/if}
            <button class="red-button">Remove</button>
          </li>
        {/each}
      </ul>
    {/if}
    <NewCharacter />
  </div>
  
  <button>Add Side Character</button>

  <hr>

  <h2>Relationships</h2>

  <div class="container-wrapper dream-box relationship">
    <div class="buttons-wrapper">
      <h2>Type</h2>
      <div class="container dream-radio-buttons">
        {#each dreamData.relationship as type}
          <span
            class:active={type === selectedRealtionship}
            role="button"
            tabindex="0"
          >
            {dreamData.capitalize(type)}
          </span>
        {/each}
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Details</h2>
      <input
        id="relationship-details"
        class="story-input dream-textfield"
        type="text"
        placeholder={"E.g. " + relationshipExamples}
      />
    </div>

    <div class="buttons-wrapper">
      <h2>Characters</h2>
      <div class="container relationship-characters">
        <select class="selector" style="border-color: {setRelationshipColor(selectedRealtionship)}">
          <option value="" selected={true} disabled hidden>Select</option>
          <option value="" disabled>None</option>
          <!-- {#each dreamData.characters as character}
            <option value={character}>{character}</option>
          {/each} -->
        </select>

        <div
          class="relationship-line"
          style="background-color: {setRelationshipColor(selectedRealtionship)}"
        ></div>

        <select class="selector" style="border-color: {setRelationshipColor(selectedRealtionship)}">
          <option value="" selected={true} disabled hidden>Select</option>
          <option value="" disabled>None</option>
          <!-- {#each dreamData.characters as character}
            <option value={character}>{character}</option>
          {/each} -->
        </select>
      </div>
    </div>
  </div>

  <button>Add Relationship</button>
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

  .side-character .buttons-wrapper {
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

  @media only screen and (max-width: 600px) {
    .characters-container {
      gap: 1em;
    }

    .side-character {
      width: 100%;
      gap: 1em;
    }

    .side-character .buttons-wrapper {
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
      /* flex-flow: column nowrap; */
    }

    .relationship-line {
      display: none;
    }
  }
</style>
