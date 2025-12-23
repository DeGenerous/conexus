<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import {
    promptSettings,
    resetSettings,
    isPromptSettingsDefault,
    defaultPromptSettings,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';
  import { customFont, customStyling } from '@stores/customization.svelte';
  import { getPersonalSetup, setPersonalSetup } from '@stores/account.svelte';
  import { checkUserRoles } from '@utils/route-guard';
  import { isGuest } from '@stores/account.svelte';

  import Dropdown from '@components/utils/Dropdown.svelte';
  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';
  import ThemeSettings from '@components/utils/ThemeSettings.svelte';
  import StylingController from '@components/utils/StylingController.svelte';
  import SelectorSVG from '@components/icons/Selector.svelte';
  import FooterLinks from '@components/dashboard/common/FooterLinks.svelte';

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

  const compareSettings = $derived.by(() =>
    arePromptSettingsEqual($promptSettings, originalSettings),
  );

  const saveChanges = async () => {
    await account.createOrUpdatePromptSettings($promptSettings);
    originalSettings = await account.getPromptSettings();
  };

  const resetPromptSettings = () => {
    openModal(ensureMessage('reset your personal settings'), 'Reset', () => {
      resetSettings();
      saveChanges();
    });
  };

  const blurActiveBtn = () => {
    if (document.activeElement!.tagName == 'BUTTON') {
      const activeOption = document.activeElement as HTMLButtonElement;
      activeOption.blur();
    }
  };
</script>

<h3>Personal Settings & Theme</h3>

<p>
  Make stories fit you. Set styling, tone, pace, difficulty, content filters,
  and continuity.
</p>

<section class="preferred-setup dream-container">
  <div class="flex-row">
    <h4>Preferred Settings</h4>
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
          Use your profile’s settings, overriding the story’s defaults.
        {:else}
          Play with author defaults, personal preferences will not be applied.
        {/if}
      </p>
    </div>
  </div>

  <!-- <div class="flex-row">
    <h4>Preferred Theme</h4>
    <div class="container">
      <span class="flex-row">
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredTheme === 'personal'}
          onclick={() => {
            preferredTheme = 'personal';
            updatePersonalSetup();
          }}
        >
          Personal
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={preferredTheme === 'default'}
          onclick={() => {
            preferredTheme = 'default';
            updatePersonalSetup();
          }}
        >
          Default
        </button>
      </span>
      <p>
        {#if preferredTheme === 'personal'}
          Apply your saved theme (colors, fonts, spacing) to all stories you
          play until you switch back.
        {:else}
          Apply the author’s default theme to all stories you play until you
          switch back.
        {/if}
      </p>
    </div>
  </div> -->

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

<Dropdown name="Personal Settings" {table}>
  <TopicSettings nostyling={true}>
    {#snippet children()}
      <span class="flex-row flex-wrap">
        <button
          class="red-btn"
          onclick={resetPromptSettings}
          disabled={isPromptSettingsDefault($promptSettings)}
        >
          Reset to Default
        </button>
        <button
          class="green-btn"
          onclick={saveChanges}
          disabled={compareSettings}
        >
          Save Settings
        </button>
      </span>
    {/snippet}
  </TopicSettings>
</Dropdown>

<Dropdown name="Personal Theme" {table}>
  {#if $customFont && $customStyling}
    <section
      class="step-preview flex round-8 pad-24 {$customFont.baseSize}-font"
      class:text-shad={$customFont.shadow}
      style:font-family={$customFont.family}
      style:font-weight={$customFont.bold ? 'bold' : 'normal'}
      style:font-style={$customFont.italic ? 'italic' : ''}
      style:color={$customFont.baseColor}
      style:background-color={$customStyling.bgColor}
    >
      <h4
        class="{$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        style:font-style={$customFont.italic ? 'italic' : ''}
        style:color={$customFont.accentColor}
        style:font-family={$customFont.family}
      >
        Preview Step
      </h4>
      <article style:font-family={$customFont.family}>
        This neutral passage exists only to preview your theme. It has no plot,
        only layout and rhythm. Scan spacing, contrast, and hierarchy across
        headings, paragraphs, inline emphasis, and controls. Adjust type,
        colors, borders, and shadows, then see how each change propagates across
        components on this screen.
      </article>
      <span
        class="options {$customFont.accentSize}-font"
        class:text-shad={$customFont.shadow}
        style:font-family={$customFont.family}
        style:font-style={$customFont.italic ? 'italic' : ''}
        style:color={$customFont.accentColor}
      >
        {#each options as option, i}
          <button
            id="option-0"
            class="void-btn flex-row gap-8"
            style:font-family={$customFont.family}
            onpointerover={() => {
              focusedOption = i;
              blurActiveBtn();
            }}
            onpointerout={() => (focusedOption = null)}
            onfocus={() => (focusedOption = i)}
            onblur={() => (focusedOption = null)}
          >
            <SelectorSVG
              focused={focusedOption === i}
              disabled={false}
              hideForMobiles={true}
              color={$customFont.accentColor}
              {selectorSize}
            />
            {option}
          </button>
        {/each}
      </span>
      <span
        class="bg-image"
        style:opacity={$customStyling.bgPictureOpacity / 100}
      ></span>
    </section>
  {/if}
  <StylingController />
  <ThemeSettings {table} />
</Dropdown>

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
    background-color: black;
    @include gray-border;

    h4 {
      width: auto;
    }

    article {
      width: 100%;
      padding-inline: 1rem;
      text-align: left;
      color: inherit;
      text-shadow: inherit;

      @include respond-up(tablet) {
        width: clamp(250px, 95%, 70rem);
      }

      @include respond-up(small-desktop) {
        width: 100%;
      }
    }

    .options {
      align-items: flex-start;
      @include box-shadow;

      @include respond-up(small-desktop) {
        width: 100%;
      }

      button {
        width: 100%;
        justify-content: flex-start;
        text-align: left;
        fill: $cyan;
        stroke: $cyan;
        color: $cyan;

        font-size: inherit;
        line-height: inherit;
        color: inherit;
        font-style: inherit;
        text-shadow: inherit;

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          filter: hue-rotate(30deg) saturate(200%);
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
