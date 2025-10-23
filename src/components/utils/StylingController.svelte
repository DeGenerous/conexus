<script lang="ts">
  import { onMount } from 'svelte';

  import {
    customFont,
    customStyling,
    updateFont,
    updateStyling,
    getStoredCustomization,
  } from '@stores/customization.svelte';

  // update FONT in localStorage after every change
  $effect(() => {
    $customFont && updateFont();
  });

  // update STYLING in localStorage after every change
  $effect(() => {
    $customStyling && updateStyling();
  });

  onMount(() => {
    getStoredCustomization();
  });
</script>

{#if $customFont && $customStyling}
  <section class="flex gap-8">
    <div class="fade-in transparent-container flex-row">
      <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
        <label for="text-color">Main color</label>
        <input
          id="text-color"
          type="color"
          bind:value={$customFont.baseColor}
        />
      </span>

      <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
        <label for="title-color">Highlight color</label>
        <input
          id="title-color"
          type="color"
          bind:value={$customFont.accentColor}
        />
      </span>

      <span class="flex-row pad-8 round-8 gap-8 dark-glowing">
        <label for="bg-color">Background color</label>
        <input id="bg-color" type="color" bind:value={$customStyling.bgColor} />
      </span>
    </div>

    <div class="font-family fade-in transparent-container flex-row">
      <span class="flex-row">
        <label for="custom-font">Font</label>
        <select id="custom-font" bind:value={$customFont.family}>
          <option value="PT Serif Caption">Default (serif)</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Lora">Lora</option>
          <option value="Roboto">Roboto</option>
          <option value="Verdana">Verdana</option>
          <option value="Monospace">Monospace</option>
          <option value="Courier Prime">Courier prime</option>
          <option value="Comic Neue">Comic Neue</option>
          <option value="Caveat">Caveat</option>
        </select>
      </span>

      <span class="flex-row">
        <label for="text-size">Main text size</label>
        <select id="text-size" bind:value={$customFont.baseSize}>
          <option value="caption">Minimal</option>
          <option value="small">Compact</option>
          <option value="body">Standard</option>
          <option value="h5">Large</option>
          <option value="h4">Maximal</option>
        </select>
      </span>

      <span class="flex-row">
        <label for="title-size">Highlight size</label>
        <select id="title-size" bind:value={$customFont.accentSize}>
          <option value="caption">Minimal</option>
          <option value="small">Compact</option>
          <option value="body">Standard</option>
          <option value="h5">Large</option>
          <option value="h4">Maximal</option>
        </select>
      </span>

      <span class="flex-row gap-8">
        {#if $customFont.family !== 'PT Serif Caption'}
          <button
            class:active-btn={$customFont.bold}
            onclick={() => ($customFont!.bold = !$customFont!.bold)}
          >
            bold
          </button>
        {/if}

        {#if $customFont.family !== 'Caveat'}
          <button
            class:active-btn={$customFont.italic}
            onclick={() => ($customFont!.italic = !$customFont!.italic)}
          >
            italic
          </button>
        {/if}

        <button
          class:active-btn={$customFont.shadow}
          onclick={() => ($customFont!.shadow = !$customFont!.shadow)}
        >
          shadow
        </button>
      </span>
    </div>

    <div class="fade-in transparent-container flex-row">
      <label for="bg-opacity">Background image visibility</label>
      <span class="bg-image-slider flex-row pad-8 round-8 gap-8 dark-glowing">
        <input
          id="bg-opacity"
          type="range"
          min="0"
          max="100"
          step="5"
          bind:value={$customStyling.bgPictureOpacity}
        />
        <p>{$customStyling.bgPictureOpacity}%</p>
      </span>
    </div>

    <div class="fade-in transparent-container flex-row">
      <label for="layout">Layout</label>
      <button
        class:active-btn={$customStyling.optionsContainer}
        onclick={() =>
          ($customStyling!.optionsContainer =
            !$customStyling!.optionsContainer)}
      >
        options frame
      </button>

      <button
        id="option-selector-btn"
        class:active-btn={$customStyling.optionSelector}
        onclick={() =>
          ($customStyling!.optionSelector = !$customStyling!.optionSelector)}
      >
        option selector
      </button>

      <button
        class:active-btn={$customStyling.boxShadow}
        onclick={() => ($customStyling!.boxShadow = !$customStyling!.boxShadow)}
      >
        box shadow
      </button>
    </div>
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .transparent-container {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;

    .bg-image-slider {
      width: 100%;

      input {
        width: 85%;
      }

      p {
        flex: none;
      }

      @include respond-up(tablet) {
        width: auto;

        input {
          width: clamp(250px, 50vw, 20rem);
        }
      }
    }
  }

  select {
    width: 12rem;

    @include respond-up(tablet) {
      width: 15rem;
    }
  }

  #option-selector-btn {
    display: none;

    @include respond-up(tablet) {
      display: flex;
    }
  }
</style>
