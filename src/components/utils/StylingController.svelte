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

  const fontOptions = [
    'Hanken Grotesk',
    'Inter',
    'Courier Prime',
    'Merriweather',
    'Lora',
    'Caveat',
    'PT Serif Caption',
    'Cinzel',
    'Exo 2',
    'Open Sans',
    'Comic Neue',
  ];
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
          {#each fontOptions as font}
            <option value={font}>{font}</option>
          {/each}
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
</style>
