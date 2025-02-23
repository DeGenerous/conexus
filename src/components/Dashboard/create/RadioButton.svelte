<!-- PromptRadioButtons.svelte -->
<script>
  export let formData;
  export let setFormData;
  export let type;

  function handleChange(event) {
    setFormData({ ...formData, [type]: event.target.value });
  }
</script>

<div class="radio-group">
  {#each ['min', 'standard', 'max'] as option}
    <label class="custom-radio" class:selected={formData[type] === option}>
      {option.charAt(0).toUpperCase() + option.slice(1)}
      <input
        type="radio"
        bind:group={formData[type]}
        value={option}
        on:change={handleChange}
      />
    </label>
  {/each}
</div>

<style>
  .selected {
    font-weight: bold;
  }
</style>
