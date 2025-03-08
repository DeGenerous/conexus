<!-- PromptRadioButtons.svelte -->
<script lang="ts">
  export let parameters: string[] = ['none', 'min', 'standard', 'max'];
  export let inputValue = 1;
  export let hints: Nullable<string[]> = null;
  export let sliderValue: any = null;

  const setOptions = () => {
    const options: {id: number, value: string}[] = [];
    for (let i = 1; i <= parameters.length; i++) {
      options.push({id: i, value: parameters[i - 1]})
    }
    return options;
  }

  const options = setOptions();

  function handleChange() {
    const activeValue = options.filter((option) => option.id == inputValue)[0].value;
    // console.log(activeValue)
    sliderValue = activeValue;
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
  {#if hints}
    {#key inputValue}
      <h3>{hints[inputValue - 1]}</h3>
    {/key}
  {/if}
</div>

<style>
  div {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 0.5vw;
  }

  ul {
    width: 100%;
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

  h3 {
    font-size: 1.25vw;
    line-height: 1.5;
  }

  input {
    width: 98%;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    div {
      width: 85vw;
      gap: 0.5em;
    }

    ul, input {
      width: inherit;
    }

    li, h3 {
      font-size: 1em;
    }
  }
</style>
