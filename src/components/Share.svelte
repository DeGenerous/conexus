<script>
  import { onMount } from 'svelte';

  export let url;
  export let onClick;

  let showOptions = false;

  const handleShareClick = () => {
    showOptions = !showOptions;
  };

  const handleOptionClick = async (option) => {
    showOptions = false;
    onClick();

    const message = `Check out the current story I'm playing on ${url}!`;

    switch (option) {
      case 'copy':
        await navigator.clipboard.writeText(`${message}`);
        alert('Copied to clipboard!');
        break;
      case 'discord':
        window.open(`https://discord.com/channels/@me`, '_blank');
        break;
      case 'twitter':
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(shareUrl, '_blank');
        break;
    }
  };
</script>

<div class="relative">
  <button
    class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
    on:click={handleShareClick}
  >
    Share
  </button>

  {#if showOptions}
    <div class="absolute mt-2 bg-white shadow-lg rounded flex flex-col">
      <button
        class="py-2 px-4 text-left hover:bg-gray-100 text-black transition"
        on:click={() => handleOptionClick('copy')}
      >
        Copy
      </button>
      <button
        class="py-2 px-4 text-left hover:bg-gray-100 text-black transition"
        on:click={() => handleOptionClick('discord')}
      >
        Discord
      </button>
      <button
        class="py-2 px-4 text-left hover:bg-gray-100 text-black transition"
        on:click={() => handleOptionClick('twitter')}
      >
        Twitter
      </button>
    </div>
  {/if}
</div>

<style>
  .relative {
    position: relative;
  }

  .absolute {
    position: absolute;
  }

  .bg-blue-500 {
    background-color: #4299e1;
  }

  .hover\:bg-blue-600:hover {
    background-color: #3182ce;
  }

  .hover\:bg-gray-100:hover {
    background-color: #f7fafc;
  }

  .text-white {
    color: white;
  }

  .rounded {
    border-radius: 0.375rem;
  }

  .transition {
    transition: all 0.2s ease-in-out;
  }

  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .text-black {
    color: black;
  }

  .shadow-lg {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .mt-2 {
    margin-top: 0.5rem;
  }
</style>
