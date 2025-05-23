<script lang="ts">
  import { onMount } from 'svelte';
  import { AdminApp } from '@lib/admin';
  import {
    showModal,
    secondButton,
    secondButtonClass,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';
  import { GetCache, ALL_TOPICS_KEY } from '@constants/cache';

  import GenreTags from './GenreTags.svelte';
  import Media from './Media.svelte';
  import NftGating from './NftGating.svelte';

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

  const activeInputStyling = `
    color: rgb(51, 226, 230);
    background-color: rgba(51, 226, 230, 0.1);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
    cursor: text;
  `;

  function openModal() {
    $secondButton = `Delete story: ${topic_name}`;
    $secondButtonClass = 'red-button';
    $handleSecondButton = () => {
      admin.deleteStory(topic.id);
      $showModal = false;
      window.open('/dashboard/dream/manage/', '_self');
    };
    $modalContent = `<h2>Are you sure you want to delete this story?</h2>
        <h3>This action is irreversible. You will lose it forever!</h3>`;
    $showModal = true;
  }

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

  // SVG Icons
  let editSvgHover: boolean = false;
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role a11y_click_events_have_key_events -->
<section class="container-wrapper">
  {#if !topic}
    <img class="loading-icon" src="/icons/loading.png" alt="Loading" />
  {:else}
    {#if categoryTopics.length > 0}
      <div class="buttons-wrapper stories-switcher">
        <a
          class="buttons-wrapper switch-arrow"
          href="/dashboard/dream/manage/{categoryTopics[prevStoryIndex]}"
        >
          <img src="/icons/switch-arrow.svg" alt="Switch" />
          <h3 style:text-align="left">{categoryTopics[prevStoryIndex]}</h3>
        </a>

        <a
          class="buttons-wrapper switch-arrow"
          href="/dashboard/dream/manage/{categoryTopics[
            (activeStoryIndex + 1) % categoryTopics.length
          ]}"
        >
          <h3 style:text-align="right">
            {categoryTopics[(activeStoryIndex + 1) % categoryTopics.length]}
          </h3>
          <img
            src="/icons/switch-arrow.svg"
            alt="Switch"
            style="transform: rotate(180deg)"
          />
        </a>
      </div>
    {/if}

    <!-- NAME, CATEGORY -->
    <div class="container blur">
      <div class="story-title">
        {#if editingName}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="close-svg"
            stroke="rgba(255, 60, 64, 0.85)"
            stroke-width="30"
            stroke-linecap="round"
            on:click={() => {
              editingName = false;
              storyName = topic_name;
            }}
            role="button"
            tabindex="0"
          >
            <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="checkmark-svg"
            fill="rgba(51, 226, 230, 0.75)"
            stroke-width="30"
            on:click={() => {
              editingName = false;
              if (topic_name == storyName) return;
              admin.editTopicName(topic_name, storyName);
              window.open('/dashboard/dream/manage/', '_self');
            }}
            role="button"
            tabindex="0"
          >
            <defs>
              <mask id="checkmark-svg-mask">
                <circle r="85" stroke="none" fill="white" />
                <path
                  d="M -50 0 L -15 30 L 50 -35"
                  fill="none"
                  stroke="black"
                />
              </mask>
            </defs>
            <circle r="85" stroke="none" mask="url(#checkmark-svg-mask)" />
          </svg>
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-100 -100 200 200"
            class="edit-svg"
            stroke="rgba(51, 226, 230, 0.75)"
            fill="none"
            stroke-width="15"
            stroke-linecap="round"
            stroke-linejoin="round"
            on:click={() => {
              editingName = true;
              editSvgHover = false;
            }}
            on:pointerover={() => (editSvgHover = true)}
            on:pointerout={() => (editSvgHover = false)}
            role="button"
            tabindex="0"
          >
            <path d="M -10 -60 L -75 -60 L -75 75 L 60 75 L 60 10" />
            <path
              d="M -30 30 L -25 0 L 45 -70 M -30 30 L 0 25 L 70 -45 C  90 -60 60 -90 45 -70"
              transform={editSvgHover ? 'translate(-10 10)' : ''}
            />
          </svg>
        {/if}
        <input
          bind:value={storyName}
          style={editingName ? activeInputStyling : ''}
          type="text"
          size={storyName.length + 1}
          maxlength="50"
          disabled={!editingName}
        />
      </div>

      {#key topic}
        <div class="buttons-wrapper">
          <button
            class:green-button={topic.available === 'available'}
            class:red-button={topic.available === 'unavailable'}
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
          <a
            class="button-anchor"
            href={`/dashboard/dream/manage/demo?demoID=${topic.prompt_id}&demoName=${topic_name}`}
          >
            Play Demo
          </a>
          <button class="rose-button" on:click={downloadTopicJson}
            >Export JSON</button
          >
        </div>
      {/key}

      <div class="input-container">
        <label for="category">Category:</label>
        {#if categories}
          <select
            class="selector"
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

    <!-- GENRES -->
    <GenreTags {topic} {handleGenreChange} />

    <!-- DESCRIPTION -->
    <div class="dream-box blur open-prompt">
      <div class="buttons-wrapper box-header">
        <h2>Description</h2>
        <div class="buttons-wrapper">
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
        class="story-input dream-textfield"
        placeholder="Describe the overall story, its key themes, and what kind of journey the main character will take. Is it an epic adventure, a gripping mystery, or a heartwarming romance? Keep it engaging and set the stage for the reader!"
        rows="5"
        bind:value={storyDescription}
        disabled={!editingDescription}
      ></textarea>
    </div>

    <!-- IMAGE-PROMPT -->
    <div class="dream-box blur open-prompt">
      <div class="buttons-wrapper box-header">
        <h2>Image Generation Instructions</h2>
        <div class="buttons-wrapper">
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
        class="story-input dream-textfield"
        placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
        rows="10"
        bind:value={storyImagePrompt}
        disabled={!editingImagePrompt}
      ></textarea>
    </div>

    <!-- PROMPT -->
    <div class="dream-box blur open-prompt">
      <div class="buttons-wrapper box-header">
        <h2>Prompt</h2>
        <div class="buttons-wrapper">
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
        class="story-input dream-textfield"
        placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
        rows="10"
        bind:value={storyPrompt}
        disabled={!editingPrompt}
      ></textarea>
    </div>

    <!-- NFT RESTRICTIONS -->
    <NftGating {topic} {handleGatingChange} />

    <!-- MEDIA FILES -->
    <Media bind:topic_id={topic.id} />

    <button class="red-button blur" on:click={openModal}>Delete Story</button>
  {/if}
</section>

<style>
  button,
  .button-anchor {
    text-transform: uppercase;
  }

  .close-svg:hover {
    transform: scale(1.05);
  }

  .story-title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
    padding: 1vw;
    background-color: rgba(51, 226, 230, 0.15);
    border-radius: 1vw;
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.25),
      0 0 0.5vw #010020;
  }

  input {
    border: none;
    outline: none;
    width: auto;
    text-align: center;
    color: rgba(51, 226, 230, 0.85);
    font-size: 2vw;
    line-height: 2vw;
    box-shadow: inset 0 0 0.5vw #010020;
    background-color: rgba(1, 0, 32, 0.35);
    border-radius: 1vw;
    padding: 1vw;
    text-overflow: ellipsis;
  }

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

  @media only screen and (max-width: 600px) {
    .container {
      width: 100vw;
      border-radius: 0;
    }

    .story-title {
      max-width: 90vw;
      padding: 0.5em;
      border-radius: 1em;
      gap: 0.75em;
    }

    input {
      font-size: 1.5em;
      line-height: 1.5em;
      padding: 0.25em 0.5em;
      border-radius: 0.5em;
      max-width: 60vw;
    }

    .open-prompt {
      padding: 1em;
    }

    .open-prompt h2 {
      line-height: 1.5em;
    }

    .box-header {
      flex-flow: row wrap !important;
    }

    .box-header .buttons-wrapper {
      flex-direction: row;
      width: auto;
    }

    #description,
    #prompt {
      min-height: 50vh;
    }

    #image-prompt {
      min-height: 12em;
    }
  }
</style>
