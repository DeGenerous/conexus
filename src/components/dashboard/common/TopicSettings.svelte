<script lang="ts">
  import { type Snippet } from 'svelte';

  import { promptSettings } from '@stores/dream.svelte';
  import dreamData from '@constants/dream';
  import countries from '@constants/countries.json';

  import Slider from '@components/utils/Slider.svelte';

  let {
    promptFormat = $bindable<'Table' | 'Open'>('Open'),
    nostyling = false,
    children,
  }: {
    promptFormat?: 'Table' | 'Open';
    nostyling?: boolean;
    children: Snippet<
      [
        promptFormat: 'Table' | 'Open',
        setPromptFormat: (format: 'Table' | 'Open') => void,
        saveChanges?: () => Promise<void>,
        resetSettings?: () => void,
      ]
    >;
  } = $props();

  const setPromptFormat = (format: 'Table' | 'Open') => {
    promptFormat = format;
  };
</script>

<section class="flex" class:dream-container={!nostyling} class:nostyling>
  <div class="flex-row">
    <h4>Content</h4>
    <div class="container">
      <div class="input-container">
        <label for="style">Visual style</label>
        <select id="style" bind:value={$promptSettings.image_style}>
          {#each dreamData.imageStyle as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="input-container">
        <label for="language">Language</label>
        <select id="language" bind:value={$promptSettings.language}>
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
        class:disabled={$promptSettings.kids_mode !== 'off'}
      >
        <label for="frequency">Control</label>
        <select
          id="frequency"
          bind:value={$promptSettings.interactivity}
          disabled={$promptSettings.kids_mode !== 'off'}
        >
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div
        class="input-container"
        class:disabled={$promptSettings.kids_mode !== 'off'}
      >
        <label for="difficulty">Difficulty</label>
        <select
          id="difficulty"
          bind:value={$promptSettings.difficulty}
          disabled={$promptSettings.kids_mode !== 'off'}
        >
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row" class:disabled={$promptSettings.kids_mode !== 'off'}>
    <h4>Length</h4>
    <div class="container">
      <Slider
        bind:sliderValue={$promptSettings.length}
        parameters={dreamData.min_max}
        inputValue={2}
        disabled={$promptSettings.kids_mode !== 'off'}
      />
    </div>
  </div>

  <div class="flex-row">
    <h4>Settings</h4>
    <div class="container">
      <div
        class="input-container"
        class:disabled={$promptSettings.kids_mode !== 'off'}
      >
        <label for="reading-style">Reading style</label>
        <select
          id="reading-style"
          bind:value={$promptSettings.reading_style}
          disabled={$promptSettings.kids_mode !== 'off'}
        >
          {#each dreamData.readingStyle as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <!-- TODO: Enable the Kids Mode when available -->
      <div
        class="kids-mode input-container transition round-8 shad"
        class:selected={$promptSettings.kids_mode}
        style:opacity="0.5"
      >
        <label for="kids-mode transition">Kids mode</label>
        <select id="kids-mode" bind:value={$promptSettings.kids_mode} disabled>
          <!-- <option value="off">Off</option> -->
          <option value="off">Coming Soon</option>
          {#each dreamData.kidsMode as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  {@render children(promptFormat, setPromptFormat)}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .nostyling {
    animation: none !important;
    background-color: transparent;
    border: none;
    border-radius: 0;
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
</style>
