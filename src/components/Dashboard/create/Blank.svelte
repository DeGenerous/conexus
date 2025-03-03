<script>
  import { createEventDispatcher } from 'svelte';

  let topicName = '';
  let topicDescription = '';
  let imagePrompts = [];
  let newImagePrompt = '';
  let categoryId = 1;
  let response = '';
  let imageResponse = '';
  let categories = [];

  const dispatch = createEventDispatcher();

  function addImagePrompt() {
    if (newImagePrompt) {
      imagePrompts = [...imagePrompts, newImagePrompt];
      newImagePrompt = '';
    }
  }

  function removeImagePrompt(index) {
    imagePrompts = imagePrompts.filter((_, i) => i !== index);
  }

  async function savePrompt() {
    const imagePrompt = imageResponse || imagePrompts.join(', ');

    try {
      const response = await fetch('/api/createPrompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: response,
          category: categoryId,
          topic: topicName.trim(),
          description: topicDescription.trim(),
          image_prompt: imagePrompt,
        }),
      });

      if (response.ok) {
        dispatch('saved');
      } else {
        alert('Error saving prompt');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  }
</script>

<h2>Prompt</h2>

<div class="input-container">
  <label for="topic">Topic</label>
  <input id="topic" class="story-input" type="text" bind:value={topicName} />
</div>

<div class="input-container">
  <label for="description">Description</label>
  <textarea id="description" class="story-input" bind:value={topicDescription}></textarea>
</div>

<div class="input-container container">
  <label for="image-prompts">Image Prompt</label>
  {#if imageResponse}
    <textarea id="image-prompts" class="user-input" bind:value={imageResponse} rows="5"></textarea>
  {:else}
    <ul>
      {#each imagePrompts as prompt, index}
        <li>
          <span>{prompt}</span>
          <button
            class="secondary-button"
            on:click={() => removeImagePrompt(index)}>Remove</button
          >
        </li>
      {/each}
    </ul>
    <input id="image-prompts" class="user-input" type="text" bind:value={newImagePrompt} />
    <button class="primary-button" on:click={addImagePrompt}
      >Add Image Prompt</button
    >
  {/if}
</div>

<div class="input-container">
  <label for="response">Prompt</label>
  <textarea id="response" class="story-input" bind:value={response} rows="5"></textarea>
</div>

<div class="input-container">
  <label for="category" class="selector-label">
    Select Category
    <select class="selector" bind:value={categoryId}>
      <option value="" selected={true} disabled hidden>Select</option>
      {#each categories as cat}
        <option value={cat.id}>{cat.name}</option>
      {/each}
    </select>
  </label>
</div>

<div class="buttons-wrapper">
  <button
    class="red-button"
    on:click={() => dispatch('close')}
  >
    Close
  </button>
  <button
    class="green-button"
    on:click={savePrompt}
  >
    Save Prompt
  </button>
</div>

<style>
  #topic {
    width: 50vw;
  }

  #image-prompts {
    width: 85vw;
  }

  textarea {
    min-width: 50vw;
    min-height: 10vw;
    max-width: 90vw;
    max-height: 50vh;
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100vw;
      border-radius: 0;
    }

    .story-input {
      width: 90vw !important;
    }
  }
</style>
