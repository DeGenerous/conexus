<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { GetCache, SetCache, TERMS_KEY } from '@constants/cache';

  import {
    modal,
    showModal,
    resetModal,
    draftsManager,
    themeSettings,
  } from '@stores/modal.svelte';

  import Drafts from '@components/dashboard/dream/create/Drafts.svelte';
  import ThemeSettings from '@components/utils/ThemeSettings.svelte';

  let dialog: HTMLDialogElement;
  
  let termsAccepted: boolean = false;

  $: if (dialog && $showModal) {
    dialog.classList.remove('dialog-fade-out');
    dialog.showModal();
  } else if (dialog) {
    closeDialog();
  }

  const closeDialog = () => {
    dialog.classList.add('dialog-fade-out'); // animation before close
    $showModal = false;
    if ($draftsManager) $draftsManager = false;
    if ($themeSettings) $themeSettings = false;
    resetModal();
    setTimeout(() => dialog?.close(), 300);
  };

  const checkTermsAccepted = () => {
    termsAccepted = GetCache<boolean>(TERMS_KEY) || false;
    if (!termsAccepted) {
      $showModal = true;
      modal.content = `
        <h4>Terms of Service</h4>
        <p>
          To continue using CoNexus, you must review and accept the updated 
          <a href="{import.meta.env.PUBLIC_FRONTEND_URL}/terms-of-service" target="_blank" rel="noopener noreferrer"
          >Terms of Service</a
          >.
        </p>
        <p>The updated Terms take effect on 12 September 2025.</p>
        <p>
          By clicking <b>Accept</b>, you acknowledge that you have read and agree to the <b>Terms of Service</b>.
        </p>
        <p>
          If you do not agree, click <b>Decline</b> to exit the app.
        </p>
      `;
      modal.button = 'Accept';
      modal.buttonClass = 'green-btn';
      modal.buttonFunc = () => {
        SetCache(TERMS_KEY, true);
        window.location.reload();
      }
    }
  };

  onMount(checkTermsAccepted);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y_no_static_element_interactions -->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={closeDialog}
  on:click|self={closeDialog}
  aria-label="Modal"
>
  <div class="flex" on:click|stopPropagation>
    <!-- DYNAMIC CONTENT PROVIDED BY openModal() FUNCTION -->
    {@html modal.content}

    <!-- DRAFTS MANGER -->
    {#if $draftsManager}
      <Drafts {closeDialog} />
    {/if}

    <!-- CUSTOM THEMES WINDOW -->
    {#if $themeSettings}
      <ThemeSettings {closeDialog} />
    {/if}

    <span class="flex">
      <!-- DEFAULT CLOSE BUTTON ON EVERY MODAL -->
      <button class="red-btn" on:click={() => ($showModal = false)}>
        {#if termsAccepted}
          Close
        {:else}
          Decline
        {/if}
      </button>

      <!-- SECOND OPTIONAL BUTTON IF NEEDED -->
      {#if modal.button}
        <button class={modal.buttonClass} on:click={modal.buttonFunc}>
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
