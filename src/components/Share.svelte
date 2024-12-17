<script>
  export let url = '';
  export let onClick = () => {};

  let showOptions = false;

  const handleShareClick = () => {
    showOptions = !showOptions;
  };

  const handleOptionClick = async (option) => {
    showOptions = false;
    onClick();

    url = url || window.location.href;

    const message = `Check out the current story I'm playing on Conexus! \n ${url}`;

    switch (option) {
      case 'copy':
        await navigator.clipboard.writeText(`${message}`);
        alert('Copied to clipboard!');
        break;
      case 'discord':
        const discordShareUrl = `https://discord.com/channels/@me`;
        await navigator.clipboard.writeText(`${message}`);
        alert('Copied to clipboard!');
        window.open(discordShareUrl, '_blank');
        break;
      case 'twitter':
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(shareUrl, '_blank');
        break;
    }
  };
</script>

<section>
  <button class="share-button" on:click={handleShareClick}>
    Share <img src="/icons/share.png" alt="Share" />
  </button>

  {#if showOptions}
    <div class="options blur">
      <button on:click={() => handleOptionClick('discord')}>
        <img src="/icons/discord.png" alt="Share" />
      </button>
      <button on:click={() => handleOptionClick('twitter')}>
        <img src="/icons/twitter.png" alt="Share" />
      </button>
    </div>
    <button class="copy-button" on:click={() => handleOptionClick('copy')}>
      <img src="/icons/copyicon.png" alt="Share" />
    </button>
  {/if}
</section>

<style>
  section {
    position: relative;
    display: flex;
  }

  button {
    background-color: rgba(0, 0, 0, 0);
    border: none;
    opacity: 0.75;
  }

  button:hover,
  button:active {
    opacity: 0.9;
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.25));
  }

  img {
    width: 2vw;
    cursor: pointer;
  }

  .share-button {
    display: flex;
    align-items: center;
    gap: 1vw;
    font-size: 1.5vw;
    color: rgba(51, 226, 230, 0.9);
  }

  .share-button img {
    width: 2.5vw;
  }

  .options {
    display: flex;
    flex-flow: row nowrap;
    background-color: rgba(51, 226, 230, 0.1);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
    padding-inline: 0.5vw;
    margin-inline: 1vw;
  }

  .copy-button img {
    width: 2vw;
  }

  @media only screen and (max-width: 600px) {
    img {
      width: 1.75em;
    }

    .share-button {
      font-size: 1.25em;
      gap: 0.5em;
    }

    .share-button img {
      width: 1.25em;
    }

    .copy-button img {
      width: 1.25em;
    }

    .options {
      gap: 0.25em;
      padding: 0.25em;
      border-radius: 0.5em;
    }
  }
</style>
