<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import TopicManagement from '@lib/topics';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';
  import { checkUserRoles, ensurePlayer } from '@utils/route-guard';
  import { isAdmin } from '@stores/account.svelte';
  import {
    promptSettings,
    resetSettings,
    isPromptSettingsDefault,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import PullToRefresh from '@components/utils/PullToRefresh.svelte';

  import ExploreCategory from '@components/dashboard/dream/manage/collections/AddTopicCategory.svelte';
  import GenreTags from '@components/dashboard/dream/manage/collections/GenreTags.svelte';
  import Gating from '@components/dashboard/dream/manage/collections/Gating.svelte';
  import TopicSettings from '@components/dashboard/common/TopicSettings.svelte';
  import Media from '@components/dashboard/dream/manage/collections/Media.svelte';

  import EditSVG from '@components/icons/Edit.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';

  let {
    topic_id = '',
  }: {
    topic_id: string;
  } = $props();

  let topicManager = new TopicManagement();

  let topic = $state<Nullable<TopicManager>>(null);

  let topic_name = $state<string>('Loading...');
  let topic_description = $state<string>('');
  let topic_availability = $state<boolean>(false);
  let topic_visibility = $state<TopicVisibility>('public');
  let topic_media_files = $state<TopicMediaFile[]>([]);

  let topic_prompt_id = $state<string>('');
  let topic_text_prompt = $state<TablePrompt>({ premise: '' });
  let topic_image_prompt = $state<string>('');

  let topic_categories = $state<TopicCategory[]>([]);
  let topic_genres = $state<TopicGenre[]>([]);
  let topic_gates = $state<TopicGate[]>([]);

  let nameDraft = $state<string>('');
  let descriptionDraft = $state<string>('');
  let promptDraft = $state<TablePrompt>({ premise: '' });
  let imagePromptDraft = $state<string>('');

  const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true;

    if (
      typeof a !== 'object' ||
      typeof b !== 'object' ||
      a === null ||
      b === null
    )
      return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  };

  const setUpSettings = (settings: PromptSettings) => {
    if (!settings) return;
    promptSettings.set({
      image_style: settings.image_style,
      language: settings.language,
      interactivity: settings.interactivity,
      difficulty: settings.difficulty,
      length: settings.length,
      reading_style: settings.reading_style,
      kids_mode: settings.kids_mode,
    });
  };

  const compareSettings = $derived(() => {
    const originalSettings = topic?.topic_prompt_settings;

    if (!originalSettings) return true;

    return arePromptSettingsEqual($promptSettings, originalSettings);
  });

  const saveSettingsChanges = async () => {
    await topicManager.editPromptSettings(topic_id, $promptSettings);
    await refreshTopic();
  };

  const applyTopicData = (data: TopicManager) => {
    topic = data;
    setUpSettings(data.topic_prompt_settings);

    topic_name = data.topic.name;
    topic_description = data.topic.description;
    topic_availability = data.topic.available;
    topic_visibility = data.topic.visibility;

    // Prompts
    topic_prompt_id = data.topic_prompt.id;

    const textPrompt = data.topic_prompt.text;
    const imagePrompt = data.topic_prompt.image;

    topic_text_prompt = textPrompt.structured_prompt || {
      premise: textPrompt.block_prompt || '',
    };
    topic_image_prompt = imagePrompt.prompt;

    topic_categories = data.categories;
    topic_genres = data.genres;
    topic_gates = data.gates;
    topic_media_files = data.media_files ?? [];

    nameDraft = topic_name;
    descriptionDraft = topic_description;
    promptDraft = textPrompt.structured_prompt || {
      premise: textPrompt.block_prompt || '',
    };
    imagePromptDraft = topic_image_prompt;
  };

  const hydrateTopic = async (refresh = false) => {
    const next = await topicManager.getTopicManager(topic_id, refresh);

    if (!next || !next.topic || !next.topic_prompt || !next.categories) {
      window.location.href = NAV_ROUTES.MANAGE;
      return;
    }

    applyTopicData(next);
  };

  const refreshTopic = async () => {
    await hydrateTopic(true);
  };

  onMount(async () => {
    await ensurePlayer(NAV_ROUTES.MANAGE);
    await checkUserRoles();
    await hydrateTopic();
  });

  let editingName = $state<boolean>(false);
  let editingDescription = $state<boolean>(false);
  let editingTextPrompt = $state<boolean>(false);
  let editingImagePrompt = $state<boolean>(false);

  // whenever an edit toggle opens we repopulate the draft with the latest saved value to avoid stale local state
  $effect(() => {
    if (editingName) {
      nameDraft = topic_name;
    }
  });

  $effect(() => {
    if (editingDescription) {
      descriptionDraft = topic_description;
    }
  });

  $effect(() => {
    if (editingImagePrompt) {
      imagePromptDraft = topic_image_prompt;
    }
  });

  $effect(() => {
    if (editingTextPrompt) {
      promptDraft = topic_text_prompt;
    }
  });

  async function handleCategoryChange(
    categoryId: string,
    method: 'add' | 'remove',
    name?: string,
  ) {
    switch (method) {
      case 'add':
        await topicManager.addTopicToCategory(topic_id, categoryId);
        topic_categories = [
          ...topic_categories,
          { id: categoryId, name: name!, sort_order: 0 },
        ];
        break;
      case 'remove':
        await topicManager.removeTopicFromCategory(topic_id, categoryId);
        topic_categories = topic_categories.filter(
          (category) => category.id !== categoryId,
        );
        break;
    }

    await refreshTopic();
  }

  async function handleGenreChange(genre_id: string, method: 'add' | 'remove') {
    switch (method) {
      case 'add':
        await topicManager.addGenreToTopic(topic_id, genre_id);
        break;
      case 'remove':
        await topicManager.removeGenreFromTopic(topic_id, genre_id);
        break;
    }

    await refreshTopic();
  }

  async function handleGatingChange(gate_id: string, method: 'add' | 'remove') {
    switch (method) {
      case 'add':
        await topicManager.addGateToTopic(topic_id, gate_id);
        break;
      case 'remove':
        await topicManager.removeGateFromTopic(topic_id, gate_id);
        break;
    }

    await refreshTopic();
  }

  async function handleMediaUpload(media_type: MediaType, file: File) {
    const fileIds = await topicManager.uploadFileForTopic(
      topic_id,
      media_type,
      file,
    );

    await refreshTopic();

    return fileIds;
  }

  async function handleDeleteMedia(file_id: string, media_type: MediaType) {
    await topicManager.deleteFileFromTopic(topic_id, file_id, media_type);
    await refreshTopic();
  }

  async function toggleAvailability(topic_id: string, available: boolean) {
    await topicManager.changeAvailability(topic_id, available);
    topic_availability = available;
    await refreshTopic();
  }

  async function toggleVisibility(
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    await topicManager.changeVisibility(topic_id, visibility);
    topic_visibility = topic_visibility === 'public' ? 'private' : 'public';
    await refreshTopic();
  }

  const downloadTopicJson = () => {
    const exportObject = {
      topic: topic_name,
      description: topic_description,
      prompt_id: topic_prompt_id,
      prompt: topic_text_prompt,
      image_prompt: topic_image_prompt,
      genres: topic_genres,
      categories: topic_categories,
    };

    const blob = new Blob([JSON.stringify(exportObject)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${topic_name}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
</script>

<PullToRefresh refresh={refreshTopic}>
  <section class="topic-wrapper flex pad-24">
    {#if !topic || !topic.topic || !topic.topic_prompt || !topic.categories}
      <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
    {:else}
      <section class="dream-container fade-in">
        <!-- KEY BUTTONS -->
        {#key topic}
          <span class="flex-row flex-wrap">
            {#if $isAdmin}
              <button
                class:green-btn={topic_availability}
                class:red-btn={!topic_availability}
                use:tippy={{
                  content: 'Toggle availability',
                  animation: 'scale',
                }}
                onclick={async () => {
                  await toggleAvailability(topic_id, !topic_availability);
                }}
              >
                {topic_availability ? 'Available' : 'Unavailable'}
              </button>
            {/if}
            <!-- {#if topic.creator} -->
            <button
              class:green-btn={topic_visibility === 'public'}
              class:red-btn={topic_visibility === 'private'}
              use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
              onclick={async () => {
                await toggleVisibility(
                  topic_id,
                  topic_visibility === 'public' ? 'private' : 'public',
                );
              }}
            >
              {topic_visibility === 'public' ? 'Public' : 'Private'}
            </button>
            <!-- {/if} -->
            {#if $isAdmin}
              <button
                class="rose-btn"
                use:tippy={{
                  content: 'Download story file',
                  animation: 'scale',
                }}
                onclick={downloadTopicJson}
              >
                Export JSON
              </button>
            {/if}
            <a
              class="button-anchor cta"
              href="/dashboard/topic/{topic_id}/demo?demoID={topic_id}&demoName={topic_name}"
            >
              Play Now
            </a>
          </span>
        {/key}

        <!-- STORY NAME & CATEGORY -->
        <div class="flex-row">
          <h4>Story</h4>
          <div class="story-data container">
            <div class="story-name flex-row">
              {#if editingName}
                <CloseSVG
                  onclick={() => {
                    editingName = false;
                    nameDraft = topic_name;
                  }}
                />
              {/if}
              <div class="input-container">
                <label for="story-name">Story name</label>
                <input
                  bind:value={nameDraft}
                  type="text"
                  size={nameDraft.length + 1}
                  maxlength="50"
                  disabled={!editingName}
                />
              </div>
              {#if editingName}
                <SaveSVG
                  onclick={async () => {
                    if (topic_name === nameDraft) {
                      editingName = false;
                      return;
                    }
                    await topicManager.changeName(topic_id, nameDraft);
                    topic_name = nameDraft;
                    editingName = false;
                    await refreshTopic();
                  }}
                  disabled={topic_name === nameDraft}
                />
              {:else}
                <EditSVG bind:editing={editingName} />
              {/if}
            </div>
          </div>
        </div>

        <hr />

        <ExploreCategory {topic_categories} {handleCategoryChange} />

        <hr />

        <!-- GENRES -->
        <GenreTags {topic_genres} {handleGenreChange} />

        <!-- NFT RESTRICTIONS -->
        {#if $isAdmin}
          <hr />

          <Gating {topic_gates} {handleGatingChange} />
        {/if}
      </section>

      <TopicSettings>
        {#snippet children()}
          <span class="flex-row flex-wrap">
            <button
              class="red-btn"
              onclick={resetSettings}
              disabled={isPromptSettingsDefault($promptSettings)}
            >
              Reset to Default
            </button>
            <button
              class="green-btn"
              onclick={saveSettingsChanges}
              disabled={compareSettings()}
            >
              Save Changes
            </button>
          </span>
        {/snippet}
      </TopicSettings>

      <section class="dream-container">
        <!-- DESCRIPTION -->
        <div class="flex-row">
          <span class="edit-wrapper flex">
            <h4>Description</h4>
            <span class="flex-row">
              {#if editingDescription}
                <CloseSVG
                  onclick={() => {
                    editingDescription = false;
                    descriptionDraft = topic_description;
                  }}
                />
                <SaveSVG
                  onclick={async () => {
                    if (topic_description === descriptionDraft) {
                      editingDescription = false;
                      return;
                    }
                    await topicManager.changeDescription(
                      topic_id,
                      descriptionDraft,
                    );
                    topic_description = descriptionDraft;
                    editingDescription = false;
                    await refreshTopic();
                  }}
                  disabled={topic_description === descriptionDraft}
                />
              {:else}
                <EditSVG bind:editing={editingDescription} />
              {/if}
            </span>
          </span>
          <textarea
            id="description"
            class="dream-input dream-textfield"
            placeholder="Describe the overall story, its key themes, and what kind of journey the main character will take. Is it an epic adventure, a gripping mystery, or a heartwarming romance? Keep it engaging and set the stage for the reader!"
            rows="5"
            bind:value={descriptionDraft}
            disabled={!editingDescription}
          ></textarea>
        </div>

        <!-- IMAGE-PROMPT -->
        <div class="flex-row box-header">
          <span class="edit-wrapper flex">
            <h4>Image Generation Instructions</h4>
            <span class="flex-row">
              {#if editingImagePrompt}
                <CloseSVG
                  onclick={() => {
                    editingImagePrompt = false;
                    imagePromptDraft = topic_image_prompt;
                  }}
                />
                <SaveSVG
                  onclick={async () => {
                    if (topic_image_prompt === imagePromptDraft) {
                      editingImagePrompt = false;
                      return;
                    }
                    await topicManager.editImagePrompt(
                      topic_id,
                      imagePromptDraft,
                    );
                    topic_image_prompt = imagePromptDraft;
                    editingImagePrompt = false;
                    await refreshTopic();
                  }}
                  disabled={topic_image_prompt === imagePromptDraft}
                />
              {:else}
                <EditSVG bind:editing={editingImagePrompt} />
              {/if}
            </span>
          </span>
          <textarea
            id="image-prompt"
            class="dream-input dream-textfield"
            placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
            rows="5"
            bind:value={imagePromptDraft}
            disabled={!editingImagePrompt}
          ></textarea>
        </div>

        <!-- PROMPT Premise -->
        <div class="flex-row box-header">
          <span class="edit-wrapper flex">
            <h4>Premise</h4>
            <span class="flex-row">
              {#if editingTextPrompt}
                <CloseSVG
                  onclick={() => {
                    editingTextPrompt = false;
                    promptDraft = structuredClone(topic_text_prompt);
                  }}
                />
                <SaveSVG
                  onclick={async () => {
                    if (deepEqual(topic_text_prompt, promptDraft)) {
                      console.log('no changes');
                      editingTextPrompt = false;
                      return;
                    }
                    await topicManager.editPrompt(topic_id, promptDraft);
                    topic_text_prompt = structuredClone(promptDraft);
                    editingTextPrompt = false;
                    await refreshTopic();
                  }}
                  disabled={deepEqual(topic_text_prompt, promptDraft)}
                />
              {:else}
                <EditSVG bind:editing={editingTextPrompt} />
              {/if}
            </span>
          </span>
          <textarea
            id="prompt"
            placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
            rows="5"
            bind:value={promptDraft.premise}
            disabled={!editingTextPrompt}
          ></textarea>
        </div>
      </section>

      <!-- MEDIA FILES -->
      <Media bind:topic_media_files {handleMediaUpload} {handleDeleteMedia} />

      <button
        class="red-btn"
        onclick={() =>
          openModal(
            ensureMessage('delete this story'),
            `Delete story: ${topic_name}`,
            async () => {
              await topicManager.deleteTopic(topic_id);
              window.location.href = '/dashboard#/dream/manage/collections';
            },
          )}
      >
        Delete Story
      </button>
    {/if}
  </section>
</PullToRefresh>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .topic-wrapper {
    width: 100vw;
    padding-block: 0;

    @include respond-up(large-desktop) {
      padding-inline: 100px;
    }
  }

  textarea {
    min-height: 25rem;

    @include respond-up(tablet) {
      min-height: 12.5rem;
    }
  }

  .story-name {
    justify-content: center;

    .input-container {
      width: auto;
    }
  }

  .story-data {
    .story-name {
      flex-wrap: nowrap;
      align-items: flex-end;

      input {
        width: 100%;
        animation: none;
      }
    }
  }

  #description:disabled,
  #prompt:disabled,
  #image-prompt:disabled {
    @include white-txt(0.5);
  }
</style>
