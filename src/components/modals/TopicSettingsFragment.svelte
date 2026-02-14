<script lang="ts">
  import {
    defaultPromptSettings,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import dreamData from '@constants/dream';
  import countries from '@constants/countries.json';
  import { toastStore } from '@stores/toast.svelte';

  import Slider from '@components/utils/Slider.svelte';

  type SettingsMode = 'personal' | 'story-creation' | 'topic-edit';

  interface Props {
    mode: SettingsMode;
    initialValues: PromptSettings;
    onSave?: (settings: PromptSettings) => Promise<void>;
  }

  let { mode, initialValues, onSave }: Props = $props();

  // Local editing state - not the global store
  let settings = $state<PromptSettings>({ ...initialValues });

  // Reset local state when mode changes (different context opened)
  // This handles the case where Modal doesn't fully destroy/recreate the component
  $effect(() => {
    // Dependency on mode - when it changes, reset to new initialValues
    mode;
    settings = { ...initialValues };
  });

  const hasChanges = $derived(!arePromptSettingsEqual(settings, initialValues));

  const isDefault = $derived(
    arePromptSettingsEqual(settings, defaultPromptSettings()),
  );

  function handleReset() {
    settings = defaultPromptSettings();
  }

  async function handleSave() {
    if (onSave) await onSave(settings);
    if (mode === 'story-creation')
      toastStore.show('Controls applied successfully');
  }

  // Context-aware labels
  const contextLabel = $derived.by(() => {
    switch (mode) {
      case 'personal':
        return 'Your Default Controls';
      case 'story-creation':
        return 'Story Controls';
      case 'topic-edit':
        return 'Story Controls';
    }
  });

  const contextDesc = $derived.by(() => {
    switch (mode) {
      case 'personal':
        return 'These are saved to your profile and apply to all stories you play.';
      case 'story-creation':
        return 'Configure how this story will be generated.';
      case 'topic-edit':
        return 'Saved to this specific story. Players will use these by default.';
    }
  });

  const saveButtonText = $derived.by(() => {
    switch (mode) {
      case 'personal':
        return 'Save to Profile';
      case 'story-creation':
        return 'Apply';
      case 'topic-edit':
        return 'Save';
    }
  });
</script>

<div
  class="modal-content dream-container"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  <span class="flex gap-8">
    <h5>{contextLabel}</h5>
    <p class="soft-white-txt">{contextDesc}</p>
  </span>

  <div class="flex-row">
    <h4>Content</h4>
    <div class="container">
      <div class="input-container">
        <label for="style">Visual style</label>
        <select id="style" bind:value={settings.image_style}>
          {#each dreamData.imageStyle as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="input-container">
        <label for="language">Language</label>
        <select id="language" bind:value={settings.language}>
          {#each countries as { name }}
            <option value={name.toLocaleLowerCase()}>{name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Interactivity</h4>
    <div class="container">
      <div
        class="input-container"
        class:disabled={settings.kids_mode !== 'off'}
      >
        <label for="frequency">Control</label>
        <select
          id="frequency"
          bind:value={settings.interactivity}
          disabled={settings.kids_mode !== 'off'}
        >
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div
        class="input-container"
        class:disabled={settings.kids_mode !== 'off'}
      >
        <label for="difficulty">Difficulty</label>
        <select
          id="difficulty"
          bind:value={settings.difficulty}
          disabled={settings.kids_mode !== 'off'}
        >
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row" class:disabled={settings.kids_mode !== 'off'}>
    <h4>Length</h4>
    <div class="container">
      <Slider
        bind:sliderValue={settings.length}
        parameters={dreamData.min_max}
        inputValue={2}
        disabled={settings.kids_mode !== 'off'}
      />
    </div>
  </div>

  <div class="flex-row">
    <h4>Settings</h4>
    <div class="container">
      <div
        class="input-container"
        class:disabled={settings.kids_mode !== 'off'}
      >
        <label for="reading-style">Reading style</label>
        <select
          id="reading-style"
          bind:value={settings.reading_style}
          disabled={settings.kids_mode !== 'off'}
        >
          {#each dreamData.readingStyle as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <!-- TODO: Enable the Kids Mode when available -->
      <div
        class="kids-mode input-container transition round-8 shad"
        class:selected={settings.kids_mode}
        style:opacity="0.5"
      >
        <label for="kids-mode transition">Kids mode</label>
        <select id="kids-mode" bind:value={settings.kids_mode} disabled>
          <!-- <option value="off">Off</option> -->
          <option value="off">Coming Soon</option>
          {#each dreamData.kidsMode as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex flex-row justify-center gap-md">
    <button
      class="btn-alert red-btn"
      onclick={handleReset}
      disabled={isDefault}
    >
      Reset to Default
    </button>
    <button
      class="btn-signal green-btn"
      onclick={handleSave}
      disabled={!hasChanges && mode !== 'story-creation'}
    >
      {saveButtonText}
    </button>
  </div>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    width: 100%;
    margin-inline: 0;
  }

  .container {
    flex-wrap: wrap;

    @include respond-up(large-desktop) {
      flex-wrap: nowrap;
    }
  }

  .disabled {
    opacity: 0.5;

    select {
      color: transparent;
    }
  }

  .kids-mode {
    padding: 0.5rem;
    @include deep-green(0.5);

    label {
      @include green(1, text);
    }

    select {
      animation: none;
      @include dark-green;
    }

    &.selected {
      @include deep-green;

      label {
        @include bright(150%);
      }
    }
  }

  .justify-center {
    justify-content: center;
  }
</style>
