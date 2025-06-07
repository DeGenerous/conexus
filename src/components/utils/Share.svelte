<script lang="ts">
  import CopySVG from '@components/icons/Copy.svelte';

  let { disabled = false }: { disabled?: boolean } = $props();

  let copySvgFocus = $state<Nullable<string | boolean>>(null);
  let copyBtn: HTMLButtonElement;

  const handleOptionClick = async (option: string) => {
    const message = `Check out the AI story I'm playing on CoNexus!\n${window.location.href}`;

    switch (option) {
      case 'copy':
        await navigator.clipboard.writeText(`${message}`);
        copyBtn.classList.add('copied');
        setTimeout(() => copyBtn.classList.remove('copied'), 600);
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

<div class="share flex-row gap-8">
  <p class="transparent-white-txt">SHARE:</p>

  <span
    class="flex-row pad-inline round-8 shad loading-animation"
    class:transparent-glowing={!disabled}
  >
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionClick('discord')}
      aria-label="Share on Discord"
      {disabled}
    >
      <img src="/icons/discord.png" alt="Discord" />
    </button>
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionClick('twitter')}
      aria-label="Share on X"
      {disabled}
    >
      <img src="/icons/twitter.png" alt="X" />
    </button>
    <button
      class="min-size-btn void-btn flex"
      onclick={() => handleOptionClick('copy')}
      onpointerover={() => {
        if (!disabled) copySvgFocus = true;
      }}
      onfocus={() => (copySvgFocus = true)}
      onpointerout={() => {
        if (!disabled) copySvgFocus = null;
      }}
      onblur={() => (copySvgFocus = null)}
      bind:this={copyBtn}
      aria-label="Copy link"
      {disabled}
    >
      <CopySVG {copySvgFocus} data={false} />
    </button>
  </span>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .share {
    p {
      display: none;
      @include font(caption);

      @include respond-up(tablet) {
        display: block;
      }
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
        &:focus:not(&:disabled) {
          @include scale(0.9);
          @include bright;
        }

        &:disabled {
          opacity: 0.25;
        }
      }
    }
  }
</style>
