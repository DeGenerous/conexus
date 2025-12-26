<script lang="ts">
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import { toastStore } from '@stores/toast.svelte';

  import CopySVG from '@components/icons/Copy.svelte';

  let {
    disabled = false,
    container = false,
    style = '',
  }: {
    disabled?: boolean;
    container?: boolean;
    style?: string;
  } = $props();

  let copySvgFocus = $state<Nullable<string | boolean>>(null);
  let copyBtn: HTMLButtonElement;

  const handleOptionclick = async (option: string) => {
    const message = `Check out the AI story I'm playing on CoNexus!`;

    const encodedMessage = encodeURIComponent(message);
    const encodedURI = encodeURIComponent(window.location.href);

    switch (option) {
      case 'copy':
        await navigator.clipboard.writeText(
          `${message}\n${window.location.href}`,
        );
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 600);
        toastStore.show('Copied — now share it with the world!');
        break;
      case 'discord':
        const shareUrlDiscord = NAV_ROUTES.DISCORD;
        await navigator.clipboard.writeText(window.location.href);
        window.open(shareUrlDiscord, '_blank');
        break;
      case 'twitter':
        const shareUrlTwitter = NAV_ROUTES.TWITTER(encodedMessage, encodedURI);
        window.open(shareUrlTwitter, '_blank');
        break;
      case 'facebook':
        const shareUrlFacebook = NAV_ROUTES.FACEBOOK(
          encodedMessage,
          encodedURI,
        );
        window.open(shareUrlFacebook, '_blank');
        break;
    }
  };
</script>

<div class="share flex-row gap-8" class:container {style}>
  <p>
    {#if container}
      Share This Story:
    {:else}
      SHARE:
    {/if}
  </p>

  <span
    class="flex-row pad-inline round-8"
    class:loading-animation={disabled}
    class:transparent-glowing={!disabled}
  >
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionclick('twitter')}
      use:tippy={{ content: 'Share on X', animation: 'scale' }}
      aria-label="Share on X"
      {disabled}
    >
      <img src="/icons/twitter.png" alt="X" />
    </button>
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionclick('facebook')}
      use:tippy={{ content: 'Share on Facebook', animation: 'scale' }}
      aria-label="Share on Facebook"
      {disabled}
    >
      <img src="/icons/facebook.png" alt="Facebook" />
    </button>
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionclick('discord')}
      use:tippy={{ content: 'Join our community', animation: 'scale' }}
      aria-label="Share on Discord"
      {disabled}
    >
      <img src="/icons/discord.png" alt="Discord" />
    </button>
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionclick('copy')}
      onpointerover={() => {
        if (!disabled) copySvgFocus = true;
      }}
      onfocus={() => (copySvgFocus = true)}
      onpointerout={() => {
        if (!disabled) copySvgFocus = null;
      }}
      onblur={() => (copySvgFocus = null)}
      bind:this={copyBtn}
      use:tippy={{ content: 'Copy to clipboard', animation: 'scale' }}
      aria-label="Copy link"
      {disabled}
    >
      <CopySVG />
    </button>
  </span>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .share {
    @include white-txt(0.5);

    p {
      color: inherit;
      @include font(caption);
    }

    span {
      min-height: 2.5rem;
      @include cyan(0.1);

      button {
        border-radius: 20%;
        width: 1.5rem;

        img {
          border-radius: inherit;
        }

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus-visible:not(&:disabled) {
          @include scale(0.9);
          @include bright;
        }

        &:disabled {
          opacity: 0.25;
        }
      }
    }

    &.container {
      width: 95%;
      padding: 0.5rem 1rem;
      animation: none;
      background-color: unset;
      color: var(--theme-accent);

      p {
        @include font(body);
      }

      span {
        background-color: var(--theme-panel-dark);
        animation: none;
      }

      @include respond-up(tablet) {
        width: auto;
      }
    }
  }
</style>
