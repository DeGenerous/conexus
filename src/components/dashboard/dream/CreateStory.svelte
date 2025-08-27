<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { derived } from 'svelte/store';

  import { GetCache, CURRENT_DRAFT_KEY } from '@constants/cache';
  import countries from '@constants/countries.json';
  import dreamData from '@constants/dream';
  import { resetDreamModal, openStoryManage } from '@constants/modal';
  import Topic from '@lib/topics';
  import {
    storyData,
    promptSettings,
    openPrompt,
    tablePrompt,
    clearAllData,
    currentDraft,
    draftsIndex,
  } from '@stores/dream.svelte';
  import openModal, { showModal, draftsManager } from '@stores/modal.svelte';
  import generatePrompt from '@utils/prompt';
  import { ensureCreator, userState } from '@utils/route-guard';
  import Drafts from '@utils/story-drafts';

  import Slider from '@components/dashboard/dream/create/Slider.svelte';
  import Characters from '@components/dashboard/dream/create/Characters.svelte';
  import Scenario from '@components/dashboard/dream/create/Scenario.svelte';
  import WritingStyle from '@components/dashboard/dream/create/WritingStyle.svelte';
  import CategoryFetcher from '@components/dashboard/new/common/CategoryFetcher.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';

  onMount(ensureCreator);

  let topic = new Topic();

  let promptFormat: 'Table' | 'Open' = $state('Open');

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  onMount(async () => {
    isAdmin = await userState('admin');
    isCreator = await userState('creator');
  });

  let validation = $derived(
    $storyData.name &&
      $storyData.description &&
      $storyData.description.length > 100 &&
      $storyData.imagePrompt.length <= 1400 &&
      $storyData.category_id,
  );

  // DRAFTS

  const fingerprint = derived(
    [storyData, promptSettings, openPrompt, tablePrompt],
    ([$s, $p, $o, $t]) => JSON.stringify([$s, $p, $o, $t]),
  );

  let timer: ReturnType<typeof setTimeout>;

  const unsub = fingerprint.subscribe(() => {
    clearTimeout(timer);
    timer = setTimeout(() => Drafts.save(), 300000); // 5 minutes debounce
  });

  onDestroy(unsub);

  const saveDraft = () => Drafts.save();

  onMount(() => {
    const draftID = GetCache<string>(CURRENT_DRAFT_KEY);
    if (draftID) Drafts.restore(draftID);
    else Drafts.create();

    // Last‑chance save on hard refresh
    window.addEventListener('beforeunload', saveDraft);
    return () => window.removeEventListener('beforeunload', saveDraft);
  });

  // Save draft on <Control + 's'> or <Command + 's'>
  const onkeydown = (event: KeyboardEvent) => {
    const { key, ctrlKey, metaKey, repeat } = event;
    if (repeat) return;
    if (!ctrlKey && !metaKey) return;
    event.preventDefault();
    if (key === 's') saveDraft();
  };

  let lastSavedAgo = $state<string>('');

  // Recompute "last saved" string
  const updateLastSavedLabel = () => {
    if (!$currentDraft?.updated_at) return;

    const now = Date.now();
    const diffMs = now - Number($currentDraft.updated_at);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 2) {
      lastSavedAgo = 'just now';
    } else if (diffSec < 60) {
      lastSavedAgo = `${diffSec}s ago`;
    } else if (diffMin < 60) {
      lastSavedAgo = `${diffMin}m ago`;
    } else if (diffHr < 24) {
      lastSavedAgo = `${diffHr}h ago`;
    } else if (diffDay < 30) {
      lastSavedAgo = `${diffDay}d ago`;
    } else {
      lastSavedAgo = `${diffMonth}mo ago`;
    }
  };

  // Timer that updates the label every 60 seconds
  let interval: ReturnType<typeof setInterval>;

  let selectedSectionId = $state('');

  onMount(() => {
    updateLastSavedLabel(); // run immediately on load

    interval = setInterval(() => {
      updateLastSavedLabel();
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // cleanup on destroy
  });

  const openDraftsManager = () => {
    $draftsIndex = Drafts.list();
    $showModal = true;
    $draftsManager = true;
  };

  // CREATE DREAM

  const generateStory = async () => {
    const promptData: TablePrompt | string =
      promptFormat === 'Table' ? $tablePrompt : $openPrompt;
    await topic.newTopic(
      generatePrompt($storyData, $promptSettings, promptData),
    );
    const storyLink = `/dashboard/dream/manage/${$storyData.name}`;
    openModal(
      openStoryManage,
      'Manage Story',
      () => (window.location.href = storyLink),
    );
    Drafts.delete(GetCache(CURRENT_DRAFT_KEY)!);
    clearAllData();
  };
</script>

<svelte:window {onkeydown} />

<!-- DRAFTS -->
{#if $currentDraft || $draftsIndex.length}
  <div class="drafts-wrapper fade-in container flex-row flex-wrap">
    {#if $currentDraft}
      <h5>
        <!-- 📝 Working on draft: {$currentDraft.id.split('-')[0]} -->
        <strong>
          - Last saved: {lastSavedAgo}
        </strong>
      </h5>
    {:else}
      <h5>There is no draft selected</h5>
    {/if}
    <span class="flex-row">
      {#if $currentDraft}
        <SaveSVG onclick={saveDraft} />
      {:else}
        <button class="green-btn" onclick={saveDraft}>Create a draft</button>
      {/if}
      <button class="rose-btn" onclick={openDraftsManager}>
        Manage Drafts
      </button>
    </span>
  </div>
{/if}

<!-- CATEGORY, TITLE, DESCRIPTION, IMAGE PROMPT -->
<div class="dream-container">
  <CategoryFetcher bind:selectedSectionId>
    {#snippet Data(
      loadingSections: boolean,
      errorSections: string,
      sections: Section[],
      loadingCategories: boolean,
      errorCategories: string,
      categories: Category[],
    )}
      {#if isAdmin}
        {#if loadingSections}
          <p>Loading sections...</p>
        {:else if errorSections}
          <p class="validation">{errorSections}</p>
        {:else}
          <div class="input-container">
            <label for="sections">Sections</label>
            {#if sections.length > 0}
              <select id="sections" bind:value={selectedSectionId}>
                <option value="">Select a section</option>
                {#each sections as { id, name }}
                  <option value={id}>{name}</option>
                {/each}
              </select>
            {:else}
              <p class="validation">No sections found</p>
            {/if}
          </div>
        {/if}
      {/if}

      {#if loadingCategories}
        <p>Loading categories...</p>
      {:else if errorCategories}
        <p class="validation">{errorCategories}</p>
      {:else}
        <div class="input-container">
          <label for="category">Select Category</label>
          <select
            id="category"
            class:red-border={!$storyData.category_id}
            bind:value={$storyData.category_id}
          >
            <option value={null} selected={true} disabled hidden>Select</option>
            {#each categories as { id, name }}
              <option value={id}>{name}</option>
            {/each}
          </select>
        </div>
      {/if}
    {/snippet}
  </CategoryFetcher>
  <!-- <label for="category">Select Category</label>
    <select
      id="category"
      class:red-border={!$storyData.category_id}
      bind:value={$storyData.category_id}
    >
      <option value={null} selected={true} disabled hidden>Select</option>
      {#await isAdmin ? category.listAdminCategories('') : category.listCreatorCategories() then categories}
        {#each categories as { name, id }}
          <option value={id}>{name}</option>
        {/each}
      {/await}
    </select> -->

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
      style:min-height={$storyData.description.length > 500
        ? $storyData.description.length / 50 + 'rem'
        : ''}
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
      style:min-height={$storyData.imagePrompt.length > 500
        ? $storyData.imagePrompt.length / 50 + 'rem'
        : ''}
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
      <div
        class="input-container"
        class:disabled={$promptSettings.kidsMode !== null}
      >
        <label for="frequency">Control</label>
        <select
          id="frequency"
          bind:value={$promptSettings.interactivity}
          disabled={$promptSettings.kidsMode !== null}
        >
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>

      <div
        class="input-container"
        class:disabled={$promptSettings.kidsMode !== null}
      >
        <label for="difficulty">Difficulty</label>
        <select
          id="difficulty"
          bind:value={$promptSettings.difficulty}
          disabled={$promptSettings.kidsMode !== null}
        >
          {#each dreamData.min_max as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row" class:disabled={$promptSettings.kidsMode !== null}>
    <h4>Length</h4>
    <div class="container">
      <Slider
        bind:sliderValue={$promptSettings.length}
        parameters={dreamData.min_max}
        inputValue={2}
        disabled={$promptSettings.kidsMode !== null}
      />
    </div>
  </div>

  <div class="flex-row">
    <h4>Settings</h4>
    <div class="container">
      <div
        class="input-container"
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
        style:min-height={$tablePrompt.premise.length > 500
          ? $tablePrompt.premise.length / 50 + 'rem'
          : ''}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set Environment</h4>
      <textarea
        id="setting"
        placeholder="Describe the time and place where your story unfolds, whether it's a futuristic city, a medieval kingdom, a distant galaxy, or somewhere beyond imagination."
        rows="2"
        bind:value={$tablePrompt.environment}
        style:min-height={$tablePrompt.environment.length > 500
          ? $tablePrompt.environment.length / 50 + 'rem'
          : ''}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set Exposition</h4>
      <textarea
        id="exposition"
        placeholder="Set the stage for your story—introduce the world, key events leading up to the present, and any important background details the reader needs to know."
        rows="2"
        bind:value={$tablePrompt.exposition}
        style:min-height={$tablePrompt.exposition.length > 500
          ? $tablePrompt.exposition.length / 50 + 'rem'
          : ''}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set First Action</h4>
      <textarea
        id="first-act"
        placeholder="Describe how the story begins—introduce the main character, their current situation, and the inciting event that sets the plot in motion."
        rows="2"
        bind:value={$tablePrompt.firstAction}
        style:min-height={$tablePrompt.firstAction.length > 500
          ? $tablePrompt.firstAction.length / 50 + 'rem'
          : ''}
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
      style:min-height={$tablePrompt.additionalData.length > 500
        ? $tablePrompt.additionalData.length / 50 + 'rem'
        : ''}
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
      style:min-height={$openPrompt.length > 1000
        ? $openPrompt.length / 50 + 'rem'
        : ''}
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
    Reset Data
  </button>
  <button class="rose-btn blur" onclick={() => Drafts.create()}
    >Start New Draft</button
  >
  <button class="green-btn blur" onclick={generateStory} disabled={!validation}>
    Create a DREAM
  </button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .drafts-wrapper {
    width: 95%;
    max-width: 100rem;
    justify-content: space-between;
    animation: none;
    @include rose(0.25);

    h5 {
      @include rose(1, text, bright);
      strong {
        @include white-txt(soft);
      }
    }

    span {
      width: 100%;

      @include respond-up(tablet) {
        width: auto;
      }
    }
  }

  #blank {
    min-height: 25rem;

    @include respond-up(small-desktop) {
      min-height: 12vw;
    }
  }

  .disabled {
    opacity: 0.5;

    select {
      color: transparent;
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
