<script lang="ts">
  import { onMount } from 'svelte';

  import {
    customThemes,
    customFont,
    customStyling,
    updateFont,
    updateStyling,
    getStoredCustomization,
    persistCustomThemesCache,
    persistActiveTheme,
    STANDARD_THEME_COUNT,
  } from '@stores/customization.svelte';
  import { GetCache, THEMES_KEY } from '@constants/cache';

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
      $customThemes = $customThemes
        .slice(0, STANDARD_THEME_COUNT)
        .concat(storedThemes);
    }

    getStoredCustomization();
  });

  let selectedTheme = $state<Nullable<number>>(null);
  let newThemeName = $state<string>('CUSTOM THEME');

  // Set up current customization from the stored THEME-object
  const applyTheme = async () => {
    if (!selectedTheme) return;

    const theme = $customThemes[selectedTheme];
    $customFont = structuredClone(theme.font);
    $customStyling = structuredClone(theme.styling);
    await persistActiveTheme(theme.standard ? theme.name : 'Custom Theme');
    selectedTheme = null;
    closeDialog();
  };

  // Add current customization as a THEME-object to the array and cache everything
  const handleAddTheme = async () => {
    $customThemes[$customThemes.length] = {
      name: newThemeName,
      font: structuredClone($customFont),
      styling: structuredClone($customStyling),
    };
    $customThemes = $customThemes; // force re-render;
    newThemeName = 'CUSTOM THEME';
    persistCustomThemesCache();
    await persistActiveTheme('Custom Theme');
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
      return compareCurrentTheme(theme);
    });
</script>

<ul
  class="custom-themes"
  class:transparent-container={!table}
  class:flex={table}
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
            persistCustomThemesCache();
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
    flex-direction: row;
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
