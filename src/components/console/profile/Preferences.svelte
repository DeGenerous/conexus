<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { promptSettings } from '@stores/dream.svelte';
  import { customFont, customStyling } from '@stores/customization.svelte';
  import { getPersonalSetup, setPersonalSetup } from '@stores/account.svelte';
  import { checkUserRoles } from '@utils/route-guard';
  import { isGuest } from '@stores/account.svelte';

  import Dropdown from '@components/utils/Dropdown.svelte';
  import ThemeSettings from '@components/utils/ThemeSettings.svelte';
  import StylingController from '@components/utils/StylingController.svelte';
  import SelectorSVG from '@components/icons/Selector.svelte';
  import FooterLinks from '@components/console/common/FooterLinks.svelte';

  const account: Account = new Account();

  let originalSettings = $state<PromptSettings | null>(null);
  let preferredSettings = $state<SettingMode>('default');
  // let preferredTheme = $state<SettingMode>('default');
  let playMode = $state<PlayMode>('play_unlimited');

  const table = true; // for Dropdown styling
  const options = [
    'Proceed on a simple path and observe the arrangement.',
    'Continue with a plain choice and watch the layout adapt.',
    'Try an alternate choice and compare the overall feel.',
  ];
  let focusedOption = $state<Nullable<number>>(null);

  const themeStyles = $derived.by(() => {
    if (!$customFont || !$customStyling) return '';

    const { baseColor, accentColor, family } = $customFont;
    const { bgColor } = $customStyling;

    return [
      `--theme-text: ${baseColor}`,
      `--theme-accent: ${accentColor}`,
      `--theme-bg: ${bgColor}`,
      `--theme-font: ${family}`,
      // Dynamic Glass Logic
      `--theme-panel-bg: color-mix(in srgb, var(--theme-accent), transparent 85%)`,
      `--theme-panel-border: color-mix(in srgb, var(--theme-accent), transparent 60%)`,
      `--theme-hover-bg: color-mix(in srgb, var(--theme-accent), transparent 70%)`,
      `--theme-panel-muted: color-mix(in srgb, var(--theme-bg), transparent 60%)`,
      `--theme-hover-muted: color-mix(in srgb, var(--theme-bg), transparent 50%)`,
    ].join(';');
  });

  // calculate option selector size based on font size
  let selectorSize = $state<number>(1.5); // rem
  $effect(() => {
    if ($customFont)
      selectorSize =
        $customFont.accentSize === 'h4'
          ? 1.75
          : $customFont.accentSize === 'h5'
            ? 1.5
            : $customFont.accentSize === 'body'
              ? 1.25
              : $customFont.accentSize === 'small'
                ? 1
                : 0.75;
  });

  const updatePersonalSetup = () =>
    setPersonalSetup({
      settings: preferredSettings,
      // theme: preferredTheme,
      play_mode: playMode,
    });

  onMount(async () => {
    await checkUserRoles();

    const cachedSetup = getPersonalSetup();
    if (cachedSetup) {
      preferredSettings = cachedSetup.settings || 'default';
      // preferredTheme = cachedSetup.theme || 'default';
      playMode = cachedSetup.play_mode || 'play_unlimited';
    } else updatePersonalSetup();

    originalSettings = await account.getPromptSettings();
    if (originalSettings) {
      promptSettings.set({ ...originalSettings });
    }
  });

  const saveChanges = async () => {
    await account.createOrUpdatePromptSettings($promptSettings);
    originalSettings = await account.getPromptSettings();
  };

  const blurActiveBtn = () => {
    if (document.activeElement!.tagName == 'BUTTON') {
      const activeOption = document.activeElement as HTMLButtonElement;
      activeOption.blur();
    }
  };
</script>

<p>
  Make stories fit you. Set styling, tone, pace, difficulty, content filters,
  and continuity.
</p>

<section class="preferred-setup dream-container">
  <div class="flex-row">
    <h4>Preferred Controls</h4>
    <div class="container">
      <span class="flex-row">
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredSettings === 'personal'}
          onclick={() => {
            preferredSettings = 'personal';
            updatePersonalSetup();
          }}
        >
          Personal
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredSettings === 'default'}
          onclick={() => {
            preferredSettings = 'default';
            updatePersonalSetup();
          }}
        >
          Default
        </button>
      </span>
      <p>
        {#if preferredSettings === 'personal'}
          Use your profile’s controls, overriding the story’s defaults.
        {:else}
          Play with author defaults, personal preferences will not be applied.
        {/if}
      </p>
    </div>
  </div>

  <div class="flex-row">
    <h4>Play Mode</h4>
    <div class="container">
      <span class="flex-row">
        <button
          class="void-btn dream-radio-btn"
          class:active={playMode === 'play_limited'}
          onclick={() => {
            playMode = 'play_limited';
            updatePersonalSetup();
          }}
        >
          Text-only
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={playMode === 'play_unlimited'}
          onclick={() => {
            playMode = 'play_unlimited';
            updatePersonalSetup();
          }}
          disabled={$isGuest}
        >
          With Media
        </button>
      </span>
      <p>
        {#if playMode === 'play_limited'}
          Story cost: <strong>1 credit</strong>. No images or audio.
        {:else}
          Story cost: <strong>3 credits</strong>. Images and audio on each step.
        {/if}
      </p>
    </div>
  </div>
</section>

<div class="dream-container">
  <h4>Selected Theme</h4>
  {#if $customFont && $customStyling}
    <section
      class="step-preview flex round-8 pad-24 {$customFont.baseSize}-font"
      style={themeStyles}
    >
      <span class="step-content transparent-container">
        <h4 class="{$customFont.accentSize}-font">Step 1: "Theme Preview"</h4>
        <span class="description flex">
          <article class="text-only">
            This neutral passage exists only to preview your theme. It has no
            plot, only layout and rhythm. Scan spacing, contrast, and hierarchy
            across headings, paragraphs, inline emphasis, and controls. Adjust
            type, colors, borders, and shadows, then see how each change
            propagates across components on this screen.
          </article>
        </span>
      </span>
      <span
        class="step-options transparent-container {$customFont.accentSize}-font"
      >
        {#each options as option, i}
          <button
            id="option-0"
            class="void-btn flex-row gap-8"
            onpointerover={() => {
              focusedOption = i;
              blurActiveBtn();
            }}
            onpointerout={() => (focusedOption = null)}
            onfocus={() => (focusedOption = i)}
            onblur={() => (focusedOption = null)}
          >
            {option}
            <SelectorSVG
              focused={focusedOption === i}
              disabled={false}
              hideForMobiles={true}
              color={$customFont.accentColor}
              {selectorSize}
            />
          </button>
        {/each}
      </span>
      <span
        class="bg-image"
        style:opacity={$customStyling.bgPictureOpacity / 100}
      ></span>
    </section>
  {/if}
  <ThemeSettings {table} />
  <StylingController />
</div>

<FooterLinks />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .preferred-setup {
    animation: none;
    @include navy;
  }

  .container {
    flex-direction: column;

    span {
      width: 100%;
      justify-content: space-around;
    }

    p {
      @include white-txt(0.5);
      @include font(caption);

      strong {
        @include white-txt(0.65);
      }
    }
  }

  .step-preview {
    position: relative;
    width: 100%;
    margin-bottom: 1.5rem;

    background-color: var(--theme-bg);
    color: var(--theme-text);
    font-family: var(--theme-font);

    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    @include gray-border;

    * {
      font-family: inherit;
      font-weight: inherit;
    }

    .transparent-container {
      width: 95%;
      background-color: var(--theme-panel-bg);
      animation: none;
    }

    h4 {
      width: auto;
      color: var(--theme-accent);
      font-style: inherit;
    }

    .step-content {
      padding: 1.5rem;

      article {
        width: 100%;
        text-align: left;
        color: inherit;
        text-shadow: inherit;

        &::-webkit-scrollbar-thumb {
          background: var(--theme-panel-border);
          border-radius: 4px;
        }

        &.text-only {
          background-color: var(--theme-panel-muted);
          padding: 1rem;
          border-radius: 0.5rem;
          @include gray-border;
        }
      }

      @include respond-up(small-desktop) {
        .description {
          flex-direction: row;

          article {
            overflow-y: scroll;
            padding-right: 0.5rem;
          }
        }
      }
    }

    .step-options {
      align-items: stretch;

      @include respond-up(tablet) {
        flex-direction: row;
      }

      button {
        width: 100%;
        justify-content: space-between;
        text-align: left;

        color: var(--theme-accent);
        fill: var(--theme-accent);
        stroke: var(--theme-accent);
        font-family: var(--theme-font);

        font-size: inherit;
        line-height: inherit;
        font-style: inherit;
        text-shadow: inherit;

        background-color: var(--theme-panel-muted);

        padding: 1rem;
        border-radius: 0.5rem;
        @include gray-border;

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          background-color: var(--theme-hover-muted);
          border-color: var(--theme-panel-border);
          filter: brightness(1.1);
        }
      }
    }

    *:not(.bg-image) {
      z-index: 1;
    }

    .bg-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      border: inherit;
      background-image: url('/preview-step.avif');
      object-fit: cover;
      background-position: bottom;
    }
  }
</style>
