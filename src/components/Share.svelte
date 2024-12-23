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
        window.open(discordShareUrl, '_blank');
        break;
      case 'twitter':
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(shareUrl, '_blank');
        break;
    }
  };
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
<section>
  <button
    class="share-button"
    style={showOptions ? 'justify-content: space-between;' : ''}
    on:click={handleShareClick}
  >
    {#if showOptions}
      <span>SHARE:</span>
      <img
        src="/icons/discord.png"
        alt="Share"
        on:click={() => handleOptionClick('discord')}
        role="button"
        tabindex="0"
      />
      <img
        src="/icons/twitter.png"
        alt="Share"
        on:click={() => handleOptionClick('twitter')}
        role="button"
        tabindex="0"
      />
      <img
        src="/icons/copyicon.png"
        alt="Share"
        on:click={() => handleOptionClick('copy')}
        role="button"
        tabindex="0"
      />
    {:else}
      SHARE
    {/if}
  </button>
</section>

<style>
  section {
    position: relative;
    display: flex;
  }

  img {
    height: 1.5vw;
    filter: drop-shadow(0 0 0.1vw #010020);
    margin-inline: 0.5vw;
  }

  img:hover,
  img:active {
    transform: scale(1.2);
    filter: drop-shadow(0 0.15vw 0.25vw #010020);
  }

  span {
    cursor: pointer;
    margin-right: 1vw;
  }

  @media only screen and (max-width: 600px) {
    button {
      width: 80vw;
      font-size: 1.5em;
      line-height: 1.5em;
      padding: 0.25em 0.5em;
    }

    img {
      height: 1.25em;
    }
  }
</style>
