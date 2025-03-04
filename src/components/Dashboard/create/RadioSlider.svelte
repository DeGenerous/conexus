<!-- PromptRadioButtons.svelte -->
<script>
  export let formData = undefined;
  export let setFormData = undefined;
  export let type = undefined;

  const options = [
    {
      id: 1,
      value: 'max',
    },
    {
      id: 2,
      value: 'standard',
    },
    {
      id: 3,
      value: 'min',
    },
  ];

  let inputValue = 2;

  function handleChange() {
    const activeValue = options.filter((option) => option.id == inputValue)[0]
      .value;
    // setFormData({ ...formData, [type]: event.target.value });
    console.log(activeValue);
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
<div>
  <ul class="options">
    {#each options as { id, value }}
      <li
        class:active={id == inputValue}
        on:click={() => {
          inputValue = id;
          handleChange();
        }}
        role="button"
        tabindex="0"
      >
        {value}
      </li>
    {/each}
  </ul>
  <input
    type="range"
    min="1"
    max={options.length}
    step="1"
    bind:value={inputValue}
    on:change={handleChange}
  />
</div>

<!-- <div class="radio-group">
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
</div> -->

<style>
  div {
    width: 41.5vw;
  }

  ul {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  li {
    font-size: 1.25vw;
    color: rgba(56, 117, 250, 0.5);
    cursor: pointer;
  }

  li:hover,
  li:active {
    filter: brightness(125%);
  }

  .active {
    color: rgb(51, 226, 230);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  input {
    width: inherit;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    div {
      width: 85vw;
    }

    li {
      font-size: 1em;
    }
  }
</style>
