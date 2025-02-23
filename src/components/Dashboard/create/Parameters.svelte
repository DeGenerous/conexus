<script lang="ts">
  import countries from '../../../data/countries.json';

  let response = '';
  let fullResponse = '';
  let imageResponse = '';

  let formData = {
    setting: '',
    style: '',
    exposition: '',
    firstAct: '',
    pov: '',
    winningScenario: [],
    losingScenario: [],
    premise: '',
    mainCharacter: {
      name: '',
      description: '',
      psychology: '',
      physicality: '',
    },
    sideCharacters: [],
    relationships: '',
    writingStyle: {
      Tense: 'PastTense',
      Style: 'Descriptive',
      Voice: 'Active',
    },
    difficulty: 'Standard',
    length: 'Standard',
    interactivity: 'Standard',
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

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: country.name,
  }));

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

<div id="playground_parameters">
  <form onsubmit={handleSubmit}>
    <label for="language">Language</label>
    <select id="language" bind:value={formData.language}>
      {#each countryOptions as opts}
        <option value={opts.value}>{opts.label}</option>
      {/each}
    </select>

    <label for="difficulty">Difficulty</label>
    <input type="text" id="difficulty" bind:value={formData.difficulty} />

    <label for="setting">Setting</label>
    <input type="text" id="setting" bind:value={formData.setting} required />

    <label for="style">Style</label>

    <label for="premise">Premise</label>
    <textarea id="premise" bind:value={formData.premise} required></textarea>

    <button type="submit">Generate</button>
  </form>
</div>

<style>
  #playground_parameters {
    position: relative;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
    color: white;
  }

  select,
  option {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    color: black;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.5rem;
    border-radius: 8px;
    color: black;
  }

  button {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem;
    border-radius: 8px;
    margin-top: 1rem;
    cursor: pointer;
    border: none;
  }

  button:hover {
    background-color: #2563eb;
  }
</style>
