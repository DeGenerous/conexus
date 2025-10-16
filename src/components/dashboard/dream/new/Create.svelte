<script lang="ts">
  import { onMount } from 'svelte';
  import { derived } from 'svelte/store';

  import { GetCache, CURRENT_DRAFT_KEY } from '@constants/cache';
  import { ensureMessage, openStoryManage } from '@constants/modal';
  import Topic from '@lib/topics';
  import {
    storyData,
    promptSettings,
    openPrompt,
    tablePrompt,
    clearAllData,
    currentDraft,
  } from '@stores/dream.svelte';
  import openModal from '@stores/modal.svelte';
  import generatePrompt from '@utils/prompt';
  import { ensureCreator } from '@utils/route-guard';
  import Drafts from '@utils/story-drafts';

  import Characters from '@components/dashboard/dream/new/create/Characters.svelte';
  import Scenario from '@components/dashboard/dream/new/create/Scenario.svelte';
  import WritingStyle from '@components/dashboard/dream/new/create/WritingStyle.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import CategoryFetcher from '@components/dashboard/common/CategoryFetcher.svelte';
  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';

  const topic = new Topic();

  let isAdmin = $state(false);
  let selectedSectionId = $state('');
  let lastSavedAgo = $state<string>('unsaved');

  $effect(() => {
    if (selectedSectionId) $storyData.category_id = '';
  });

  let promptFormat: 'Table' | 'Open' = $state('Open');

  let validation = $derived(
    $storyData.name &&
      $storyData.description &&
      $storyData.description.length > 100 &&
      $storyData.image_prompt.length <= 1400 &&
      $storyData.category_id,
  );

  const AUTO_SAVE_DELAY_MS = 5 * 60 * 1000;
  const LAST_SAVED_REFRESH_MS = 2000;

  const fingerprint = derived(
    [storyData, promptSettings, openPrompt, tablePrompt],
    ([$s, $p, $o, $t]) => JSON.stringify([$s, $p, $o, $t]),
  );

  let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

  const clearAutoSaveTimer = () => {
    if (!autoSaveTimer) return;
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  };

  const updateLastSavedLabel = () => {
    if (!$currentDraft?.updated_at) {
      lastSavedAgo = 'unsaved';
      return;
    }

    const updated = new Date($currentDraft.updated_at);
    const diffMs = Math.max(0, Date.now() - updated.getTime());
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMon = Math.floor(diffDay / 30);

    if (diffSec < 2) lastSavedAgo = 'just now';
    else if (diffSec < 60) lastSavedAgo = `${diffSec}s ago`;
    else if (diffMin < 60) lastSavedAgo = `${diffMin}m ago`;
    else if (diffHr < 24) lastSavedAgo = `${diffHr}h ago`;
    else if (diffDay < 30) lastSavedAgo = `${diffDay}d ago`;
    else lastSavedAgo = `${diffMon}mo ago`;
  };

  const saveDraft = async () => {
    clearAutoSaveTimer();
    await Drafts.save($currentDraft?.id);
    updateLastSavedLabel();
  };

  const triggerSaveDraft = () => {
    void saveDraft();
  };

  const createDraft = async () => {
    clearAutoSaveTimer();
    clearAllData();
    lastSavedAgo = 'unsaved';
    await Drafts.create();
    updateLastSavedLabel();
  };

  const queueAutoSave = () => {
    if (!$currentDraft?.id) return;
    clearAutoSaveTimer();
    autoSaveTimer = setTimeout(() => {
      triggerSaveDraft();
    }, AUTO_SAVE_DELAY_MS);
  };

  onMount(() => {
    let destroyed = false;
    let isInitialFingerprintRun = true;

    void (async () => {
      const resp = await ensureCreator();
      if (!destroyed) isAdmin = resp.isAdmin;
    })();

    void (async () => {
      const draftID = GetCache<string>(CURRENT_DRAFT_KEY);
      if (draftID) await Drafts.restore(draftID);
      else await Drafts.create();

      if (!destroyed) updateLastSavedLabel();
    })();

    const unsubscribeFingerprint = fingerprint.subscribe(() => {
      if (isInitialFingerprintRun) {
        isInitialFingerprintRun = false;
        return;
      }

      queueAutoSave();
    });

    const handleBeforeUnload = () => {
      triggerSaveDraft();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const lastSavedInterval = setInterval(() => {
      updateLastSavedLabel();
    }, LAST_SAVED_REFRESH_MS);

    return () => {
      destroyed = true;
      clearAutoSaveTimer();
      unsubscribeFingerprint();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(lastSavedInterval);
    };
  });

  // CREATE DREAM

  const generateStory = async () => {
    const promptData: TablePrompt | string =
      promptFormat === 'Table' ? $tablePrompt : $openPrompt;
    const topic_id = await topic.newTopic(
      generatePrompt($storyData, $promptSettings, promptData),
    );
    if (!topic_id) return;
    
    const storyLink = `/dashboard/topic/${topic_id}`;
    openModal(
      openStoryManage,
      'Manage Story',
      () => (window.location.href = storyLink),
    );  
    clearAutoSaveTimer();
    const cachedDraftId = GetCache<string>(CURRENT_DRAFT_KEY);
    if (cachedDraftId) await Drafts.delete(cachedDraftId);
    currentDraft.set(null);
    clearAllData();
    lastSavedAgo = 'unsaved';
  };
</script>

<!-- DRAFT SAVING -->
{#if $currentDraft}
  <div class="draft-wrapper fade-in container flex-row flex-wrap">
    <h5>
      📝 Working on draft: {$currentDraft.id?.split('-')[0]}
      <strong>
        - Last saved: {lastSavedAgo}
      </strong>
    </h5>
    <span class="flex-row">
      <SaveSVG onclick={triggerSaveDraft} />
      <button class="rose-btn" onclick={createDraft}> Start new Draft </button>
    </span>
  </div>
{/if}

<!-- CATEGORY, TITLE, DESCRIPTION, IMAGE PROMPT -->
<div class="dream-container">
  <CategoryFetcher bind:selectedSectionId>
    {#snippet children(
      loadingSections: boolean,
      errorSections: string,
      sections: Section[],
      loadingCategories: boolean,
      errorCategories: string,
      categories: Category[],
    )}
      {#if isAdmin}
        <div class="input-container">
          <label for="sections">
            {#if loadingSections}
              Loading sections...
            {:else if errorSections}
              {errorSections}
            {:else}
              Section
            {/if}
          </label>
          {#if sections.length > 0}
            <select
              id="sections"
              bind:value={selectedSectionId}
              class:red-border={!selectedSectionId}
            >
              <option value="" disabled hidden>Select section</option>
              {#each sections as { id, name }}
                <option value={id}>{name}</option>
              {/each}
            </select>
          {:else}
            <p class="validation">No sections found</p>
          {/if}
        </div>
      {/if}

      <div class="input-container">
        <label for="category">
          {#if loadingCategories}
            <p>Loading categories...</p>
          {:else if errorCategories}
            <p class="validation">{errorCategories}</p>
          {:else}
            Category
          {/if}
        </label>

        <select
          id="category"
          class:red-border={!$storyData.category_id && categories.length > 0}
          bind:value={$storyData.category_id}
          disabled={categories.length === 0}
        >
          <option value="" disabled hidden>Select category</option>
          {#each categories as { id, name }}
            <option value={id}>{name}</option>
          {/each}
        </select>
      </div>
    {/snippet}
  </CategoryFetcher>

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
      class:red-border={$storyData.image_prompt.length > 1400}
      placeholder="What does your world feel like, what visual mood are you going for, and what elements stand out? Describe the environment, style, lighting, and textures you want to see."
      rows="2"
      bind:value={$storyData.image_prompt}
      style:min-height={$storyData.image_prompt.length > 500
        ? $storyData.image_prompt.length / 50 + 'rem'
        : ''}
    ></textarea>
  </div>

  {#if $storyData.image_prompt && $storyData.image_prompt.length > 1400}
    <p class="validation">
      Please shorten your message to 1400 characters or less, you’ve typed {$storyData
        .image_prompt.length}
    </p>
  {/if}
</div>

<!-- MAIN SETTINGS -->
<TopicSettings bind:promptFormat>
  {#snippet children(
    promptFormat: 'Table' | 'Open',
    setPromptFormat: (format: 'Table' | 'Open') => void,
  )}
    <div class="flex-row">
      <h4>Format</h4>
      <div class="container">
        <button
          class="void-btn dream-radio-btn"
          class:active={promptFormat === 'Table'}
          onclick={() => setPromptFormat('Table')}
        >
          Table
        </button>
        <button
          class="void-btn dream-radio-btn"
          class:active={promptFormat === 'Open'}
          onclick={() => setPromptFormat('Open')}
        >
          Open
        </button>
      </div>
    </div>
  {/snippet}
</TopicSettings>

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
        bind:value={$tablePrompt.first_action}
        style:min-height={$tablePrompt.first_action.length > 500
          ? $tablePrompt.first_action.length / 50 + 'rem'
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
      bind:value={$tablePrompt.additional_data}
      style:min-height={$tablePrompt.additional_data.length > 500
        ? $tablePrompt.additional_data.length / 50 + 'rem'
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
    onclick={() =>
      openModal(ensureMessage('reset all data'), 'Reset', clearAllData)}
  >
    Reset Data
  </button>
  <button class="green-btn blur" onclick={generateStory} disabled={!validation}>
    Create a DREAM
  </button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .draft-wrapper {
    width: 100%;
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
</style>
