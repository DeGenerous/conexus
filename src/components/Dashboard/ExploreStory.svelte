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

  export let topic_name = 'Escape'; // Default topic_name

  export let topic: NewTopic
  export let user;
  export let categories;
  // export let genres;
  // export let refreshPage;

  let openTopicDescription = false;
  let openPrompt = false;
  let topicDescription = { id: 1, description: "topic.description" };
  // let topicDescription = { id: topic?.id ?? 1, description: topic.description };
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
</script>

<div
  style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; min-height: 100vh; padding: 1rem; color: white;"
>
  <div
    style="display: flex; justify-content: space-between; width: 100%; max-width: 500px; padding: 1rem; background-color: #2d3748; border-radius: 8px;"
  >
    <!-- <PromptHeader {topic} isAdmin={user?.role === 'admin'} /> -->
    {#if categories}
      <select
        bind:value={topic.category_id}
        on:change={(e) => handleTopicCategoryChange(topic.id, (e.target as HTMLSelectElement).value)}
        style="border: 1px solid #ccc; padding: 0.5rem; border-radius: 5px; color: black;"
      >
        {#each categories as category}
          <option value="">Select a category</option>
          <option value={category.id}>{category.name}</option>
        {/each}
      </select>
    {/if}
  </div>

  <div style="width: 100%; max-width: 500px; padding: 1rem; margin-top: 1rem;">
    <!-- <GenreTags {topic} availableGenres={genres} /> -->
  </div>

  <div
    style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 1rem;"
  >
    <a
      href="#image-gallery"
      style="background-color: #2563eb; padding: 10px 20px; border-radius: 8px; color: white;"
      >Image Gallery</a
    >
    <a
      href="#music-gallery"
      style="background-color: #059669; padding: 10px 20px; border-radius: 8px; color: white;"
      >Audio Gallery</a
    >
    <button
      on:click={() => handleOpenImagePromptModal(topic.id, topic.image_prompt)}
      style="background-color: #ca8a04; padding: 10px 20px; border-radius: 8px; color: white;"
      >Image Prompt</button
    >
    <!-- <AvailableButton {topic.prompt_id} {topic.available} {refreshPage} /> -->
    {#if user?.role === 'admin'}
      <button
        on:click={() => handleOpenDeleteModal(topic.prompt_id, topic.name)}
        style="background-color: #dc2626; padding: 10px 20px; border-radius: 8px; color: white;"
        >Delete</button
      >
    {/if}
  </div>

  <div
    style="width: 100%; max-width: 500px; text-align: center; margin-top: 1rem;"
  >
    <h2 style="color: #d1d5db;">Description</h2>
    {#if openTopicDescription}
      <textarea
        bind:value={topicDescription.description}
        rows="3"
        style="width: 100%; padding: 1rem; border: 1px solid #ccc; border-radius: 5px; color: black;"
      ></textarea>
      <button
        on:click={() => {
          handleTopicDescriptionChange();
          openTopicDescription = false;
        }}
        style="background-color: #059669; padding: 10px; border-radius: 8px; color: white;"
        >Save</button
      >
    {:else}
      <button
        on:click={() => (openTopicDescription = true)}
        on:keydown={(e) => e.key === 'Enter' && (openTopicDescription = true)}
        aria-label="Edit topic description"
        style="padding: 1rem; border: 1px solid #ccc; border-radius: 5px; background-color: #f9fafb; color: black; text-align: left; width: 100%;"
      >
        { "Add a description"}
        <!-- {topic.description ?? "Add a description"} -->
      </button>
    {/if}
  </div>

  <Media {topic_name} />

  <div
    id="image-gallery"
    style="width: 100%; text-align: center; margin-top: 2rem;"
  >
    <h2 style="color: white;">Image Gallery</h2>
    <!-- <Gallery folder={topic.name} folderPath="backgrounds" type="image" />
    <Gallery folder={topic.name} folderPath="description" type="image" /> -->
  </div>

  <div
    id="music-gallery"
    style="width: 100%; text-align: center; margin-top: 2rem;"
  >
    <h2 style="color: white;">Audio Gallery</h2>
    <!-- <Gallery folder={topic.name} type="music" /> -->
  </div>
</div>
