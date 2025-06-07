<script>
  import { toastStore } from '@stores/toast.svelte';
  import Toast from './Toast.svelte';
</script>

<div class="flex pad-inline">
  {#each $toastStore as { id, message, type, duration }}
    <Toast {message} {type} {duration} onClose={() => toastStore.close(id)} />
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

    @include respond-up(small-desktop) {
      top: 3rem;
      width: calc(100vw - 10rem);
      left: 5rem;
    }
  }
</style>
