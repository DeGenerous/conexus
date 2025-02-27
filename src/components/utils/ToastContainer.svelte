<script>
  import { toastStore } from '@stores/toast';

  import Toast from './Toast.svelte';

  let toasts = [];
  toastStore.subscribe((value) => {
    toasts = value;
  });

  const handleClose = (id) => {
    toastStore.close(id);
  };
</script>

<div class="toast-container">
  {#each toasts as { id, message, type, duration }}
    <Toast {message} {type} {duration} onClose={() => handleClose(id)} />
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 2vw;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  @media only screen and (max-width: 600px) {
    .toast-container {
      top: 5em;
      gap: 0.5em;
    }
  }
</style>
