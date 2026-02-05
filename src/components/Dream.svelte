<script lang="ts">
  import { onMount } from 'svelte';
  import { derived } from 'svelte/store';

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
  } from '@stores/dream.svelte';
  import { modal } from '@lib/modal-manager.svelte';
  import { user, isAdmin } from '@stores/account.svelte';
  import { showProfile } from '@stores/modal.svelte';

  import Drafts from '@utils/story-drafts';
  import World from './dream/World.svelte';
  import Characters from '@components/dream/Characters.svelte';
  import Scenario from '@components/dream/Scenario.svelte';
  import WritingStyle from '@components/dream/WritingStyle.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import CategoryFetcher from '@components/dashboard/common/CategoryFetcher.svelte';
  import Additional from './dream/Additional.svelte';

  const topic = new Topic();

  let selectedSectionId = $state('');
  let refreshCategories = $state<() => Promise<void>>();
  let lastSavedAgo = $state<string>('unsaved');

  $effect(() => {
    if (selectedSectionId) $storyData.category_id = '';
  });

  // minimal gating for the "Create" CTA: ensure we have base metadata and the prompt stays within limits
  let validation = $derived(
    $storyData.name.trim() &&
      $storyData.category_id &&
      $storyData.description.length >= 20 &&
      $storyData.description.length <= 500 &&
      $tablePrompt.premise.length >= 5,
  );

  const AUTO_SAVE_DELAY_MS = 5 * 60 * 1000;
  const LAST_SAVED_REFRESH_MS = 2000;

  // fingerprint combines all draft sources so we can debounce autosaves when any piece of state changes
  const fingerprint = derived(
    [storyData, promptSettings, tablePrompt],
    ([$s, $p, $t]) => JSON.stringify([$s, $p, $t]),
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
    if ($currentDraft?.id) Drafts.delete($currentDraft.id);

    clearAutoSaveTimer();
    const cachedDraftId = GetCache<string>(CURRENT_DRAFT_KEY);
    if (cachedDraftId) await Drafts.delete(cachedDraftId);
    currentDraft.set(null);
    clearAllData();
    lastSavedAgo = 'unsaved';

    await Drafts.create();

    setTimeout(async () => {
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
</script>

{#if $user !== null}
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
        <button class="rose-btn" onclick={createDraft}>
          Start new Draft
        </button>
      </span>
    </div>
  {/if}

  <!-- MAIN SETTINGS -->
  <div class="flex-row">
    <button
      onclick={() => modal.draftsManager({ onRestore: updateLastSavedLabel })}
    >
      Manage Drafts
    </button>
    <button
      onclick={() => modal.categoryManager({ onUpdate: refreshCategories })}
    >
      Manage Categories
    </button>
    <button onclick={() => modal.topicSettings()}> Story Settings </button>
  </div>
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
      class:red-border={$storyData.description.length < 20 ||
        $storyData.description.length > 500}
      placeholder="Describe the central premise, key themes, the main character's emotional journey ahead, and what kicks off the plot. Focus on what’s at stake, what makes the world unique, and why this story matters - make users want to see more."
      rows="3"
      bind:value={$storyData.description}
    ></textarea>
  </div>

  {#if $storyData.description && $storyData.description.length > 500}
    <p class="validation">
      Please shorten your message to 500 characters or less, you’ve typed {$storyData
        .description.length}
    </p>
  {/if}
</div>

<div class="dream-container">
  <h4>Write up a scenario of Your Story</h4>
  <textarea
    class:red-border={$tablePrompt.premise.length < 5}
    id="premise"
    placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
    rows="5"
    bind:value={$tablePrompt.premise}
  ></textarea>
</div>

<World />

<Characters />

<Scenario />

<WritingStyle />

<Additional />

{#if $user !== null}
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

  #premise {
    min-height: 25rem;

    @include respond-up(small-desktop) {
      min-height: 12vw;
    }
  }
</style>
