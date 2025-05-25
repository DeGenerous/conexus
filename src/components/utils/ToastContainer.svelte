<script>
  import { onMount } from 'svelte';

  import { toastStore } from '@stores/toast';

  import Toast from './Toast.svelte';

  let toasts = [];
  toastStore.subscribe((value) => {
    toasts = value;
  });

  const handleClose = (id) => {
    toastStore.close(id);
  };

  let message = '';

  onMount(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      message = urlParams.get('message');

      if (message) {
        toastStore.show(message, 'error');
        history.replaceState(null, '', window.location.pathname); // Remove message from URL
      }
    }
  });
</script>

<div class="flex pad-inline">
  {#each toasts as { id, message, type, duration }}
    <Toast {message} {type} {duration} onClose={() => handleClose(id)} />
  {/each}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    width: 100vw;
    position: fixed;
    top: 6rem;
    left: 0;
    z-index: 50;

    @include respond-up(tablet) {
      top: 3rem;
      width: calc(100vw - 10rem);
      left: 5rem;
    }
  }
</style>
