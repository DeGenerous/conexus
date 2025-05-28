<script lang="ts">
  import {
    showModal,
    secondButton,
    secondButtonClass,
    handleSecondButton,
    handleCloseModal,
    modalContent,
  } from '@stores/modal.ts';

  let dialog: HTMLDialogElement;

  $: if (dialog && $showModal) {
    dialog.classList.remove('dialog-fade-out');
    dialog.showModal();
  } else if (dialog) {
    closeDialog();
  }

  const closeDialog = () => {
    dialog.classList.add('dialog-fade-out');
    $showModal = false;
    $secondButton = '';
    $secondButtonClass = '';
    $handleSecondButton = () => {};
    setTimeout(() => dialog?.close(), 300);
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y_no_static_element_interactions -->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={closeDialog}
  on:click|self={closeDialog}
>
  <div class="flex" on:click|stopPropagation>
    {@html $modalContent}
    <span class="flex-row">
      <button class="red-btn" on:click={$handleCloseModal}> Close </button>
      {#if $secondButton}
        <button class={$secondButtonClass} on:click={$handleSecondButton}>
          {$secondButton}
        </button>
      {/if}
    </span>
  </div>
</dialog>

<style>
  dialog {
    width: clamp(250px, 75%, 40rem);
  }

  dialog > div {
    padding-top: 2rem;
  }

  dialog > div > span {
    flex-wrap: wrap;
  }
</style>
