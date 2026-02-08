<script lang="ts">
  // import { tooltip } from '@actions/tooltip'; // TODO: re-enable when tooltip action exists
  // import Warning from '../icons/Warning.svelte'; // TODO: re-enable when Warning icon exists

  let {
    title = 'Confirm Action',
    body,
    cost = 0,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel = () => {},
  } = $props();
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
    <div class="body-content flex">{@html body}</div>

    {#if cost > 0}
      <div
        class="cost-warning surface-sunk p-md flex flex-row gap-md items-center justify-center"
      >
        <span aria-hidden="true">&#9888;</span>
        <span>Consumes <strong>{cost} Credits</strong></span>
      </div>
    {/if}
  </div>

  <div class="flex flex-row justify-center gap-md">
    <button class="btn-alert red-btn" onclick={() => onCancel()}>
      {cancelText}
    </button>
    <button class="btn-signal green-btn" onclick={onConfirm}>
      {confirmText}
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

  .cost-warning {
    color: rgb(128, 90, 213);
  }

  .btn-alert {
    cursor: pointer;
  }

  .btn-signal {
    cursor: pointer;
  }
</style>
