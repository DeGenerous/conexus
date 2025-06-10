<!-- LEGACY SVELTE 3/4 SYNTAX -->
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

  let dialog: HTMLDialogElement;

  $: if (dialog && $showModal) {
    dialog.classList.remove('dialog-fade-out');
    dialog.showModal();
  } else if (dialog) {
    closeDialog();
  }

  const closeDialog = () => {
    dialog.classList.add('dialog-fade-out'); // animation before close
    $showModal = false;
    $themeSettings = false;
    selectedTheme = null;
    resetModal();
    setTimeout(() => dialog?.close(), 300);
  };

  // THEME SETTINGS

  onMount(() => {
    const storedThemes = GetCache(THEMES_KEY) as CustomTheme[];
    if (storedThemes) $customThemes = $customThemes.concat(storedThemes);
  });

  let selectedTheme: Nullable<number> = null;
  let newThemeName: string = 'CUSTOM THEME';

  const applyTheme = () => {
    $customFont = structuredClone($customThemes[selectedTheme!].font);
    $customStyling = structuredClone($customThemes[selectedTheme!].styling);
    closeDialog();
  };

  const handleAddTheme = () => {
    $customThemes[$customThemes.length] = {
      name: newThemeName,
      font: structuredClone($customFont),
      styling: structuredClone($customStyling),
    };
    newThemeName = 'CUSTOM THEME';
    cacheCustomThemes();
  };

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

  const anyThemeMatched = (): boolean =>
    $customThemes.some((theme) => {
      return compareCurrentTheme(theme);
    });

  const cacheCustomThemes = () => {
    ClearCache(THEMES_KEY);
    if ($customThemes.length === 2) return;

    SetCache(THEMES_KEY, $customThemes.slice(2), ONE_YEAR_TTL);
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y_no_static_element_interactions -->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={closeDialog}
  on:click|self={closeDialog}
>
  <div class="flex" on:click|stopPropagation>
    {@html modal.content}
    {#if $themeSettings}
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

        <hr />

        {#if !anyThemeMatched()}
          <p>
            Looks like you’ve tweaked the style. Want to save this custom theme
            locally?
          </p>
        {/if}

        <div class="add-theme flex">
          <input
            type="text"
            bind:value={newThemeName}
            disabled={anyThemeMatched()}
          />
          <button on:click={handleAddTheme} disabled={anyThemeMatched()}>
            Save Your Current Theme
          </button>
        </div>
      </ul>
    {/if}
    <span class="flex">
      <button class="red-btn" on:click={() => ($showModal = false)}>
        Close
      </button>
      {#if modal.button}
        <button class={modal.buttonClass} on:click={modal.buttonFunc}>
          {modal.button}
        </button>
      {/if}
      {#if $themeSettings}
        <button
          on:click={applyTheme}
          disabled={selectedTheme === null ||
            compareCurrentTheme($customThemes[selectedTheme!])}
        >
          {selectedTheme === null
            ? 'Apply Theme'
            : 'Apply Theme: ' + $customThemes[selectedTheme!].name}
        </button>
      {/if}
    </span>
  </div>
</dialog>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  dialog {
    width: 90%;

    & > div {
      padding: 1.5rem;

      span {
        width: 100%;
        flex-direction: column-reverse;

        button {
          width: 100%;
          min-width: 10rem;
        }
      }

      .custom-themes {
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

          @include respond-up(tablet) {
            width: auto;
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
      }
    }

    @include respond-up(tablet) {
      width: clamp(250px, 75%, 60rem);

      & > div {
        span {
          flex-flow: row wrap;
          gap: 1.5rem;

          button {
            width: auto;
          }
        }
      }
    }
  }
</style>
