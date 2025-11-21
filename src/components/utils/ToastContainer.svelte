<script lang="ts">
  import { toastStore } from '@stores/toast.svelte';
  import Toast from '@components/utils/Toast.svelte';
</script>

<div class="toast-container" aria-live="polite" aria-atomic="true">
  {#each $toastStore as { id, message, type } (id)}
    <Toast {message} {type} onClose={() => toastStore.close(id)} />
  {/each}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .toast-container {
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    pointer-events: none;

    width: max-content;
    min-width: 12rem;
    max-width: calc(100vw - 2rem);

    @include respond-up(small-desktop) {
      top: 3rem;
      max-width: calc(100vw - 40%);
    }
  }
</style>
