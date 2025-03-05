<script>
  export let label;
  export let id;
  export let name;
  export let value;
  export let onChange;

  const handleChange = (event) => {
    onChange(parseInt(event.target.value, 10));
  };

  $: if (value < 1) value = 1; else if (value > 100) value = 100;
</script>

<section class="buttons-wrapper">
  <label for={id}>{label}</label>
  <div class="buttons-wrapper slider-wrapper">
    <input
      class="slider"
      type="range"
      min="1"
      max="100"
      {id}
      {name}
      bind:value
      on:input={handleChange}
    />
    <input
      class="slider-value"
      type="number" 
      min="1"
      max="100"
      bind:value/>
  </div>
</section>

<style>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    appearance: textfield;
  }

  section {
    width: 100%;
    justify-content: flex-end;
  }

  label {
    pointer-events: none;
  }

  .slider-wrapper {
    width: 77.5vw;
    background-color: rgb(22, 30, 95);
    box-shadow: 0 0 0.5vw #010020;
    padding: 1vw;
    border-radius: 1vw;
  }

  .slider {
    width: 97.5%;
    cursor: pointer;
  }

  .slider-value {
    appearance: textfield;
    width: 5%;
    text-align: center;
    color: rgb(51, 226, 230);
    background-color: rgba(1, 0, 32, 0.5);
    border-radius: 0.5vw;
    border: none;
    outline: none;
    font-size: 1.25vw;
  }

  @media only screen and (max-width: 600px) {
    .buttons-wrapper {
      flex-wrap: nowrap;
    }

    .slider-wrapper {
      width: 65vw;
      padding: 0.5em;
      border-radius: 0.5em;
    }

    .slider {
      width: 85%;
      cursor: pointer;
    }

    .slider-value {
      width: 15%;
      color: rgb(51, 226, 230);
      font-size: 1em;
      border-radius: 0.5em;
    }
  }
</style>
