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
  <div class={`toast ${type} ${visible ? '' : 'hidden'}`}>
    <div>{message}</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="close-btn" on:click={closeToast}>✖</div>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    opacity: 1;
    transition: opacity 0.3s;
    width: 350px;
  }

  .toast.hidden {
    opacity: 0;
  }

  .toast.info {
    background-color: green;
  }

  .toast.error {
    background-color: red;
  }

  .close-btn {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
