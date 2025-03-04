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
  <div>
    <label for="tense">Tense</label>
    <select
      bind:value={formData.writingStyle.Tense}
      on:change={(e) => handleChangeWritingStyle(e, 'Tense')}
    >
      <option value="PastTense">Past Tense</option>
      <option value="PresentTense">Present Tense</option>
      <option value="FutureTense">Future Tense</option>
    </select>
  </div>

  <div>
    <label for="style">Style</label>
    <select
      bind:value={formData.writingStyle.Style}
      on:change={(e) => handleChangeWritingStyle(e, 'Style')}
    >
      <option value="Descriptive">Descriptive</option>
      <option value="Narrative">Narrative</option>
      <option value="Expository">Expository</option>
    </select>
  </div>

  <div>
    <label for="voice">Voice</label>
    <select
      bind:value={formData.writingStyle.Voice}
      on:change={(e) => handleChangeWritingStyle(e, 'Voice')}
    >
      <option value="Active">Active</option>
      <option value="Passive">Passive</option>
    </select>
  </div>
</Dropdown>
