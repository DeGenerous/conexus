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
  <p>{@html message}</p>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    class="close-svg"
    stroke="#dedede"
    stroke-width="30"
    stroke-linecap="round"
    on:click={closeToast}
    role="button"
    tabindex="0"
  >
    <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
  </svg>
</div>

<style>
  div {
    font-size: 1vw;
    line-height: 1.5;
  }

  .toast {
    padding: 1vw;
    border-radius: 1vw;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;
    max-width: 65vw;
    opacity: 1;
    animation: fade-out 5s 5s ease-in-out;
  }

  .toast.info {
    background-color: rgba(0, 150, 40, 0.9);
  }

  .toast.error {
    background-color: rgba(200, 30, 30, 0.9);
  }

  .close-svg {
    width: 1.5vw;
    height: 1.5vw;
  }

  .close-svg:hover,
  .close-svg:active {
    stroke: #010020;
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

    .close-svg {
      width: 1em;
      height: 1em;
    }
  }
</style>
