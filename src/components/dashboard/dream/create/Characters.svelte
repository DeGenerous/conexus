<script lang="ts">
  import dreamData from '@constants/dream';
  import { tablePrompt } from '@stores/dream.svelte';

  import Dropdown from '@components/utils/Dropdown.svelte';
  import NewCharacter from '@components/dashboard/dream/create/NewCharacter.svelte';

  // ADD NEW SIDE CHARACTER

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

  // ADD NEW RELATIONSHIP

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

  // UTILS

  $: relationshipExamples =
    newRelationship.type === 'friends'
      ? 'Family, Mentor/Protégé, Allies of Convenience, Unbreakable Bond...'
      : newRelationship.type === 'enemies'
        ? 'Betrayer, Rival, Respectful Opponent, Mortal Enemy, Frenemy...'
        : 'Stranger, Tenuous Trust, Business Relationship, Mysterious Past...';

  $: characterValidation =
    newSideCharacter.name && newSideCharacter.description;

  $: relationsValidation =
    newRelationship.connection[0] &&
    newRelationship.connection[1] &&
    newRelationship.connection[0] !== newRelationship.connection[1];
</script>

<Dropdown name="Add Characters">
  <div class="character-data flex">
    <h3>Main Character</h3>
    <NewCharacter bind:character={$tablePrompt.mainCharacter} />
  </div>

  <hr />

  <!-- SIDE CHARACTERS -->

  <div class="character-data flex">
    <h3>
      Side Characters{$tablePrompt.sideCharacters.length
        ? ': ' + $tablePrompt.sideCharacters.length
        : ''}
    </h3>
    {#if $tablePrompt.sideCharacters.length > 0}
      <ul class="side-characters flex-row">
        {#each $tablePrompt.sideCharacters as character, index}
          <li class="flex transition">
            <h4 class="character-name">{character.name}</h4>
            <div class="input-container">
              <label for="side-character">Description</label>
              <p>{character.description}</p>
            </div>
            {#if character.physicality}
              <div class="input-container">
                <label for="side-character">Physicality</label>
                <p>{character.physicality}</p>
              </div>
            {/if}
            {#if character.psychology}
              <div class="input-container">
                <label for="side-character">Psychology</label>
                <p>{character.psychology}</p>
              </div>
            {/if}
            <button class="red-btn" onclick={() => removeSideCharacter(index)}>
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
  <button onclick={addSideCharacter} disabled={!characterValidation}>
    Add Side Character
  </button>

  <hr />

  <!-- CHARACTERS RELATIONSHIPS -->

  <h3>Relationships</h3>
  {#if $tablePrompt.relationships.length > 0}
    <ul class="relationships flex-row">
      {#each $tablePrompt.relationships as { type, details, connection }, index}
        <li class="flex transition {type}">
          <h4 class="character-name">{connection[0]}</h4>
          {#if details}
            <p>{details}</p>
          {/if}
          <h4 class="character-name">{connection[1]}</h4>
          <button class="red-btn" onclick={() => removeRelationship(index)}>
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <section class="relationship-data flex">
    <div class="flex-row">
      <h4>Type</h4>
      <span class="data-field flex-row">
        {#each dreamData.relationship as type}
          <button
            class="void-btn dream-radio-btn"
            class:active={type === newRelationship.type}
            onclick={() => (newRelationship.type = type as any)}
          >
            {type}
          </button>
        {/each}
      </span>
    </div>

    <div class="flex-row">
      <h4>Details</h4>
      <input
        id="relationship-details"
        class="data-field"
        type="text"
        placeholder={'E.g. ' + relationshipExamples}
        bind:value={newRelationship.details}
      />
    </div>

    <div class="flex-row">
      <h4>Connection</h4>
      <div class="connection data-field flex">
        <select
          class={newRelationship.type}
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

        <div class="relationship-line transition {newRelationship.type}"></div>

        <select
          class={newRelationship.type}
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
  </section>

  {#if $tablePrompt.sideCharacters.length < 1 && !$tablePrompt.mainCharacter.name}
    <p class="validation">There is no characters added</p>
  {:else if $tablePrompt.sideCharacters.length < 1 || ($tablePrompt.sideCharacters.length < 2 && !$tablePrompt.mainCharacter.name)}
    <p class="validation">
      You must have at least 2 characters to set up a relationship
    </p>
  {/if}

  {#if newRelationship.connection[0] && newRelationship.connection[1] && newRelationship.connection[0] == newRelationship.connection[1]}
    <p class="validation">
      A character cannot have a relationship with themselves, please select two
      different characters
    </p>
  {/if}

  <button onclick={addRelationship} disabled={!relationsValidation}>
    Add Relationship
  </button>
</Dropdown>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  // CHARACTERS

  .character-data {
    flex-direction: column;
  }

  .side-characters {
    flex-wrap: wrap;

    li {
      padding: 1rem;
      border-radius: 0.5rem;
      @include gray(0.25);
      @include box-shadow;

      &:hover,
      &:active {
        @include bright;
        @include scale-up(1.01);
        @include box-shadow(deep);
      }

      .character-name {
        width: auto;
        text-align: center;
        @include cyan(1, text);
      }

      div {
        // width: 100%;

        p {
          padding: 0.5rem;
          border-radius: 0.5rem;
          @include white-txt;
          @include dark-blue(0.5);
          @include box-shadow(soft, inset);
        }
      }

      button {
        flex: none;
      }

      @include respond-up(large-desktop) {
        max-width: 30rem;
      }
    }
  }

  // RELATIONSHIPS

  .relationships {
    flex-wrap: wrap;

    li {
      padding: 1rem;
      border-radius: 0.5rem;
      @include gray(0.25);
      @include box-shadow;

      &:hover,
      &:active {
        @include bright;
        @include scale-up(1.01);
        @include box-shadow(deep);
      }

      .character-name {
        width: 100%;
        text-align: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        @include white-txt;
        @include dark-blue(0.5);
        @include box-shadow(soft, inset);
      }

      p {
        text-transform: uppercase;
        @include white-txt(soft);
      }

      &.friends {
        @include deep-green(0.5);
      }

      &.enemies {
        @include deep-red(0.5);
      }

      &.neutral {
        @include blue(0.5);
      }
    }
  }

  .relationship-data {
    width: 100%;
    max-width: 60rem;
    padding: 1rem;
    border-radius: 1rem;
    @include gray(0.25);
    @include box-shadow;

    @include respond-up(small-desktop) {
      h4 {
        width: 10rem;
        flex: none;
        text-align: right;
      }
    }

    .data-field {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      flex-wrap: wrap;
      justify-content: space-around;
      @include dark-blue(0.5);
      @include box-shadow(soft, inset);

      &.connection {
        flex-flow: column nowrap;
        justify-content: center;
        gap: 0;

        .relationship-line {
          width: 0.5rem;
          height: 2rem;
          @include dark-blue;

          &.friends {
            @include deep-green;
          }

          &.enemies {
            @include deep-red;
          }

          &.neutral {
            @include blue;
          }
        }

        select {
          max-width: 15rem;
          z-index: 1;

          &.friends {
            border-color: $deep-green;
          }

          &.enemies {
            border-color: $deep-red;
          }

          &.neutral {
            border-color: $blue;
          }
        }

        @include respond-up(small-desktop) {
          flex-direction: row;

          .relationship-line {
            width: 10rem;
            height: 0.25rem;
          }
        }
      }
    }

    input {
      text-align: left;
      max-width: unset;
      animation: none !important;
    }
  }
</style>
