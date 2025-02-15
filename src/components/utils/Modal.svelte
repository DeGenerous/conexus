<script lang="ts">
  import {
    showModal,
    secondButton,
    handleSecondButton,
    modalContent,
  } from '@stores/modal.ts';

  let dialog: HTMLDialogElement;

  $: if (dialog && $showModal) {
    dialog.showModal();
  } else if (!$showModal) {
    closeDialog();
  }

  const closeDialog = () => {
    $showModal = false;
    dialog?.close();
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={closeDialog}
  on:click|self={closeDialog}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    {@html $modalContent}
    <section>
      <button on:click={() => ($showModal = false)}> Close </button>
      {#if $secondButton}
        <button on:click={$handleSecondButton}>
          {$secondButton}
        </button>
      {/if}
    </section>
  </div>
</dialog>

<style>
  dialog {
    max-width: 80vw;
    border: none;
    color: inherit;
    background-color: rgba(1, 0, 32, 0.75);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.5);
    border-radius: 1.5vw;
  }

  dialog > div {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
    padding: 2vw;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
  }

  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }

  section {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  @media only screen and (max-width: 600px) {
    dialog {
      width: 90vw;
      border-radius: 1em;
    }

    dialog > div {
      padding: 1em;
    }

    section {
      gap: 1em;
    }
  }

  @keyframes zoom {
    from {
      transform: scale(1.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
