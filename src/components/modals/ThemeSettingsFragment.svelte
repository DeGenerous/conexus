<script lang="ts">
  import { modal } from '@lib/modal-manager.svelte';
  import ThemeSettings from '@components/utils/ThemeSettings.svelte';

  let {
    onClose,
  }: {
    onClose?: () => void;
  } = $props();

  function handleClose() {
    if (onClose) onClose();
    else modal.close();
  }
</script>

<div
  class="modal-content"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  <div class="text-center flex flex-col gap-md">
    <h2 id="modal-title" class="text-h3">Theme Preferences</h2>
    <p>Use the default look or create your own custom theme.</p>
  </div>

  <ThemeSettings />

  <div class="flex flex-row justify-center">
    <button class="btn-alert" onclick={handleClose}>Close</button>
  </div>
</div>

<style>
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .btn-alert {
    cursor: pointer;
  }
</style>
