<!-- WritingStyleComp.svelte -->
<script>
  import Dropdown from './Dropdown.svelte';
  import Slider from './Slider.svelte';

  export let formData;
  export let setFormData = () => {};

  function handleChangeWritingStyle(event, key) {
    setFormData({
      ...formData,
      writingStyle: { ...formData.writingStyle, [key]: event.target.value },
    });
  }

  const handleSliderChange = (newValue, toneProperty) => {
    setFormData({
      ...formData,
      tone: {
        ...formData.tone,
        [toneProperty]: newValue,
      },
    });
  };
</script>

<Dropdown name="Build Writing Style">
  <div class="buttons-wrapper">
    <label for="tense">Tense:</label>
    <select
      id="tense"
      class="selector"
      bind:value={formData.writingStyle.Tense}
      on:change={(e) => handleChangeWritingStyle(e, 'Tense')}
    >
      <option value="PastTense">Past Tense</option>
      <option value="PresentTense">Present Tense</option>
      <option value="FutureTense">Future Tense</option>
    </select>
  </div>

  <div class="buttons-wrapper">
    <label for="style">Style:</label>
    <select
      id="style"
      class="selector"
      bind:value={formData.writingStyle.Style}
      on:change={(e) => handleChangeWritingStyle(e, 'Style')}
    >
      <option value="Descriptive">Descriptive</option>
      <option value="Narrative">Narrative</option>
      <option value="Expository">Expository</option>
    </select>
  </div>

  <div class="buttons-wrapper">
    <label for="voice">Voice:</label>
    <select
      id="voice"
      class="selector"
      bind:value={formData.writingStyle.Voice}
      on:change={(e) => handleChangeWritingStyle(e, 'Voice')}
    >
      <option value="Active">Active</option>
      <option value="Passive">Passive</option>
    </select>
  </div>

  <div class="input-container">
    <label class="section-title" for="point-of-view">Point of View</label>
    <textarea
      id="point-of-view"
      class="story-input"
      placeholder="Specify the perspective of the story—first-person, second-person, or third-person—and whose eyes we experience the journey through."
      rows="2"
      bind:value={formData.premise}
    ></textarea>
  </div>

  <hr>

  {#each Object.keys(formData.tone) as toneProperty}
    <Slider
      label={toneProperty}
      id={toneProperty.toLowerCase()}
      name={`tone.${toneProperty}`}
      value={formData.tone[toneProperty]}
      on:change={(event) => handleSliderChange(event.detail, toneProperty)}
    />
  {/each}
</Dropdown>

<style>
  textarea {
    width: 80vw;
    min-height: 10vh;
    max-height: 100vh;
  }

  @media only screen and (max-width: 600px) {
    .selector {
      width: 85vw;
      padding-block: 0.5em;
    }

    textarea {
      min-height: 20vh;
    }
  }
</style>
