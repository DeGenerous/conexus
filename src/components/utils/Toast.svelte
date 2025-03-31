<script>
  import { onMount } from 'svelte';

  export let message = '';
  export let type = 'info';
  export let duration = 10000;
  export let onClose;

  const closeToast = () => {
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="toast blur"
  class:info={type === 'info'}
  class:error={type !== 'info'}
>
  <p>{message}</p>
  <div class="close-btn" role="button" tabindex="0" on:click={closeToast}>
    ✖
  </div>
</div>

<style>
  div {
    font-size: 1vw;
    line-height: 1.5;
  }

  .toast {
    padding: 1vw 2vw;
    border-radius: 1vw;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;
    max-width: 65vw;
    opacity: 1;
    animation: fade-out 5s ease-in-out;
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

  .close-btn:hover,
  .close-btn:active {
    color: #010020;
  }

  @keyframes fade-out {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @media only screen and (max-width: 600px) {
    div {
      font-size: 1em;
    }

    .toast {
      top: 2em;
      padding: 1em;
      gap: 1em;
      border-radius: 1em;
      width: 90vw;
      max-width: 90vw;
    }
  }
</style>
