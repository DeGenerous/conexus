<script lang="ts">
  import { onMount } from 'svelte';

  // import PromptHeader from './PromptHeader.svelte';
  // import GenreTags from './GenreTags.svelte';
  // import AvailableButton from './AvailableButton.svelte';
  // import Gallery from './Gallery.svelte';
  // import { goto } from '$app/navigation';

  import Media from '@components/Dashboard/Media.svelte';
  import { AdminApp } from '@lib/admin';

  // import Modal from './Modal.svelte'; // Assuming you have a separate Modal component

  let adminApp = new AdminApp();

  export let topic_name = 'escape'; // Default topic_name

  export let topic: ViewTopic;;
  export let user: User;
  export let categories;
  // export let genres;
  // export let refreshPage;

  let openTopicDescription = false;
  let openPrompt = false;
  // let topicDescription = { id: 1, description: 'topic.description' };
  let topicDescription;
  let promptText = {};

  function handleTopicCategoryChange(
    topicId: number,
    categoryId: string | null,
  ) {
    console.log(`Changing category for ${topicId} to ${categoryId}`);
  }

  function navigate(path) {
    console.log(`Navigating to ${path}`);
  }

  function handleOpenImagePromptModal(topicId, imagePrompt) {
    console.log(`Open image prompt for ${topicId}: ${imagePrompt}`);
  }

  function handleMigrate(data) {
    console.log('Migrating:', data);
  }

  function handleOpenDeleteModal(promptId, topicName) {
    console.log(`Deleting ${topicName} with prompt ID ${promptId}`);
  }

  function handleSave(promptId, topicId, text, available) {
    console.log('Saving:', { promptId, topicId, text, available });
  }

  function handleTopicDescriptionChange() {
    console.log('Updating topic description:', topicDescription);
  }

  onMount(async () => {
    const view_topic = await adminApp.fetchTopic(topic_name);
    categories = await adminApp.fetchCategories();

    if (view_topic) {
      topic = view_topic;
      topicDescription = { id: topic.id ?? 1, description: topic.description }
    }
  });
</script>

<div class="container">
  <div class="header">
    {#if categories && topic !== null}
      <select
        bind:value={topic.category_id}
        on:change={(e) =>
          handleTopicCategoryChange(
            topic.id,
            (e.target as HTMLSelectElement).value,
          )}
      >
        <option value="">Select a category</option>
        {#each categories as category}
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    {/if}
  </div>

  <div class="tags-container">
    <!-- <GenreTags {topic} availableGenres={genres} /> -->
  </div>

  <div class="button-group">
    <a href="#image-gallery" class="btn blue">Image Gallery</a>
    <a href="#music-gallery" class="btn green">Audio Gallery</a>
    {#if topic}
      <button
        class="btn yellow"
        on:click={() =>
          handleOpenImagePromptModal(topic.id, topic.image_prompt)}
      >
        Image Prompt
      </button>
    {/if}
    {#if user?.role === 'admin' && topic}
      <button
        class="btn red"
        on:click={() => handleOpenDeleteModal(topic.prompt_id, topic.name)}
      >
        Delete
      </button>
    {/if}
  </div>

  <div class="description">
    <h2>Description</h2>
    {#if openTopicDescription}
      <textarea bind:value={topicDescription.description} rows="10"></textarea>
      <button
        class="btn green"
        on:click={() => {
          handleTopicDescriptionChange();
          openTopicDescription = false;
        }}
      >
        Save
      </button>
      <button
        class="btn red"
        on:click={() => (openTopicDescription = false)}
      >
        Cancel
      </button>
    {:else}
      <button
        class="description-btn"
        on:click={() => (openTopicDescription = true)}
        aria-label="Edit topic description"
      >
        {topic?.description ?? 'Add a description'}
      </button>
    {/if}
  </div>

  {#if topic}
    <Media {topic_name} topic_id={topic.id} />
  {/if}

  <!-- <div id="image-gallery" class="gallery">
    <h2>Image Gallery</h2>
    <Gallery folder={topic?.name} folderPath="backgrounds" type="image" />
    <Gallery folder={topic?.name} folderPath="description" type="image" />
  </div>

  <div id="music-gallery" class="gallery">
    <h2>Audio Gallery</h2>
    <Gallery folder={topic?.name} type="music" />
  </div> -->
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding: 1rem;
    color: white;
  }

  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    background-color: #2d3748;
    border-radius: 8px;
  }

  select {
    border: 1px solid #ccc;
    padding: 0.5rem;
    border-radius: 5px;
    color: black;
  }

  .tags-container {
    width: 100%;
    max-width: 500px;
    padding: 1rem;
    margin-top: 1rem;
  }

  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 1rem;
  }

  .button-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 1rem;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    text-decoration: none;
    border: none;
    cursor: pointer;
  }

  .blue {
    background-color: #2563eb;
  }

  .green {
    background-color: #059669;
  }

  .yellow {
    background-color: #ca8a04;
  }

  .red {
    background-color: #dc2626;
  }

  .description {
    width: 100%;
    max-width: 500px;
    text-align: center;
    margin-top: 1rem;
  }

  .description-btn {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9fafb;
    color: black;
    text-align: left;
    width: 100%;
  }

  h2 {
    color: #d1d5db;
  }
</style>
