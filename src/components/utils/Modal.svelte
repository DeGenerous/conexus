<script lang="ts">
  import { onMount } from 'svelte';
  import { GetCache, SetCache } from '@constants/cache';

  import {
    modal,
    showModal,
    resetModal,
    playOptions,
  } from '@stores/modal.svelte';
  import { themeSettingsModal } from '@stores/customization.svelte';
  import { NAV_ROUTES } from '@constants/routes';

  import ThemeSettings from '@components/utils/ThemeSettings.svelte';
  import PlayOptions from '@components/utils/PlayOptions.svelte';

  let dialog = $state<HTMLDialogElement | null>(null);

  const closeDialog = () => {
    dialog?.classList.add('dialog-fade-out');
    $showModal = false;
    if ($themeSettingsModal) $themeSettingsModal = false;
    if ($playOptions) $playOptions = false;
    resetModal();
    setTimeout(() => dialog?.close(), 300);
  };

  $effect(() => {
    if (!dialog) return;
    if ($showModal) {
      dialog.classList.remove('dialog-fade-out');
      dialog.showModal();
    } else if (dialog.open) {
      closeDialog();
    }
  });

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  };

  const stopPropagation = (event: Event) => {
    event.stopPropagation();
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  class="blur"
  bind:this={dialog}
  onclose={closeDialog}
  onclick={handleBackdropClick}
  aria-label="Modal"
  aria-modal="true"
>
  <div class="flex" onclick={stopPropagation} role="dialog" tabindex="-1">
    <!-- DYNAMIC CONTENT PROVIDED BY openModal() FUNCTION -->
    {@html modal.content}

    <!-- CUSTOM THEMES WINDOW -->
    {#if $themeSettingsModal}
      <h3>Theme Preferences</h3>
      <h5>Use the default look or create your own custom theme.</h5>
      <ThemeSettings {closeDialog} />
    {/if}

    <!-- PLAY MODE -->
    {#if $playOptions}
      <PlayOptions />
    {/if}

    <span class="flex">
      <!-- DEFAULT CLOSE BUTTON ON EVERY MODAL -->
      <button class="red-btn" onclick={() => ($showModal = false)}>
        Close
      </button>

      <!-- SECOND OPTIONAL BUTTON IF NEEDED -->
      {#if modal.button}
        <button class={modal.buttonClass} onclick={modal.buttonFunc}>
          {modal.button}
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
