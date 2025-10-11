<!-- 🔒 GATED FOR ADMINS -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { NAV_ROUTES } from '@constants/routes';
  import TopicManagement from '@lib/topics';
  import { GetCache, ALL_TOPICS_KEY } from '@constants/cache';
  import openModal from '@stores/modal.svelte';
  import { ensureMessage } from '@constants/modal';
  import { navContext } from '@stores/navigation.svelte';
  import { userState } from '@utils/route-guard';

  import GenreTags from '@components/dashboard/dream-legacy/manage/GenreTags.svelte';
  import Media from '@components/dashboard/dream-legacy/manage/Media.svelte';
  import NftGating from '@components/dashboard/dream-legacy/manage/NftGating.svelte';
  import ExploreCategory from '@components/dashboard/dream/manage/collections/AddTopicCategory.svelte';
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

  let topic_name = $derived<string>('Loading...');
  let topic_description = $state<string>('');
  let topic_availability = $state<boolean>(false);
  let topic_visibility = $state<TopicVisibility>('public');

  let topic_prompt_id = $state<string>('');
  let topic_prompt = $state<string>('');
  let topic_imagePrompt = $state<string>('');

  let topic_categories = $state<TopicCategory[]>([]);
  let topic_genres = $state<TopicGenre[]>([]);
  let topic_gates = $state<Gate[]>([]);
  let topic_media_files = $state<TopicMediaFile[]>([]);

  let derivedTopicName = $derived<string>(topic_name);
  let derivedTopicDescription = $derived<string>(topic_description);
  let derivedTopicAvailability = $derived<boolean>(topic_availability);
  let derivedTopicVisibility = $derived<TopicVisibility>(topic_visibility);
  let derivedTopicPrompt = $derived<string>(topic_prompt);
  let derivedTopicImagePrompt = $derived<string>(topic_imagePrompt);

  let jsonBlob: Nullable<Blob> = null;

  let categoryTopics: string[] = [];
  let activeStoryIndex: number = 0;
  let prevStoryIndex = $derived(
    activeStoryIndex <= 0 ? categoryTopics.length - 1 : activeStoryIndex - 1,
  );

  onMount(async () => {
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

    const exportObject = {
      topic: topic_name,
      description: topic_description,
      prompt_id: topic_prompt_id,
      prompt: topic_prompt,
      image_prompt: topic_imagePrompt,
      genres: topic_genres,
      categories: topic_categories,
    };

    jsonBlob = new Blob([JSON.stringify(exportObject)], {
      type: 'application/json',
    });

    const storedTopics: Nullable<string> = GetCache(ALL_TOPICS_KEY);
    if (storedTopics) {
      navContext.setContext({
        items: storedTopics.split('][').map((id) => ({
          name: id,
          link: `/dashboard/dream/manage/${id}`,
        })),
        index: storedTopics.split('][').indexOf(topic_id),
      });
    }
  });

  let editingName = $state<boolean>(false);
  let editingDescription = $state<boolean>(false);
  let editingPrompt = $state<boolean>(false);
  let editingImagePrompt = $state<boolean>(false);

  async function handleCategoryChange(
    categoryId: string,
    method: 'add' | 'remove',
  ) {
    switch (method) {
      case 'add':
        await topicManager.addTopicToCategory(topic_id, categoryId);
        break;
      case 'remove':
        await topicManager.removeTopicFromCategory(topic_id, categoryId);
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

  const switchAvailable = (available: boolean) => {
    if (available) return false;
    else return true;
  };

  const downloadTopicJson = () => {
    if (jsonBlob) {
      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic_name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
</script>

<section class="topic-wrapper flex pad-24 blur">
  {#if !topic || !topic.topic || !topic.topic_prompt || !topic.categories}
    <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
  {:else}
    <section class="dream-container fade-in">
      <!-- KEY BUTTONS -->
      {#key topic}
        <span class="flex-row flex-wrap">
          <button
            class:green-btn={topic_availability}
            class:red-btn={!topic_availability}
            use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
            onclick={() => {}}
          >
            {topic_availability}
          </button>
          <button
            class="rose-btn"
            use:tippy={{ content: 'Download story file', animation: 'scale' }}
            onclick={downloadTopicJson}
          >
            Export JSON
          </button>
          <a
            class="button-anchor purple-btn"
            href={`/dashboard/dream/manage/demo?demoID=${topic_id}&demoName=${topic_name}`}
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
                  derivedTopicName = topic_name;
                }}
              />
            {/if}
            <div class="input-container">
              <label for="story-name">Story name</label>
              <input
                bind:value={derivedTopicName}
                type="text"
                size={derivedTopicName.length + 1}
                maxlength="50"
                disabled={!editingName}
              />
            </div>
            {#if editingName}
              <SaveSVG
                onclick={() => {
                  editingName = false;
                  topicManager.changeName(topic_id, derivedTopicName);
                  window.location.href = `${NAV_ROUTES.EXPLORE(topic_id)}`;
                }}
                disabled={true}
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

      <hr />

      <!-- DESCRIPTION -->
      <div class="flex-row">
        <span class="edit-wrapper flex">
          <h4>Description</h4>
          <span class="flex-row">
            {#if editingDescription}
              <CloseSVG onclick={() => (editingDescription = false)} />
              <SaveSVG
                onclick={() => {
                  editingDescription = false;
                  topicManager.changeDescription(
                    topic_id,
                    derivedTopicDescription,
                  );
                }}
                disabled={topic_description == derivedTopicDescription}
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
          bind:value={derivedTopicDescription}
          disabled={!editingDescription}
        ></textarea>
      </div>

      <!-- IMAGE-PROMPT -->
      <div class="flex-row box-header">
        <span class="edit-wrapper flex">
          <h4>Image Generation Instructions</h4>
          <span class="flex-row">
            {#if editingImagePrompt}
              <CloseSVG onclick={() => (editingImagePrompt = false)} />
              <SaveSVG
                onclick={() => {
                  editingImagePrompt = false;
                  topicManager.editImagePrompt(
                    topic_id,
                    derivedTopicImagePrompt,
                  );
                }}
                disabled={topic_imagePrompt == derivedTopicImagePrompt}
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
          bind:value={derivedTopicImagePrompt}
          disabled={!editingImagePrompt}
        ></textarea>
      </div>

      <!-- PROMPT -->
      <div class="flex-row box-header">
        <span class="edit-wrapper flex">
          <h4>Prompt</h4>
          <span class="flex-row">
            {#if editingPrompt}
              <CloseSVG onclick={() => (editingPrompt = false)} />
              <SaveSVG
                onclick={() => {
                  editingPrompt = false;
                  topicManager.editPrompt(topic_id, derivedTopicPrompt);
                }}
                disabled={topic_prompt == derivedTopicPrompt}
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
          bind:value={derivedTopicPrompt}
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
          `Delete story: ${derivedTopicName}`,
          () => {
            topicManager.deleteTopic(topic_id);
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
    min-height: 100dvh;
    padding-block: 5rem;
    background-color: rgba(0, 0, 0, 0.25);

    @include respond-up(small-desktop) {
      padding-block: 6rem 1.5rem;
    }

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

  :global(html) {
    padding-block: 0;
  }
</style>
