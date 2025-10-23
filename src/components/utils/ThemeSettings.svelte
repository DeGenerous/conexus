<script lang="ts">
  import { onMount } from 'svelte';

  import {
    customThemes,
    customFont,
    customStyling,
    updateFont,
    updateStyling,
    getStoredCustomization,
  } from '@stores/customization.svelte';
  import { GetCache, SetCache, ClearCache, THEMES_KEY } from '@constants/cache';

  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';

  let {
    closeDialog = () => {},
    table = false,
  }: {
    closeDialog?: () => void;
    table?: boolean;
  } = $props();

  // update FONT in localStorage after every change
  $effect(() => {
    $customFont && updateFont();
  });

  // update STYLING in localStorage after every change
  $effect(() => {
    $customStyling && updateStyling();
  });

  onMount(() => {
    const storedThemes = GetCache<Nullable<CustomTheme[]>>(THEMES_KEY);
    if (storedThemes && storedThemes.length) {
      $customThemes = $customThemes.slice(0, 9).concat(storedThemes);
    }

    getStoredCustomization();
  });

  let selectedTheme = $state<Nullable<number>>(null);
  let newThemeName = $state<string>('CUSTOM THEME');

  // Set up current customization from the stored THEME-object
  const applyTheme = () => {
    $customFont = structuredClone($customThemes[selectedTheme!].font);
    $customStyling = structuredClone($customThemes[selectedTheme!].styling);
    selectedTheme = null;
    closeDialog();
  };

  // Add current customization as a THEME-object to the array and cache everything
  const handleAddTheme = () => {
    $customThemes[$customThemes.length] = {
      name: newThemeName,
      font: structuredClone($customFont),
      styling: structuredClone($customStyling),
    };
    newThemeName = 'CUSTOM THEME';
    cacheCustomThemes();
  };

  // Check if current customization settings are similar to some THEME-object
  const compareCurrentTheme = (theme: CustomTheme): boolean => {
    if (!$customFont || !$customStyling) return false;
    return (
      $customFont!.family === theme.font!.family &&
      $customFont!.baseSize === theme.font!.baseSize &&
      $customFont!.accentSize === theme.font!.accentSize &&
      $customFont!.baseColor === theme.font!.baseColor &&
      $customFont!.accentColor === theme.font!.accentColor &&
      $customFont!.bold === theme.font!.bold &&
      $customFont!.italic === theme.font!.italic &&
      $customFont!.shadow === theme.font!.shadow &&
      $customStyling!.boxShadow === theme.styling!.boxShadow &&
      $customStyling!.optionsContainer === theme.styling!.optionsContainer &&
      $customStyling!.optionSelector === theme.styling!.optionSelector &&
      $customStyling!.bgPictureOpacity === theme.styling!.bgPictureOpacity &&
      $customStyling!.bgColor === theme.styling!.bgColor
    );
  };

  // Check if user made any differences in customization, or just some THEME-object is used
  const anyThemeMatched = (): boolean =>
    $customThemes.some((theme) => {
      console.log('matching', theme);
      return compareCurrentTheme(theme);
    });

  // Cache only custom themes, first two THEME-objects we provide by default (dark/light)
  const cacheCustomThemes = () => {
    ClearCache(THEMES_KEY);
    if ($customThemes.length === 9) return; // we have 9 standard themes

    SetCache(THEMES_KEY, $customThemes.slice(9));
  };
</script>

<ul
  class="custom-themes"
  class:transparent-container={!table}
  class:flex-row={table}
  class:table
>
  {#each $customThemes as { name, standard }, index}
    <button
      id="theme-{index}"
      class="theme-option void-btn small-purple-tile small-tile-addon"
      class:standard
      class:selected={selectedTheme === index}
      class:active={compareCurrentTheme($customThemes[index])}
      onclick={() => {
        if (selectedTheme === index) selectedTheme = null;
        else selectedTheme = index;
      }}
    >
      <h4>{index + 1}</h4>
      <p>{name}</p>
      {#if !standard}
        <CloseSVG
          voidBtn={true}
          dark={true}
          onclick={(event: Event) => {
            event.stopPropagation();
            $customThemes.splice(index, 1);
            $customThemes = $customThemes; // force re-render;
            cacheCustomThemes();
          }}
        />
      {/if}
    </button>
  {/each}

  {#if !anyThemeMatched()}
    <hr />

    <p>
      Looks like you’ve tweaked the style. Want to save this custom theme
      locally?
    </p>

    <div class="add-theme flex">
      <input
        type="text"
        bind:value={newThemeName}
        disabled={anyThemeMatched()}
      />
      <SaveSVG
        onclick={handleAddTheme}
        disabled={anyThemeMatched()}
        text="Save Current Theme"
      />
    </div>
  {/if}

  <hr />

  <button
    onclick={applyTheme}
    disabled={selectedTheme === null ||
      compareCurrentTheme($customThemes[selectedTheme!])}
  >
    {selectedTheme === null
      ? 'Apply Theme'
      : 'Apply Theme: ' + $customThemes[selectedTheme!].name}
  </button>
</ul>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .custom-themes {
    width: 100%;
    flex-wrap: wrap;

    .theme-option {
      h4 {
        width: auto;
        color: $dark-blue;
      }

      &.selected {
        background-color: $deep-green !important;

        h4 {
          color: $dark-green;
        }

        &::after {
          content: 'Selected';
        }
      }

      &.active {
        background-color: $bright-purple;
        color: $cyan;

        &::after {
          content: 'Applied';
        }
      }
    }

    .add-theme {
      width: 100%;
      justify-content: center;
    }

    @include respond-up(tablet) {
      width: auto;
    }

    &.table {
      margin-top: 1.5rem;
    }
  }
</style>
