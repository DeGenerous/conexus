<script lang="ts">
  import countries from '../../../data/countries.json';

  import RadioSlider from './RadioSlider.svelte';
  import Scenario from './Scenario.svelte';
  import Characters from './Characters.svelte';
  import WritingStyle from './WritingStyle.svelte';

  let response = '';
  let fullResponse = '';
  let imageResponse = '';

  // let formData: TestPromptRequest = {
  let formData = {
    setting: '',
    style: 'Optional',
    premise: '',
    exposition: '',
    firstAct: '',
    pov: '',
    winningScenarios: [],
    losingScenarios: [],
    mainCharacter: {
      name: '',
      description: '',
      psychology: '',
      physicality: '',
    },
    sideCharacters: [],
    relationships: '',
    writingStyle: {
      Tense: 'PresentTense',
      Style: 'Descriptive',
      Voice: 'Active',
    },
    tone: {
      Optimistic: 10,
      Pessimistic: 15,
      Sarcastic: 20,
      Assertive: 6,
      Aggressive: 5,
      Passionate: 1,
      Entertaining: 7,
      Serious: 10,
      Educational: 1,
      Persuasive: 2,
      Motivating: 2,
      Curious: 19,
      Humoristic: 5,
      Surreal: 8,
    },
    difficulty: 'standard',
    length: 'standard',
    interactivity: 'standard',
    language: 'English',
  };

  const styleOptions = [
    'Realist',
    'Retro',
    'Anime',
    'Graphic Novel',
    'Cartoon',
    'Abstract',
    'Futuristic',
    'Black & White',
  ];

  const genreOptions = [
    'Action',
    'Romance',
    'Sci-Fi',
    'Fantasy',
    'Horror',
    'Thriller',
    'Comedy',
    'History',
    'Drama',
    'Mystery',
    'Sport',
    'Biopic',
    'Psychological',
    'War',
    'Crime',
  ];

  const fontOptions = [
    'PT Serif Sans',
    'Arial',
    'Monospase',
    'Times New Roman',
  ];

  const missingData: {
    genre: string;
    font: string;
  } = {
    genre: 'Action',
    font: 'PT Serif Sans',
  };

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const capitalize = (input: string) =>
    input.charAt(0).toUpperCase() + input.slice(1);

  async function handleSubmit() {
    try {
      const res = await fetch('/api/generatePrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      fullResponse = data.full;
      response = data.short;
      imageResponse = data.image_prompt;
    } catch (error) {
      console.error(error);
    }
  }
</script>

<form class="container-wrapper" on:submit={handleSubmit}>
  <!-- Style, (Genre) -->
  <div class="buttons-wrapper">
    <div class="input-container">
      <label for="genre">Pick a Genre</label>
      <select id="genre" class="selector" bind:value={missingData.genre}>
        {#each genreOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>

    <div class="input-container">
      <label for="genre">Pick a Style</label>
      <select id="genre" class="selector" bind:value={formData.style}>
        <option value="Optional" selected={true}>Optional</option>
        {#each styleOptions as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Language, Interactivity, Difficulty, Length, (Font) -->
  <div class="dream-box">
    <div class="buttons-wrapper">
      <h2>Text</h2>
      <div class="container">
        <div class="input-container">
          <label for="language">Language</label>
          <select id="language" class="selector" bind:value={formData.language}>
            {#each countryOptions as opts}
              <option value={opts.value}>{opts.label}</option>
            {/each}
          </select>
        </div>

        <div class="input-container">
          <label for="font">Font</label>
          <select id="font" class="selector">
            {#each fontOptions as font}
              <option value={font}>{font}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Interactivity</h2>
      <div class="container">
        <div class="input-container">
          <label for="language">Frequency</label>
          <select
            id="language"
            class="selector"
            bind:value={formData.interactivity}
          >
            {#each ['min', 'standard', 'max'] as option}
              <option value={option}>{capitalize(option)}</option>
            {/each}
          </select>
        </div>

        <div class="input-container">
          <label for="font">Difficulty</label>
          <select id="font" class="selector" bind:value={formData.difficulty}>
            {#each ['min', 'standard', 'max'] as option}
              <option value={option}>{capitalize(option)}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Length</h2>
      <div class="container">
        <RadioSlider />
      </div>
    </div>
  </div>

  <!-- Setting, Premise, Exposition, First Act -->
  <div class="dream-box">
    <div class="buttons-wrapper">
      <h2>Set Premise</h2>
      <textarea
        id="premise"
        class="story-input dream-textfield"
        placeholder="Summarize the core of your story—who the main character is, what challenge they face, and what’s at stake in their journey."
        rows="2"
        bind:value={formData.premise}
      ></textarea>
    </div>

    <div class="buttons-wrapper">
      <h2>Set Environment</h2>
      <textarea
        id="setting"
        class="story-input dream-textfield"
        placeholder="Describe the time and place where your story unfolds, whether it's a futuristic city, a medieval kingdom, a distant galaxy, or somewhere beyond imagination."
        rows="2"
        bind:value={formData.setting}
      ></textarea>
    </div>

    <div class="buttons-wrapper">
      <h2>Set Exposition</h2>
      <textarea
        id="exposition"
        class="story-input dream-textfield"
        placeholder="Set the stage for your story—introduce the world, key events leading up to the present, and any important background details the reader needs to know."
        rows="2"
        bind:value={formData.exposition}
      ></textarea>
    </div>

    <div class="buttons-wrapper">
      <h2>Set First Action</h2>
      <textarea
        id="first-act"
        class="story-input dream-textfield"
        placeholder="Describe how the story begins—introduce the main character, their current situation, and the inciting event that sets the plot in motion."
        rows="2"
        bind:value={formData.firstAct}
      ></textarea>
    </div>
  </div>

  <!-- Characters -->
  <Characters
    mainCharacter={formData.mainCharacter}
    sideCharacters={formData.sideCharacters}
    setRelationships={formData.relationships}
  />

  <!-- Scenarios -->
  <Scenario
    winningScenarios={formData.winningScenarios}
    losingScenarios={formData.losingScenarios}
  />

  <!-- Writing Style -->
  <WritingStyle {formData} />

  <div class="buttons-wrapper">
    <button on:click|preventDefault>SAVE</button>
    <button on:click|preventDefault>PREVIEW</button>
    <button class="green-button" type="submit">CREATE A DREAM</button>
  </div>
</form>

<style>
  .dream-box {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-end;
    gap: 0.25vw;
    background-color: rgb(22, 30, 95);
    box-shadow: 0 0 0.5vw #010020;
    border-radius: 1.5vw;
    padding: 0.25vw;
    padding-left: 1vw;
  }

  .dream-box .buttons-wrapper {
    flex-wrap: nowrap;
  }

  .buttons-wrapper .container {
    flex-direction: row;
    padding: 1.5vw;
  }

  textarea {
    width: 90vw;
    min-height: 10vh;
    max-height: 100vh;
  }

  .dream-textfield {
    width: 70vw;
    border: none;
    background-color: rgba(1, 0, 32, 0.75);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.5);
  }

  @media only screen and (max-width: 600px) {
    .dream-box {
      width: 100vw;
      gap: 1em;
      padding: 1em 0;
      border-radius: 0;
    }

    .dream-box .buttons-wrapper {
      width: 100vw;
      flex-direction: column;
    }

    .buttons-wrapper .container {
      width: 95vw;
      flex-direction: column;
      padding: 1em;
    }

    .selector {
      width: 85vw;
      padding-block: 0.5em;
    }

    textarea {
      min-height: 20vh;
    }

    .dream-textfield {
      width: 90vw;
    }
  }
</style>
