<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { untrack } from 'svelte';
  import { get } from 'svelte/store';
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import TopicManagement from '@lib/topics';
  import { modal } from '@lib/modal-manager.svelte';
  import { ensureMessage } from '@constants/modal';
  import { checkUserRoles, ensurePlayer } from '@utils/route-guard';
  import { isAdmin } from '@stores/account.svelte';
  import {
    promptSettings,
    tablePrompt,
    defaultTablePrompt,
  } from '@stores/dream.svelte';
  import PullToRefresh from '@components/utils/PullToRefresh.svelte';

  import ExploreCategory from '@components/dashboard/collections/AddTopicCategory.svelte';
  import GenreTags from '@components/dashboard/collections/GenreTags.svelte';
  import Gating from '@components/dashboard/collections/Gating.svelte';
  import Media from '@components/dashboard/collections/Media.svelte';

  import World from '@components/dream/World.svelte';
  import Characters from '@components/dream/Characters.svelte';
  import Scenario from '@components/dream/Scenario.svelte';
  import WritingStyle from '@components/dream/WritingStyle.svelte';

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

  let topic_name = $derived(topic?.topic.name ?? 'Loading...');
  let topic_description = $derived(topic?.topic.description ?? '');
  let topic_availability = $derived(topic?.topic.available ?? false);
  let topic_visibility = $derived<TopicVisibility>(
    topic?.topic.visibility ?? 'public',
  );
  let topic_media_files = $derived<TopicMediaFile[]>(topic?.media_files ?? []);

  let topic_prompt_id = $derived(topic?.topic_prompt.id ?? '');
  let topic_text_prompt = $derived<TablePrompt>(
    topic?.topic_prompt.text.structured_prompt ?? {
      premise: topic?.topic_prompt.text.block_prompt ?? '',
    },
  );
  let topic_image_prompt = $derived(topic?.topic_prompt.image.prompt ?? '');

  let topic_categories = $derived<TopicCategory[]>(topic?.categories ?? []);
  let topic_genres = $derived<TopicGenre[]>(topic?.genres ?? []);
  let topic_gates = $derived<TopicGate[]>(topic?.gates ?? []);

  let is_block = $derived(topic?.topic_prompt.text.is_block ?? true);
  let promptVersions = $derived(
    topic?.topic_prompt.text.all_prompt_versions ?? [],
  );
  let currentVersion = $derived(
    topic?.topic_prompt.text.current_prompt_version ?? null,
  );

  let nameDraft = $state<string>('');
  let descriptionDraft = $state<string>('');
  let promptDraft = $state<TablePrompt>({ premise: '' });
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

  const saveSettingsChanges = async () => {
    await topicManager.editPromptSettings(topic_id, $promptSettings);
    await refreshTopic();
  };

  const hydrateTopic = async (refresh = false) => {
    const next = await topicManager.getTopicManager(topic_id, refresh);

    if (!next?.topic || !next.topic_prompt || !next.categories) {
      window.location.href = NAV_ROUTES.MANAGE;
      return;
    }

    topic = next; // all $derived fields auto-update
    setUpSettings(next.topic_prompt_settings);

    // Populate drafts for display (guarded so active edits aren't overwritten)
    if (!editingName) nameDraft = next.topic.name;
    if (!editingDescription) descriptionDraft = next.topic.description;
    if (!editingTextPrompt) {
      const text = next.topic_prompt.text;
      promptDraft = structuredClone(
        text.structured_prompt ?? { premise: text.block_prompt ?? '' },
      );
    }
    if (!editingImagePrompt) imagePromptDraft = next.topic_prompt.image.prompt;
  };

  const refreshTopic = async () => {
    await hydrateTopic(true);
  };

  $effect(() => {
    void (async () => {
      await ensurePlayer(NAV_ROUTES.MANAGE);
      await checkUserRoles();
      await hydrateTopic();
    })();
  });

  let editingName = $state<boolean>(false);
  let editingDescription = $state<boolean>(false);
  let editingTextPrompt = $state<boolean>(false);
  let editingImagePrompt = $state<boolean>(false);

  // When an edit toggle opens, populate the draft with the latest saved value.
  // untrack prevents re-running when the source $derived value changes (e.g. PullToRefresh during editing).
  $effect(() => {
    if (editingName) {
      nameDraft = untrack(() => topic_name);
    }
  });

  $effect(() => {
    if (editingDescription) {
      descriptionDraft = untrack(() => topic_description);
    }
  });

  $effect(() => {
    if (editingImagePrompt) {
      imagePromptDraft = untrack(() => topic_image_prompt);
    }
  });

  $effect(() => {
    if (editingTextPrompt) {
      const source = $state.snapshot(
        untrack(() => topic_text_prompt),
      ) as TablePrompt;
      promptDraft = structuredClone(source);
      tablePrompt.set({ ...defaultTablePrompt(), ...source });
    }
  });

  let promptHasChanges = $derived(editingTextPrompt);

  async function handleCategoryChange(
    categoryId: string,
    method: 'add' | 'remove',
    name?: string,
  ) {
    switch (method) {
      case 'add':
        await topicManager.addTopicToCategory(topic_id, categoryId);
        break;
      case 'remove':
        await topicManager.removeTopicFromCategory(topic_id, categoryId);
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
    await refreshTopic();
  }

  async function toggleVisibility(
    topic_id: string,
    visibility: 'public' | 'private',
  ) {
    await topicManager.changeVisibility(topic_id, visibility);
    await refreshTopic();
  }

  const handleSavePrompt = async () => {
    const currentPrompt: TablePrompt = is_block
      ? promptDraft
      : { ...get(tablePrompt), premise: promptDraft.premise };

    await topicManager.editPrompt(topic_id, currentPrompt);
    editingTextPrompt = false;
    await refreshTopic();
  };

  async function handleTextVersionSwitch(version_id: string) {
    if (version_id === currentVersion?.id) return;
    await topicManager.switchPromptVersion(topic_id, version_id, 'text');
    await refreshTopic();
  }

  async function handleImageVersionSwitch(version_id: string) {
    if (version_id === currentVersion?.id) return;
    await topicManager.switchPromptVersion(topic_id, version_id, 'image');
    await refreshTopic();
  }

  async function handleTextVersionDelete(version_id: string) {
    if (version_id === currentVersion?.id) return;
    await topicManager.deletePromptVersion(topic_id, version_id, 'text');
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
            <button
              class="purple-btn"
              onclick={() =>
                modal.topicSettings({ onSave: saveSettingsChanges })}
            >
              Story Settings
            </button>
            <a
              class="button-anchor cta"
              href="/dashboard/collections/topic/{topic_id}/demo?demoID={topic_id}&demoName={topic_name}"
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

      <section class="dream-container">
        <!-- PROMPT -->
        <div class="flex-row box-header">
          <span class="edit-wrapper flex flex-row flex-wrap">
            <h4>Story Prompt</h4>
            <span class="flex-row">
              {#if editingTextPrompt}
                <CloseSVG
                  onclick={() => {
                    editingTextPrompt = false;
                    promptDraft = $state.snapshot(
                      topic_text_prompt,
                    ) as TablePrompt;
                  }}
                />
                <SaveSVG
                  onclick={handleSavePrompt}
                  disabled={!promptHasChanges}
                />
              {:else}
                <EditSVG bind:editing={editingTextPrompt} />
              {/if}
            </span>
          </span>
        </div>

        {#if promptVersions.length}
          <div class="version-tiles flex-row flex-wrap gap-8">
            {#each promptVersions as version}
              <button
                class="void-btn small-tile-addon"
                class:active={version.id === currentVersion?.id}
                class:small-green-tile={version.id === currentVersion?.id}
                class:small-blue-tile={version.id !== currentVersion?.id}
                disabled={editingTextPrompt}
                onclick={() => handleTextVersionSwitch(version.id)}
              >
                <p>Version: {version.version_number}</p>
                {#if version.id !== currentVersion?.id}
                  <CloseSVG
                    onclick={(e) => {
                      e.stopPropagation();
                      handleTextVersionDelete(version.id);
                    }}
                    voidBtn={true}
                    dark={true}
                  />
                {/if}
              </button>
            {/each}
          </div>
        {/if}

        <!-- Premise (always shown) -->
        <div class="flex-row">
          <h4>Premise</h4>
          <textarea
            id="prompt"
            placeholder="Describe any scenario you want, and the AI will turn it into a story!"
            rows="5"
            bind:value={promptDraft.premise}
            disabled={!editingTextPrompt}
          ></textarea>
        </div>

        <!-- Structured fields (only when not block format) -->
        {#if !is_block}
          {#if editingTextPrompt}
            <World />
            <Characters />
            <Scenario />
            <WritingStyle />
            <div class="flex-row">
              <h4>Additional Data</h4>
              <textarea
                id="additional-data"
                placeholder="Add any additional styling, references, details..."
                rows="2"
                bind:value={$tablePrompt.additional_data}
              ></textarea>
            </div>
          {:else}
            <!-- Read-only display of populated structured fields -->
            {#if topic_text_prompt.environment}
              <div class="flex-row read-only-field">
                <h4>Environment</h4>
                <textarea disabled>{topic_text_prompt.environment}</textarea>
              </div>
            {/if}
            {#if topic_text_prompt.exposition}
              <div class="flex-row read-only-field">
                <h4>Exposition</h4>
                <textarea disabled>{topic_text_prompt.exposition}</textarea>
              </div>
            {/if}
            {#if topic_text_prompt.first_action}
              <div class="flex-row read-only-field">
                <h4>First Action</h4>
                <textarea disabled>{topic_text_prompt.first_action}</textarea>
              </div>
            {/if}
            {#if topic_text_prompt.main_character?.name}
              <div class="flex-row read-only-field">
                <h4>Main Character</h4>
                <textarea disabled>
                  {topic_text_prompt.main_character.name} &mdash; {topic_text_prompt
                    .main_character.description}
                </textarea>
              </div>
            {/if}
            {#if topic_text_prompt.side_characters?.length}
              <div class="flex-row read-only-field">
                <h4>Side Characters</h4>
                <textarea disabled>
                  {topic_text_prompt.side_characters
                    .map((c) => c.name)
                    .join(', ')}
                </textarea>
              </div>
            {/if}
            {#if topic_text_prompt.additional_data}
              <div class="flex-row read-only-field">
                <h4>Additional Data</h4>
                <textarea disabled>{topic_text_prompt.additional_data}</textarea
                >
              </div>
            {/if}
          {/if}
        {/if}
      </section>

      <section class="dream-container">
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
      </section>

      <!-- MEDIA FILES -->
      <Media {topic_media_files} {handleMediaUpload} {handleDeleteMedia} />

      <button
        class="red-btn"
        onclick={() =>
          modal.confirm('', ensureMessage('delete this story'), {
            onConfirm: async () => {
              await topicManager.deleteTopic(topic_id);
              window.location.href = '/dashboard/collections';
            },
            confirmText: `Delete story: ${topic_name}`,
          })}
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
  #image-prompt:disabled,
  #additional-data:disabled {
    @include white-txt(0.5);
  }

  .version-tiles {
    justify-content: center;
    flex-flow: row-reverse wrap;

    .small-tile-addon.active::after {
      content: 'active';
    }
  }

  .box-header .edit-wrapper {
    flex-direction: row;
    align-items: center;
  }
</style>
