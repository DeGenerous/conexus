<script lang="ts">
  import { modal } from '@lib/modal-manager.svelte';

  let { title = 'System Alert', body } = $props();
</script>

<div
  class="modal-content"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  <div class="text-center flex flex-col gap-md">
    {#if title}
      <h2 id="modal-title" class="text-h3">{title}</h2>
    {/if}
    <div class="body-content">{@html body}</div>
  </div>

  <div class="flex flex-row justify-center">
    <button class="btn-system" onclick={() => modal.close()}>
      Acknowledge
    </button>
  </div>
</div>

<style>
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .body-content {
    text-align: inherit;
  }

  .btn-system {
    cursor: pointer;
  }
</style>
