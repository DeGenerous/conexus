<script lang="ts">
  import { modal } from '@lib/modal-manager.svelte';
  import { modalRegistry } from '@config/modal-registry';

  let dialog = $state<HTMLDialogElement | null>(null);

  // --- Visual buffers to avoid flicker during close animation ---
  // Keep component mounted until CSS transition completes (see handleTransitionEnd).
  let ActiveComponent = $state<ModalComponentType | null>(null);
  let renderedSize = $state(modal.state.size);
  let renderedProps = $state(modal.state.props);

  // Sync fragment rendering when modal.state.key changes.
  $effect(() => {
    if (modal.state.key) {
      const component =
        modalRegistry[modal.state.key as keyof typeof modalRegistry];
      if (component) {
        renderedSize = modal.state.size;
        renderedProps = modal.state.props;
        ActiveComponent = component as ModalComponentType;

        if (dialog && !dialog.open) {
          dialog.showModal();
          document.dispatchEvent(new CustomEvent('void:modal-opened'));
        }
      }
    } else if (!modal.state.key && dialog?.open) {
      dialog.close();
    }
  });

  // Cleanup after CSS transition ends — keeps content visible during exit animation.
  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.target === dialog && !dialog?.open) {
      ActiveComponent = null;
      renderedProps = {};
    }
  };

  // Backdrop click: close when clicking the dark overlay, not the content.
  const handleBackdrop = (e: MouseEvent) => {
    if (e.target === e.currentTarget) modal.close();
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  bind:this={dialog}
  data-size={renderedSize}
  onclose={() => modal.close()}
  onclick={handleBackdrop}
  ontransitionend={handleTransitionEnd}
  aria-labelledby="modal-title"
  aria-modal="true"
>
  {#if ActiveComponent}
    <ActiveComponent {...renderedProps} />
  {/if}
</dialog>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  dialog {
    width: 90%;

    @include respond-up(tablet) {
      width: clamp(250px, 75%, 60rem);
    }
  }
</style>
