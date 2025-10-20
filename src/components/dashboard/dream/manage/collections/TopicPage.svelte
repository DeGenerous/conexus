<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import TopicManagement from '@lib/topics';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';
  import { userState } from '@utils/route-guard';
  import {
    promptSettings,
    resetSettings,
    isPromptSettingsDefault,
    arePromptSettingsEqual,
  } from '@stores/dream.svelte';
  import { story, game } from '@stores/conexus.svelte';

  import ExploreCategory from '@components/dashboard/dream/manage/collections/AddTopicCategory.svelte';
  import GenreTags from '@components/dashboard/dream/manage/collections/GenreTags.svelte';
  import NftGating from '@components/dashboard/dream/manage/collections/NftGating.svelte';
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

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  let topic = $state<Nullable<TopicManager>>(null);

  let topic_name = $state<string>('Loading...');
  let topic_description = $state<string>('');
  let topic_availability = $state<boolean>(false);
  let topic_visibility = $state<TopicVisibility>('public');
  let topic_media_files = $state<TopicMediaFile[]>([]);

  let topic_prompt_id = $state<string>('');
  let topic_prompt = $state<string>('');
  let topic_imagePrompt = $state<string>('');

  let topic_categories = $state<TopicCategory[]>([]);
  let topic_genres = $state<TopicGenre[]>([]);
  let topic_gates = $state<Gate[]>([]);

  let nameDraft = $state<string>('');
  let descriptionDraft = $state<string>('');
  let promptDraft = $state<string>('');
  let imagePromptDraft = $state<string>('');

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
  };

  onMount(async () => {
    if ($story || game.loading) window.location.reload(); // ensure clean state

    isAdmin = await userState('admin');
    isCreator = await userState('creator');

    if (!isAdmin && !isCreator) {
      window.location.href = NAV_ROUTES.MANAGE;
      return;
    }

    topic = await topicManager.getTopicManager(topic_id);

    if (!topic || !topic.topic || !topic.topic_prompt || !topic.categories) {
      window.location.href = NAV_ROUTES.MANAGE;
      return;
    }

    setUpSettings(topic.topic_prompt_settings);

    topic_name = topic.topic.name;
    topic_description = topic.topic.description;
    topic_availability = topic.topic.available;
    topic_visibility = topic.topic.visibility;

    topic_prompt_id = topic.topic_prompt.id;
    topic_prompt = topic.topic_prompt.prompt;
    topic_imagePrompt = topic.topic_prompt.image_prompt;

    topic_categories = topic.categories;
    topic_genres = topic.genres;
    topic_gates = topic.gates;
    topic_media_files = topic.media_files;

    nameDraft = topic_name;
    descriptionDraft = topic_description;
    promptDraft = topic_prompt;
    imagePromptDraft = topic_imagePrompt;
  });

  let editingName = $state<boolean>(false);
  let editingDescription = $state<boolean>(false);
  let editingPrompt = $state<boolean>(false);
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
      imagePromptDraft = topic_imagePrompt;
    }
  });

  $effect(() => {
    if (editingPrompt) {
      promptDraft = topic_prompt;
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
  }

  async function handleMediaUpload(media_type: MediaType, file: File) {
    const fileIds = await topicManager.uploadFileForTopic(
      topic_id,
      media_type,
      file,
    );

    return fileIds;
  }

  async function handleDeleteMedia(file_id: string, media_type: MediaType) {
    await topicManager.deleteFileFromTopic(topic_id, file_id, media_type);
  }

  async function toggleAvailability(topic_id: string, available: boolean) {
    await topicManager.changeAvailability(topic_id, available);
    topic_availability = available;
  }

  async function toggleVisibility(
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    await topicManager.changeVisibility(topic_id, visibility);
    topic_visibility = topic_visibility === 'public' ? 'private' : 'public';
  }

  const downloadTopicJson = () => {
    const exportObject = {
      topic: topic_name,
      description: topic_description,
      prompt_id: topic_prompt_id,
      prompt: topic_prompt,
      image_prompt: topic_imagePrompt,
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

<section class="topic-wrapper flex pad-24">
  {#if !topic || !topic.topic || !topic.topic_prompt || !topic.categories}
    <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
  {:else}
    <section class="dream-container fade-in">
      <!-- KEY BUTTONS -->
      {#key topic}
        <span class="flex-row flex-wrap">
          {#if isAdmin}
            <button
              class:green-btn={topic_availability}
              class:red-btn={!topic_availability}
              use:tippy={{ content: 'Toggle availability', animation: 'scale' }}
              onclick={() => {
                toggleAvailability(topic_id, !topic_availability);
              }}
            >
              {topic_availability ? 'Available' : 'Unavailable'}
            </button>
          {/if}
          <button
            class:green-btn={topic_visibility === 'public'}
            class:red-btn={topic_visibility === 'private'}
            use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
            onclick={() => {
              toggleVisibility(
                topic_id,
                topic_visibility === 'public' ? 'private' : 'public',
              );
            }}
          >
            {topic_visibility === 'public' ? 'Public' : 'Private'}
          </button>
          {#if isAdmin}
            <button
              class="rose-btn"
              use:tippy={{ content: 'Download story file', animation: 'scale' }}
              onclick={downloadTopicJson}
            >
              Export JSON
            </button>
          {/if}
          <a
            class="button-anchor purple-btn"
            href="/dashboard/topic/{topic_id}/demo?demoID={topic_id}&demoName={topic_name}"
          >
            Play Demo
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

      <ExploreCategory
        {isAdmin}
        {isCreator}
        {topic_categories}
        {handleCategoryChange}
      />

      <hr />

      <!-- GENRES -->
      <GenreTags {topic_genres} {handleGenreChange} />

      <hr />

      <!-- NFT RESTRICTIONS -->
      {#if isAdmin}
        <NftGating {topic_gates} {handleGatingChange} />
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
                  imagePromptDraft = topic_imagePrompt;
                }}
              />
              <SaveSVG
                onclick={async () => {
                  if (topic_imagePrompt === imagePromptDraft) {
                    editingImagePrompt = false;
                    return;
                  }
                  await topicManager.editImagePrompt(
                    topic_id,
                    imagePromptDraft,
                  );
                  topic_imagePrompt = imagePromptDraft;
                  editingImagePrompt = false;
                }}
                disabled={topic_imagePrompt === imagePromptDraft}
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

      <!-- PROMPT -->
      <div class="flex-row box-header">
        <span class="edit-wrapper flex">
          <h4>Prompt</h4>
          <span class="flex-row">
            {#if editingPrompt}
              <CloseSVG
                onclick={() => {
                  editingPrompt = false;
                  promptDraft = topic_prompt;
                }}
              />
              <SaveSVG
                onclick={async () => {
                  if (topic_prompt === promptDraft) {
                    editingPrompt = false;
                    return;
                  }
                  await topicManager.editPrompt(topic_id, promptDraft);
                  topic_prompt = promptDraft;
                  editingPrompt = false;
                }}
                disabled={topic_prompt === promptDraft}
              />
            {:else}
              <EditSVG bind:editing={editingPrompt} />
            {/if}
          </span>
        </span>
        <textarea
          id="prompt"
          placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
          rows="5"
          bind:value={promptDraft}
          disabled={!editingPrompt}
        ></textarea>
      </div>
    </section>

    <!-- MEDIA FILES -->
    <Media bind:topic_media_files {handleMediaUpload} {handleDeleteMedia} />

    <button
      class="red-btn blur"
      onclick={() =>
        openModal(
          ensureMessage('delete this story'),
          `Delete story: ${topic_name}`,
          async () => {
            await topicManager.deleteTopic(topic_id);
            window.location.href = '/dashboard/dream/manage/';
          },
        )}
    >
      Delete Story
    </button>
  {/if}
</section>

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

  .edit-wrapper {
    flex-flow: row wrap;
    gap: 1rem;

    @include respond-up(small-desktop) {
      flex-direction: column;
      align-items: flex-end;
    }
  }

  #description:disabled,
  #prompt:disabled,
  #image-prompt:disabled {
    @include white-txt(0.5);
  }
</style>
