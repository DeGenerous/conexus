<script lang="ts">
  import countries from '../../../data/countries.json';

  import RadioSlider from './RadioSlider.svelte';

  let response = '';
  let fullResponse = '';
  let imageResponse = '';

  let formData: TestPromptRequest = {
    setting: '',
    style: 'Optional',
    premise: '',
    exposition: '',
    firstAct: '',
    pov: '',
    winningScenario: [],
    losingScenario: [],
    mainCharacter: {
      name: '',
      description: '',
      psychology: '',
      physicality: '',
    },
    sideCharacters: [],
    relationships: '',
    writingStyle: {
      Tense: 'past',
      Style: 'descriptive',
      Voice: 'active',
    },
    tone: {
      Optimistic: 1,
      Pessimistic: 1,
      Sarcastic: 1,
      Assertive: 1,
      Aggressive: 1,
      Passionate: 1,
      Entertaining: 1,
      Serious: 1,
      Educational: 1,
      Persuasive: 1,
      Motivating: 1,
      Curious: 1,
      Humoristic: 1,
      Surreal: 1,
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

<form class="container-wrapper" onsubmit={handleSubmit}>
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

  <!-- Setting, Premise, Exposition, First Act, Point of View -->

  <!-- Scenarios -->

  <!-- Characters -->

  <!-- Writing Style -->

  <!-- Story Characteristics -->
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
  }
</style>
