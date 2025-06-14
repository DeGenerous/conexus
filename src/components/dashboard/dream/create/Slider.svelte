<script lang="ts">
  let {
    parameters = ['none', 'min', 'standard', 'max'],
    inputValue = 1,
    hints = null,
    sliderValue = $bindable(null),
  }: {
    parameters?: string[];
    inputValue?: number;
    hints?: Nullable<string[]>;
    sliderValue?: Nullable<string>;
  } = $props();

  const setOptions = () => {
    const options: { id: number; value: string }[] = [];
    for (let i = 1; i <= parameters.length; i++) {
      options.push({ id: i, value: parameters[i - 1] });
    }
    return options;
  };

  const options = setOptions();

  function handleChange() {
    const activeValue = options.filter((option) => option.id == inputValue)[0]
      .value;
    sliderValue = activeValue;
  }
</script>

<div class="flex">
  <ul class="flex-row">
    {#each options as { id, value }}
      <button
        class="void-btn dream-radio-btn"
        class:active={id == inputValue}
        onclick={() => {
          inputValue = id;
          handleChange();
        }}
      >
        {value}
      </button>
    {/each}
  </ul>
  <input
    type="range"
    min="1"
    max={options.length}
    step="1"
    bind:value={inputValue}
    onchange={handleChange}
  />
  {#if hints}
    {#key inputValue}
      <p>{hints[inputValue - 1]}</p>
    {/key}
  {/if}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    flex-direction: column !important;
    gap: 0.25rem;

    ul {
      width: 100%;
      justify-content: space-between;

      .dream-radio-btn {
        @include font(small);
      }
    }

    input {
      width: 98%;
    }

    p {
      @include white-txt(0.5);
      @include font(caption);
    }
  }
</style>
