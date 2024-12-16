<script>
  import { onMount } from 'svelte';
  export let message = '';
  export let type = 'info';
  export let duration = 5000;
  export let onClose;

  let visible = true;

  const closeToast = () => {
    visible = false;
    if (onClose) onClose();
  };

  onMount(() => {
    const timer = setTimeout(() => {
      closeToast();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  });
</script>

{#if visible}
  <div class={`toast ${type} ${visible ? '' : 'hidden'} blur`}>
    <div>{message}</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="close-btn" role="button" tabindex="0" on:click={closeToast}>✖</div>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 2vw;
    left: 50%;
    transform: translateX(-50%);
    padding: 1vw 2vw;
    border-radius: 1vw;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2vw;
    width: 35vw;
    opacity: 1;
  }

  .toast.hidden {
    opacity: 0;
  }

  .toast.info {
    background-color: rgba(0, 185, 55, 0.75);
  }

  .toast.error {
    background-color: rgba(255, 50, 50, 0.75);
  }

  .close-btn {
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    .toast {
      top: 2em;
      padding: 0.5em 1em;
      gap: 1em;
      border-radius: 1em;
      width: 90vw;
    }
  }
</style>
