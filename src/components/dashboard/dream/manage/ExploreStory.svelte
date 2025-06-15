<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { tippy } from 'svelte-tippy';

  import { AdminApp } from '@lib/admin';
  import { GetCache, ALL_TOPICS_KEY } from '@constants/cache';
  import openModal from '@stores/modal.svelte';
  import { deleteStoryModal } from '@constants/modal';
  import { prevStory, nextStory } from '@stores/navigation.svelte';

  import GenreTags from './GenreTags.svelte';
  import Media from './Media.svelte';
  import NftGating from './NftGating.svelte';
  import EditSVG from '@components/icons/Edit.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';

  export let topic_name = 'story';

  let admin = new AdminApp();
  let topic: ViewTopic;
  let categories: CategoryView[] = [];

  let storyName = topic_name;

  let topic_description: string = '';
  $: storyDescription = topic_description;

  let topic_prompt: string = '';
  $: storyPrompt = topic_prompt;

  let topic_imagePrompt: string = '';
  $: storyImagePrompt = topic_imagePrompt;

  let jsonBlob: Nullable<Blob> = null;

  let categoryTopics: string[] = [];
  let activeStoryIndex: number = 0;
  $: prevStoryIndex =
    activeStoryIndex <= 0 ? categoryTopics.length - 1 : activeStoryIndex - 1;

  onMount(async () => {
    const topic_ = await admin.fetchTopic(topic_name);

    if (!topic_) {
      window.open('/dashboard/dream/manage/', '_self');
      return;
    }

    topic = topic_;

    topic_description = topic.description;
    topic_prompt = topic.prompt;
    topic_imagePrompt = topic.image_prompt;

    categories = await admin.fetchCategories();

    const exportObject = {
      topic: topic.name,
      description: topic.description,
      prompt: topic.prompt,
      image_prompt: topic.image_prompt,
      genres: topic.genres,
      category: topic.category_id,
    };

    jsonBlob = new Blob([JSON.stringify(exportObject)], {
      type: 'application/json',
    });

    const storedTopics: Nullable<string> = GetCache(ALL_TOPICS_KEY);
    if (storedTopics) {
      categoryTopics = storedTopics.split('][');
      activeStoryIndex = categoryTopics?.indexOf(topic.name);
    }
  });

  let editingName: boolean = false;
  let editingDescription: boolean = false;
  let editingPrompt: boolean = false;
  let editingImagePrompt: boolean = false;

  async function handleGenreChange(genre_id: number, method: 'add' | 'remove') {
    switch (method) {
      case 'add':
        await admin.addGenre(topic.id, genre_id);
        break;
      case 'remove':
        await admin.removeGenre(topic.id, genre_id);
        break;
    }
  }

  async function handleGatingChange(
    topic_id: number,
    contract_name: SupportedContracts,
    method: 'add' | 'remove',
    class_id?: string,
  ) {
    switch (method) {
      case 'add':
        await admin.gateTopic({
          topic_id,
          contract_name,
          class_id: parseInt(class_id!),
        });
        break;
      case 'remove':
        await admin.removeTopicGate(topic_id, contract_name);
        break;
    }
  }

  const switchAvailable = (available: string) => {
    if (available === 'available') return 'unavailable';
    else return 'available';
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

{#if !topic}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  {@html (() => {
    if (!categoryTopics.length) return;
    prevStory.link = `/dashboard/dream/manage/${categoryTopics[prevStoryIndex]}`;
    prevStory.name = categoryTopics[prevStoryIndex];
    nextStory.link = `/dashboard/dream/manage/${
      categoryTopics[(activeStoryIndex + 1) % categoryTopics.length]
    }`;
    nextStory.name =
      categoryTopics[(activeStoryIndex + 1) % categoryTopics.length];
  })()}

  <!-- KEY BUTTONS -->
  {#key topic}
    <span class="flex-row flex-wrap">
      <button
        class:green-btn={topic.available === 'available'}
        class:red-btn={topic.available === 'unavailable'}
        use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
        on:click={() =>
          admin
            .changeAvailability(topic.id, switchAvailable(topic.available))
            .then(async () => {
              const topic_ = await admin.fetchTopic(topic_name);

              if (!topic_) {
                window.open('/dashboard/dream/manage/', '_self');
                return;
              }

              topic = topic_;
            })}>{topic.available}</button
      >
      <button
        class="rose-btn"
        use:tippy={{ content: 'Download story file', animation: 'scale' }}
        on:click={downloadTopicJson}
      >
        Export JSON
      </button>
      <a
        class="button-anchor purple-btn"
        href={`/dashboard/dream/manage/demo?demoID=${topic.prompt_id}&demoName=${topic_name}`}
      >
        Play Demo
      </a>
    </span>
  {/key}

  <section class="dream-container">
    <!-- STORY NAME & CATEGORY -->
    <div class="flex-row">
      <h4>Story</h4>
      <div class="story-data container">
        <div class="story-name flex-row">
          {#if editingName}
            <CloseSVG
              onclick={() => {
                editingName = false;
                storyName = topic_name;
              }}
            />
          {/if}
          <div class="input-container">
            <label for="story-name">Story name</label>
            <input
              bind:value={storyName}
              type="text"
              size={storyName.length + 1}
              maxlength="50"
              disabled={!editingName}
            />
          </div>
          {#if editingName}
            <SaveSVG
              onclick={() => {
                editingName = false;
                admin.editTopicName(topic_name, storyName);
                window.open('/dashboard/dream/manage/', '_self');
              }}
              disabled={topic_name == storyName}
            />
          {:else}
            <EditSVG bind:editing={editingName} />
          {/if}
        </div>

        <div class="input-container">
          <label for="category">Selected category</label>
          {#if categories}
            <select
              value={topic.category_id}
              on:change={(event) => {
                const target = event.target as HTMLSelectElement;
                if (target) {
                  admin.editTopicCategory(topic.id, parseInt(target.value));
                }
              }}
            >
              {#each categories as { id, name }}
                <option value={id}>{name}</option>
              {/each}
            </select>
          {/if}
        </div>
      </div>
    </div>

    <hr />

    <!-- GENRES -->
    <GenreTags {topic} {handleGenreChange} />

    <hr />

    <!-- NFT RESTRICTIONS -->
    <NftGating {topic} {handleGatingChange} />

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
                admin.editTopicDescription(topic.id, storyDescription);
              }}
              disabled={topic_description == storyDescription}
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
        bind:value={storyDescription}
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
                admin.editImagePrompt(topic.id, storyImagePrompt);
              }}
              disabled={topic_imagePrompt == storyImagePrompt}
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
        bind:value={storyImagePrompt}
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
            <!-- todo reset data -->
            <SaveSVG
              onclick={() => {
                editingPrompt = false;
                admin.editPrompt(storyPrompt, topic.id, topic.prompt_id);
              }}
              disabled={topic_prompt == storyPrompt}
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
        bind:value={storyPrompt}
        disabled={!editingPrompt}
      ></textarea>
    </div>
  </section>

  <!-- MEDIA FILES -->
  <Media bind:topic_id={topic.id} />

  <button
    class="red-btn blur"
    on:click={() =>
      openModal(deleteStoryModal, `Delete story: ${topic_name}`, () => {
        admin.deleteStory(topic.id);
        window.open('/dashboard/dream/manage/', '_self');
      })}
  >
    Delete Story
  </button>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

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
</style>
