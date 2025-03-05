<!-- WritingStyleComp.svelte -->
<script>
  import Dropdown from './Dropdown.svelte';
  export let formData;
  export let setFormData = () => {};

  function handleChangeWritingStyle(event, key) {
    setFormData({
      ...formData,
      writingStyle: { ...formData.writingStyle, [key]: event.target.value },
    });
  }
</script>

<Dropdown name="Writing Style">
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
</Dropdown>

<style>
    @media only screen and (max-width: 600px) {
      .selector {
        width: 85vw;
        padding-block: 0.5em;
      }
    }
</style>
