<script lang="ts">
  import { onMount } from 'svelte';

  import {
    modal,
    showModal,
    resetModal,
    themeSettings,
    customThemes,
    customFont,
    customStyling,
  } from '@stores/modal.svelte';
  import {
    GetCache,
    SetCache,
    ClearCache,
    ONE_YEAR_TTL,
    THEMES_KEY,
  } from '@constants/cache';

  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';

  export let closeDialog = () => {};
  export let selectedTheme: Nullable<number> = null;

  onMount(() => {
    const storedThemes = GetCache(THEMES_KEY) as CustomTheme[];
    if (storedThemes) $customThemes = $customThemes.concat(storedThemes);
  });

  let newThemeName: string = 'CUSTOM THEME';

  // Set up current customization from the stored THEME-object
  const applyTheme = () => {
    $customFont = structuredClone($customThemes[selectedTheme!].font);
    $customStyling = structuredClone($customThemes[selectedTheme!].styling);
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

  // Cache only custom themes, first two THEME-objects we provide by default (dark/light)
  const cacheCustomThemes = () => {
    ClearCache(THEMES_KEY);
    if ($customThemes.length === 9) return; // we have 9 standard themes

    SetCache(THEMES_KEY, $customThemes.slice(9), ONE_YEAR_TTL);
  };
</script>

<h3>Theme Preferences</h3>
<h5>Use the default look or create your own custom theme.</h5>
<ul class="custom-themes transparent-container">
  {#each $customThemes as { name, standard }, index}
    <button
      id="theme-{index}"
      class="theme-option void-btn flex-row pad-8 round-8 white-txt"
      class:standard
      class:selected={selectedTheme === index}
      class:applied={compareCurrentTheme($customThemes[index])}
      on:click={() => {
        if (compareCurrentTheme($customThemes[index])) return;
        if (selectedTheme === index) selectedTheme = null;
        else selectedTheme = index;
      }}
    >
      <h4>{index + 1}</h4>
      <p class="pad-8 round-8 transparent-dark-bg">
        {name}
      </p>
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
    on:click={applyTheme}
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
    flex-flow: row wrap;

    .theme-option {
      position: relative;
      width: 100%;
      gap: 0.5rem;
      margin-top: 0.5rem;
      background-color: $purple;
      @include box-shadow;

      &:hover:not(.used-code),
      &:active:not(.used-code),
      &:focus:not(.used-code) {
        @include scale-up(soft);
        @include bright;
        @include box-shadow(deep);
      }

      p {
        width: 100%;
        @include box-shadow(soft, inset);
      }

      &.selected {
        background-color: $deep-green;
      }

      &.applied {
        background-color: $bright-purple;
        border-top-left-radius: 0;

        h4 {
          color: $dark-blue;
        }

        p {
          color: $cyan;
        }

        &::after {
          content: 'Applied';
          position: absolute;
          top: -1rem;
          left: 0;
          padding-inline: 0.5rem;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          color: $dark-blue;
          background-color: $bright-purple;
          @include font(caption);
        }
      }
    }

    .add-theme {
      width: 100%;
    }

    @include respond-up(tablet) {
      width: auto;

      .theme-option {
        width: auto;
      }
    }
  }
</style>
