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

  <!-- STORY NAME -->
  <div class="story-data dream-container">
    <div class="flex-row">
      <h4>Name</h4>
      <div class="story-name container">
        {#if editingName}
          <CloseSVG
            onclick={() => {
              editingName = false;
              storyName = topic_name;
            }}
            voidBtn={true}
          />
        {/if}
        <input
          bind:value={storyName}
          type="text"
          size={storyName.length + 1}
          maxlength="50"
          disabled={!editingName}
        />
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
    </div>

    <!-- CATEGORY & KEY-BUTTONS -->
    {#key topic}
      <div class="settings flex-row">
        <h4>Settings</h4>
        <div class="container">
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

          <div class="flex-row">
            <button
              class:green-btn={topic.available === 'available'}
              class:red-btn={topic.available === 'unavailable'}
              use:tippy={{ content: 'Toggle visibility', animation: 'scale' }}
              on:click={() =>
                admin
                  .changeAvailability(
                    topic.id,
                    switchAvailable(topic.available),
                  )
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
              use:tippy={{ content: 'Export story file', animation: 'scale' }}
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
          </div>
        </div>
      </div>
    {/key}
  </div>

  <!-- GENRES -->
  <GenreTags {topic} {handleGenreChange} />

  <!-- NFT RESTRICTIONS -->
  <NftGating {topic} {handleGatingChange} />

  <!-- DESCRIPTION -->
  <div class="dream-container blur open-prompt">
    <div class="flex-row box-header">
      <h2>Description</h2>
      <div class="flex-row">
        {#if editingDescription}
          <button
            class="red-button"
            on:click={() => (editingDescription = false)}>CANCEL</button
          >
          <button
            class="green-button"
            on:click={() => {
              editingDescription = false;
              if (topic_description == storyDescription) return;
              admin.editTopicDescription(topic.id, storyDescription);
            }}
          >
            SAVE
          </button>
        {:else}
          <button on:click={() => (editingDescription = true)}>EDIT</button>
        {/if}
      </div>
    </div>
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
  <div class="dream-container blur open-prompt">
    <div class="flex-row box-header">
      <h2>Image Generation Instructions</h2>
      <div class="flex-row">
        {#if editingImagePrompt}
          <button
            class="red-button"
            on:click={() => (editingImagePrompt = false)}>CANCEL</button
          >
          <button
            class="green-button"
            on:click={() => {
              editingImagePrompt = false;
              if (topic_imagePrompt == storyImagePrompt) return;
              admin.editImagePrompt(topic.id, storyImagePrompt);
            }}
          >
            SAVE
          </button>
        {:else}
          <button on:click={() => (editingImagePrompt = true)}>EDIT</button>
        {/if}
      </div>
    </div>
    <textarea
      id="image-prompt"
      class="dream-input dream-textfield"
      placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
      rows="10"
      bind:value={storyImagePrompt}
      disabled={!editingImagePrompt}
    ></textarea>
  </div>

  <!-- PROMPT -->
  <div class="dream-container blur open-prompt">
    <div class="flex-row box-header">
      <h2>Prompt</h2>
      <div class="flex-row">
        {#if editingPrompt}
          <button class="red-button" on:click={() => (editingPrompt = false)}
            >CANCEL</button
          >
          <button
            class="green-button"
            on:click={() => {
              editingPrompt = false;
              if (topic_prompt == storyPrompt) return;
              admin.editPrompt(storyPrompt, topic.id, topic.prompt_id);
            }}
          >
            SAVE
          </button>
        {:else}
          <button on:click={() => (editingPrompt = true)}>EDIT</button>
        {/if}
      </div>
    </div>
    <textarea
      id="prompt"
      class="dream-input dream-textfield"
      placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
      rows="10"
      bind:value={storyPrompt}
      disabled={!editingPrompt}
    ></textarea>
  </div>

  <!-- MEDIA FILES -->
  <Media bind:topic_id={topic.id} />

  <button
    class="red-button blur"
    on:click={() =>
      openModal(deleteStoryModal, `Delete story: ${topic_name}`, () => {
        admin.deleteStory(topic.id);
        window.open('/dashboard/dream/manage/', '_self');
      })}
  >
    Delete Story
  </button>
{/if}

<!-- <style>
  .open-prompt {
    align-items: center;
    padding: 0.5vw;
  }

  .open-prompt h2 {
    line-height: 4vw;
  }

  #description,
  #prompt,
  #image-prompt {
    width: 90vw;
  }

  #description:disabled,
  #prompt:disabled,
  #image-prompt:disabled {
    color: #bebebe;
    cursor: not-allowed;
  }
</style> -->

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .story-data {
    max-width: 70rem;

    .story-name {
      flex-wrap: nowrap;
      justify-content: center;

      input {
        width: 100%;
        animation: none;
      }
    }

    .settings {
      .container {
        align-items: flex-end;

        div {
          width: auto;
          justify-content: center;
        }
      }
    }
  }
</style>
