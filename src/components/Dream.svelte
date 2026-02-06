<script lang="ts">
  import { onMount } from 'svelte';
  import { derived, get } from 'svelte/store';

  import { GetCache, CURRENT_DRAFT_KEY } from '@constants/cache';
  import {
    ensureMessage,
    openStoryManage,
    createDream,
  } from '@constants/modal';
  import Topic from '@lib/topics';
  import {
    storyData,
    promptSettings,
    tablePrompt,
    clearAllData,
    currentDraft,
    isPromptSettingsDefault,
    draftSaveSuppress,
    draftSaveState,
  } from '@stores/dream.svelte';
  import { modal } from '@lib/modal-manager.svelte';
  import { user, isAdmin } from '@stores/account.svelte';
  import { showProfile } from '@stores/modal.svelte';

  import SaveSVG from '@components/icons/Checkmark.svelte';
  import Drafts from '@utils/story-drafts';
  import CategoryFetcher from '@components/dashboard/common/CategoryFetcher.svelte';
  import World from './dream/World.svelte';
  import Characters from '@components/dream/Characters.svelte';
  import Scenario from '@components/dream/Scenario.svelte';
  import WritingStyle from '@components/dream/WritingStyle.svelte';
  import Additional from './dream/Additional.svelte';

  const topic = new Topic();

  let selectedSectionId = $state('');
  let refreshCategories = $state<() => Promise<void>>();
  let lastSavedAgo = $state<string>('unsaved');

  let showWorld = $state<boolean>(false);
  let showCharacters = $state<boolean>(false);
  let showScenario = $state<boolean>(false);
  let showWritingStyle = $state<boolean>(false);
  let showAdditional = $state<boolean>(false);

  const AUTO_SAVE_DELAY_MS = 90 * 1000; // 90 seconds
  const LAST_SAVED_REFRESH_MS = 2000;

  // fingerprint combines all draft sources so we can debounce autosaves when any piece of state changes
  const fingerprint = derived(
    [storyData, promptSettings, tablePrompt],
    ([$s, $p, $t]) => JSON.stringify([$s, $p, $t]),
  );

  // Track save state for UI feedback
  let isSaving = $derived($draftSaveState.isSaving);

  // Track if there are unsaved changes (disable Save button when clean)
  let isDirty = $derived($fingerprint !== $draftSaveState.lastSavedFingerprint);

  // minimal gating for the "Create" CTA: ensure we have base metadata and the prompt stays within limits
  let validation = $derived(
    $storyData.name.trim() &&
      $storyData.category_id &&
      $storyData.description.length >= 20 &&
      $storyData.description.length <= 500 &&
      $tablePrompt.premise.length >= 5,
  );

  $effect(() => {
    if (selectedSectionId) $storyData.category_id = '';
  });

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

      // Skip auto-save during programmatic state changes (restore, create, clear)
      if (get(draftSaveSuppress)) return;

      queueAutoSave();
    });

    const handleBeforeUnload = () => {
      // Use beacon for reliable save on page unload (queues request that survives page close)
      Drafts.saveBeacon($currentDraft?.id);
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

  function generatePrompt(
    props: StoryData,
    settings: PromptSettings,
    data: TablePrompt,
  ): TopicRequest {
    return {
      name: props.name.trim(),
      description: props.description,
      category_id: props.category_id,
      available: true,
      visibility: 'public',
      prompt_type: 'structured',
      structured_prompt: data,
      image_prompt: props.image_prompt,
      prompt_settings: settings,
    };
  }

  const generateStory = async () => {
    const topic_id = await topic.newTopic(
      generatePrompt($storyData, $promptSettings, $tablePrompt),
    );
    if (!topic_id) return;

    clearAutoSaveTimer();

    // Single deletion - use currentDraft store as source of truth
    const draftToDelete = $currentDraft?.id;
    if (draftToDelete) await Drafts.delete(draftToDelete);

    currentDraft.set(null);
    clearAllData();
    lastSavedAgo = 'unsaved';

    await Drafts.create();

    setTimeout(() => {
      const storyLink = `/dashboard/collections/topic/${topic_id}`;
      modal.confirm('', openStoryManage, {
        onConfirm: () => (window.location.href = storyLink),
        confirmText: 'Manage Story',
      });
    }, 600);
  };

  const createStory = () => {
    modal.confirm('', createDream, {
      onConfirm: generateStory,
      confirmText: 'Create Dream',
    });
  };

  const openStorySettings = () => {
    modal.topicSettings({
      mode: 'story-creation',
      initialValues: $promptSettings,
      onSave: async (settings) => {
        promptSettings.set(settings);
      },
    });
  };
</script>

{#if $user !== null}
  <!-- MAIN SETTINGS -->
  <nav class="dream-container">
    <span class="flex-row flex-wrap">
      <button
        onclick={() => modal.categoryManager({ onUpdate: refreshCategories })}
      >
        Manage Categories
      </button>
      <button
        class:purple-btn={!isPromptSettingsDefault($promptSettings)}
        onclick={openStorySettings}
      >
        Story Settings
      </button>
    </span>

    <span class="flex-row flex-wrap">
      {#if $currentDraft}
        <h5>
          📝 Working on draft: {$currentDraft.id?.split('-')[0]}
          <strong>
            - {#if isSaving}Saving...{:else}Last saved: {lastSavedAgo}{/if}
          </strong>
        </h5>
        <SaveSVG
          onclick={triggerSaveDraft}
          text={isSaving ? 'Saving...' : 'Save Draft'}
          disabled={isSaving || !isDirty}
        />
      {/if}
      <button
        class="rose-btn"
        onclick={() =>
          modal.draftsManager({
            onRestore: updateLastSavedLabel,
            onCreate: createDraft,
          })}
      >
        Manage Drafts
      </button>
    </span>
  </nav>
{/if}

<!-- CATEGORY, TITLE, DESCRIPTION, IMAGE PROMPT -->
<div class="dream-container">
  <CategoryFetcher
    bind:selectedSectionId
    bind:fetchCategories={refreshCategories}
  >
    {#snippet children(
      loadingSections: boolean,
      errorSections: string,
      sections: Section[],
      loadingCategories: boolean,
      errorCategories: string,
      categories: Category[],
    )}
      {#if $isAdmin}
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

      <div class="input-container gap-8">
        <label for="category">
          {#if loadingCategories}
            <p>Loading categories...</p>
          {:else if errorCategories}
            <p class="validation">{errorCategories}</p>
          {:else}
            Category
          {/if}
        </label>

        {#if !loadingCategories && !errorCategories && categories.length === 0 && !($isAdmin && !selectedSectionId)}
          <div class="empty-category-state">
            <p class="transparent-white-txt">
              Stories live inside categories. Create your first category to get
              started.
            </p>
            <button
              class="green-btn"
              onclick={() =>
                modal.categoryManager({ onUpdate: refreshCategories })}
            >
              + Create Category
            </button>
          </div>
        {:else}
          <select
            id="category"
            class:red-border={!$storyData.category_id && categories.length > 0}
            bind:value={$storyData.category_id}
            disabled={($isAdmin && !selectedSectionId) || !categories.length}
          >
            <option value="" disabled hidden>
              {#if categories.length > 0}
                Select category
              {:else if $isAdmin && !selectedSectionId}
                No section selected
              {:else if !loadingCategories}
                No categories found
              {/if}
            </option>
            {#each categories as { id, name }}
              <option value={id}>{name}</option>
            {/each}
          </select>
          {#if categories.length > 0}
            <p class="transparent-white-txt caption-font">
              Organize your stories into collections.
            </p>
          {/if}
        {/if}
      </div>
    {/snippet}
  </CategoryFetcher>

  <hr />

  <div class="input-container gap-8">
    <label for="topic">Story Title</label>
    <input
      id="topic"
      class:red-border={!$storyData.name}
      type="text"
      maxlength="32"
      placeholder="e.g. &quot;The Last Cartographer&quot;"
      bind:value={$storyData.name}
    />
    <p class="transparent-white-txt caption-font">
      The name readers will see on the story card. Keep it memorable.
    </p>
  </div>

  <div class="input-container gap-8">
    <label for="description">Tagline (Front Page Teaser)</label>
    <textarea
      id="description"
      class:red-border={$storyData.description.length < 20 ||
        $storyData.description.length > 500}
      placeholder="e.g. &quot;A detective chasing a serial killer discovers the truth might destroy everything he believes in.&quot;"
      rows="3"
      bind:value={$storyData.description}
    ></textarea>
    <p class="transparent-white-txt caption-font">
      A short hook shown on the story card. What is the story about, and why
      should someone read it? (20–500 characters)
    </p>
  </div>

  {#if $storyData.description && $storyData.description.length > 500}
    <p class="validation">
      Please shorten your message to 500 characters or less, you’ve typed {$storyData
        .description.length}
    </p>
  {/if}
</div>

<div class="dream-container gap-8">
  <h4>Story Seed</h4>
  <textarea
    class:red-border={$tablePrompt.premise.length < 5}
    id="premise"
    placeholder="e.g. &quot;A Sherlock Holmes story where an investigation leads him to a new drug that clouds his mind, forcing him to fight both a serial killer and his own unraveling psyche.&quot;"
    rows="5"
    bind:value={$tablePrompt.premise}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    Describe any scenario and the AI will build a story from it. Be as detailed
    or as vague as you like.
  </p>
</div>

{#if showWorld}
  <section class="dream-container fade-in">
    <span class="flex-row">
      <h3>World</h3>
      <button class="red-btn" onclick={() => (showWorld = false)}
        >Collapse</button
      >
    </span>
    <World />
  </section>
{/if}

{#if showCharacters}
  <section class="dream-container fade-in">
    <span class="flex-row">
      <h3>Characters</h3>
      <button class="red-btn" onclick={() => (showCharacters = false)}
        >Collapse</button
      >
    </span>
    <Characters />
  </section>
{/if}

{#if showScenario}
  <section class="dream-container fade-in">
    <span class="flex-row">
      <h3>Scenarios</h3>
      <button class="red-btn" onclick={() => (showScenario = false)}
        >Collapse</button
      >
    </span>
    <Scenario />
  </section>
{/if}

{#if showWritingStyle}
  <section class="dream-container fade-in">
    <span class="flex-row">
      <h3>Writing Style</h3>
      <button class="red-btn" onclick={() => (showWritingStyle = false)}
        >Collapse</button
      >
    </span>
    <WritingStyle />
  </section>
{/if}

{#if showAdditional}
  <section class="dream-container fade-in">
    <span class="flex-row">
      <h3>Extras</h3>
      <button class="red-btn" onclick={() => (showAdditional = false)}
        >Collapse</button
      >
    </span>
    <Additional />
  </section>
{/if}

{#if $user !== null}
  <!-- Enhancement Zone -->
  {#if !showWorld || !showCharacters || !showScenario || !showWritingStyle || !showAdditional}
    <section class="enhancement dream-container">
      <span class="flex gap-8">
        <h4>Enhance Your Story</h4>
        <p class="transparent-white-txt caption-font">
          The seed above is enough to create a story. These optional sections
          give the AI more to work with.
        </p>
      </span>

      <div class="container">
        {#if !showWorld}
          <button
            class="enhancement-card purple-btn"
            onclick={() => (showWorld = true)}
          >
            World
            <span class="enhancement-desc"
              >Set the time, place, and backstory of your universe</span
            >
          </button>
        {/if}

        {#if !showCharacters}
          <button
            class="enhancement-card purple-btn"
            onclick={() => (showCharacters = true)}
          >
            Characters
            <span class="enhancement-desc"
              >Define your cast — names, looks, personalities, and how they
              relate</span
            >
          </button>
        {/if}

        {#if !showScenario}
          <button
            class="enhancement-card purple-btn"
            onclick={() => (showScenario = true)}
          >
            Scenarios
            <span class="enhancement-desc"
              >Set win/lose conditions and key plot events the story should hit</span
            >
          </button>
        {/if}

        {#if !showWritingStyle}
          <button
            class="enhancement-card purple-btn"
            onclick={() => (showWritingStyle = true)}
          >
            Writing Style
            <span class="enhancement-desc"
              >Control tense, pacing, point of view, and the emotional tone</span
            >
          </button>
        {/if}

        {#if !showAdditional}
          <button
            class="enhancement-card purple-btn"
            onclick={() => (showAdditional = true)}
          >
            Extras
            <span class="enhancement-desc"
              >Add image style directions or any other details for the AI</span
            >
          </button>
        {/if}
      </div>
    </section>
  {/if}

  {#if !validation}
    <p class="validation">Fill all required fields</p>
  {/if}

  <div class="flex-row flex-wrap">
    <button
      class="red-btn"
      onclick={() =>
        modal.confirm('', ensureMessage('reset all data'), {
          onConfirm: clearAllData,
          confirmText: 'Reset',
        })}
    >
      Reset Data
    </button>
    <button class="green-btn" onclick={createStory} disabled={!validation}>
      Create a DREAM: 10 Credits
    </button>
  </div>
{:else}
  <button class="cta" onclick={() => ($showProfile = true)}>Sign In</button>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  nav {
    @include respond-up(small-desktop) {
      flex-flow: row wrap;
    }

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

  #topic {
    @include respond-up(small-desktop) {
      width: 24rem;
    }
  }

  .empty-category-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
    @include gray(0.25);
  }

  #premise {
    min-height: 25rem;

    @include respond-up(small-desktop) {
      min-height: 12vw;
    }
  }

  .enhancement > div {
    flex-flow: row wrap;
    align-items: stretch;
    justify-content: center;
  }

  .enhancement-card {
    flex-direction: column;
    width: 100%;

    @include respond-up(small-desktop) {
      width: calc(50% - 1rem);
    }

    @include respond-up(full-hd) {
      width: calc(33.33% - 1rem);
    }
  }

  .enhancement-desc {
    text-transform: none;
    white-space: wrap;
    @include font(caption);
  }
</style>
