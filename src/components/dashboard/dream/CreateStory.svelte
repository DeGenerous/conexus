<script lang="ts">
  import countries from '@constants/countries.json';
  import dreamData from '@constants/dream';
  import { AdminApp } from '@lib/admin';
  import {
    storyData,
    promptSettings,
    openPrompt,
    tablePrompt,
    clearAllData,
  } from '@stores/dream.svelte';
  import generatePrompt from '@utils/prompt';
  import openModal from '@stores/modal.svelte';
  import { resetDreamModal } from '@constants/modal';
  import {
    GetCache,
    SetCache,
    ONE_YEAR_TTL,
    DRAFTS_KEY,
  } from '@constants/cache';

  import Slider from './create/Slider.svelte';
  import Characters from './create/Characters.svelte';
  import Scenario from './create/Scenario.svelte';
  import WritingStyle from './create/WritingStyle.svelte';
  import { checkUserState } from '@utils/route-guard';

  let admin = new AdminApp();

  let promptFormat: 'Table' | 'Open' = $state('Table');

  $effect(() => {
    checkUserState('/dashboard/dream/create', true);
  });

  let validation = $derived(
    $storyData.name &&
      $storyData.description &&
      $storyData.description.length > 100 &&
      $storyData.imagePrompt.length <= 1400 &&
      $storyData.category,
  );

  // const saveDraft = () => {
  //   const promptData: TablePrompt | string =
  //     promptFormat === 'Table' ? $tablePrompt : $openPrompt;
  //   console.log($storyData);
  //   console.log($promptSettings);
  //   console.log(promptData);
  // }

  const generateStory = async () => {
    const promptData: TablePrompt | string =
      promptFormat === 'Table' ? $tablePrompt : $openPrompt;
    await admin.createNewStory(
      generatePrompt($storyData, $promptSettings, promptData),
    );
    clearAllData();
    // TODO: openModal -> navigate to the created story in /dream/manage/
  };
</script>

<!-- CATEGORY, TITLE, DESCRIPTION, IMAGE PROMPT -->
<div class="dream-container">
  <div class="input-container">
    <label for="category">Select Category</label>
    <select
      id="category"
      class:red-border={!$storyData.category}
      bind:value={$storyData.category}
    >
      <option value={null} selected={true} disabled hidden>Select</option>
      {#await admin.fetchCategories() then categories}
        {#each categories as { name, id }}
          <option value={id}>{name}</option>
        {/each}
      {/await}
    </select>
  </div>

  <hr />

  <div class="input-container">
    <label for="topic">Story</label>
    <input
      id="topic"
      class:red-border={!$storyData.name}
      type="text"
      placeholder="Enter Story Name"
      bind:value={$storyData.name}
    />
  </div>

  <div class="input-container">
    <label for="description">Description</label>
    <textarea
      id="description"
      class:red-border={$storyData.description.length < 100}
      placeholder="Describe the central premise, key themes, the main character's emotional journey ahead, and what kicks off the plot. Focus on what’s at stake, what makes the world unique, and why this story matters - make users want to see more."
      rows="3"
      bind:value={$storyData.description}
      style:min-height={
        $storyData.description.length > 500
          ? ($storyData.description.length / 50) + "rem"
          : ''
      }
    ></textarea>
  </div>

  {#if $storyData.description && $storyData.description.length < 100}
    <p class="validation">
      Description should be longer, enter {100 - $storyData.description.length} more
      characters
    </p>
  {/if}

  <hr />

  <div class="input-container">
    <label for="image-prompts">Image Generation Instructions</label>
    <textarea
      id="image-prompts"
      class:red-border={$storyData.imagePrompt.length > 1400}
      placeholder="What does your world feel like, what visual mood are you going for, and what elements stand out? Describe the environment, style, lighting, and textures you want to see."
      rows="2"
      bind:value={$storyData.imagePrompt}
      style:min-height={
        $storyData.imagePrompt.length > 500
          ? ($storyData.imagePrompt.length / 50) + "rem"
          : ''
      }
    ></textarea>
  </div>

  {#if $storyData.imagePrompt && $storyData.imagePrompt.length > 1400}
    <p class="validation">
      Please shorten your message to 1400 characters or less, you’ve typed {$storyData
        .imagePrompt.length}
    </p>
  {/if}
</div>

<!-- MAIN SETTINGS -->
<div class="dream-container">
  <div class="flex-row">
    <h4>Content</h4>
    <div class="container">
      <div class="input-container">
        <label for="style">Visual style</label>
        <select id="style" bind:value={$promptSettings.imageStyle}>
          {#each dreamData.imageStyle as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="input-container">
        <label for="language">Language</label>
        <select id="language" bind:value={$promptSettings.language}>
          {#each countries as { name }}
            <option value={name}>{name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Interactivity</h4>
    <div class="container">
      <div class="input-container">
        <label for="frequency">Control</label>
        <select id="frequency" bind:value={$promptSettings.interactivity}>
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div class="input-container">
        <label for="difficulty">Difficulty</label>
        <select id="difficulty" bind:value={$promptSettings.difficulty}>
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Length</h4>
    <div class="container">
      <Slider
        bind:sliderValue={$promptSettings.length}
        parameters={dreamData.min_max}
        inputValue={2}
      />
    </div>
  </div>

  <div class="flex-row">
    <h4>Text</h4>
    <div class="container">
      <div
        class="reading-style input-container transition round-8 shad"
        class:disabled={$promptSettings.kidsMode !== null}
      >
        <label for="reading-style">Reading style</label>
        <select
          id="reading-style"
          bind:value={$promptSettings.readingStyle}
          disabled={$promptSettings.kidsMode !== null}
        >
          {#each dreamData.readingStyle as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div
        class="kids-mode input-container transition round-8 shad"
        class:selected={$promptSettings.kidsMode !== null}
      >
        <label for="kids-mode transition">Kids mode</label>
        <select id="kids-mode" bind:value={$promptSettings.kidsMode}>
          <option value={null}>Off</option>
          {#each dreamData.kidsMode as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Format</h4>
    <div class="container">
      <button
        class="void-btn dream-radio-btn"
        class:active={promptFormat === 'Table'}
        onclick={() => (promptFormat = 'Table')}
      >
        Table
      </button>
      <button
        class="void-btn dream-radio-btn"
        class:active={promptFormat === 'Open'}
        onclick={() => (promptFormat = 'Open')}
      >
        Open
      </button>
    </div>
  </div>
</div>

{#if promptFormat === 'Table'}
  <div class="dream-container">
    <div class="flex-row">
      <h4>Set Premise</h4>
      <textarea
        id="premise"
        placeholder="Summarize the core of your story—who the main character is, what challenge they face, and what’s at stake in their journey."
        rows="2"
        bind:value={$tablePrompt.premise}
        style:min-height={
          $tablePrompt.premise.length > 500
            ? ($tablePrompt.premise.length / 50) + "rem"
            : ''
        }
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set Environment</h4>
      <textarea
        id="setting"
        placeholder="Describe the time and place where your story unfolds, whether it's a futuristic city, a medieval kingdom, a distant galaxy, or somewhere beyond imagination."
        rows="2"
        bind:value={$tablePrompt.environment}
        style:min-height={
          $tablePrompt.environment.length > 500
            ? ($tablePrompt.environment.length / 50) + "rem"
            : ''
        }
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set Exposition</h4>
      <textarea
        id="exposition"
        placeholder="Set the stage for your story—introduce the world, key events leading up to the present, and any important background details the reader needs to know."
        rows="2"
        bind:value={$tablePrompt.exposition}
        style:min-height={
          $tablePrompt.exposition.length > 500
            ? ($tablePrompt.exposition.length / 50) + "rem"
            : ''
        }
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set First Action</h4>
      <textarea
        id="first-act"
        placeholder="Describe how the story begins—introduce the main character, their current situation, and the inciting event that sets the plot in motion."
        rows="2"
        bind:value={$tablePrompt.firstAction}
        style:min-height={
          $tablePrompt.firstAction.length > 500
            ? ($tablePrompt.firstAction.length / 50) + "rem"
            : ''
        }
      ></textarea>
    </div>
  </div>

  <Characters />

  <Scenario />

  <WritingStyle />

  <div class="dream-container">
    <h4>
      If you have anything else you wish to add to improve the story, you may
      write it here
    </h4>
    <textarea
      placeholder="Add any additional styling, references, details, twists, character ideas, or world-building elements you’d like to include in your story."
      rows="2"
      bind:value={$tablePrompt.additionalData}
      style:min-height={
        $tablePrompt.additionalData.length > 500
          ? ($tablePrompt.additionalData.length / 50) + "rem"
          : ''
      }
    ></textarea>
  </div>
{:else}
  <div class="dream-container">
    <h4>Write up a scenario of Your Story</h4>
    <textarea
      id="blank"
      placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
      rows="5"
      bind:value={$openPrompt}
      style:min-height={
        $openPrompt.length > 1000
          ? ($openPrompt.length / 50) + "rem"
          : ''
      }
    ></textarea>
  </div>
{/if}

{#if !validation}
  <p class="validation">Fill all required fields</p>
{/if}

<div class="flex-row flex-wrap">
  <button
    class="red-btn blur"
    onclick={() => openModal(resetDreamModal, 'Reset', clearAllData)}
  >
    Reset
  </button>
  <!-- <button class="rose-btn blur" onclick={saveDraft}> Save a draft </button> -->
  <button class="green-btn blur" onclick={generateStory} disabled={!validation}>
    Create a DREAM
  </button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .reading-style {
    padding-block: 0.5rem;
    @include gray(0.25);

    select {
      animation: none;
      @include dark-blue;
    }

    &.disabled {
      opacity: 0.5;

      select {
        @include dark-blue(1, text);
      }
    }
  }

  .kids-mode {
    padding-block: 0.5rem;
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
