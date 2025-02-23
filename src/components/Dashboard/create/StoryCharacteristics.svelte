<script>
  import Dropdown from './Dropdown.svelte';
  import SliderField from './SliderField.svelte';
  import { writable } from 'svelte/store';

  export let formData;
  export let setFormData;

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

<Dropdown name="Story Characteristics">
  {#each Object.keys(formData.tone) as toneProperty}
    <SliderField
      label={toneProperty}
      id={toneProperty.toLowerCase()}
      name={`tone.${toneProperty}`}
      value={formData.tone[toneProperty]}
      on:change={(event) => handleSliderChange(event.detail, toneProperty)}
    />
  {/each}
</Dropdown>
