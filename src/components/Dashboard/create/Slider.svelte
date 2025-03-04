<script>
  export let label;
  export let id;
  export let name;
  export let value;
  export let onChange;

  const handleChange = (event) => {
    onChange(parseInt(event.target.value, 10));
  };
</script>

<div class="slider-field">
  <label for={id} class="slider-label">{label}</label>
  <div class="slider-container">
    <input
      type="range"
      min="1"
      max="100"
      {id}
      {name}
      bind:value
      on:input={handleChange}
      class="slider"
    />
    <span class="slider-value">{value}</span>
  </div>
</div>

<style>
  .slider-field {
    margin-bottom: 15px;
  }

  .slider-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .slider {
    flex: 1;
    cursor: pointer;
  }

  .slider-value {
    font-weight: bold;
  }
</style>
