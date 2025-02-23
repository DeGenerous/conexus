<script>
  import { onMount } from 'svelte';
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

<div class="container">
  <h1>Prompt</h1>
  <label for="topic">Topic</label>
  <input type="text" bind:value={topicName} />

  <label for="description">Description</label>
  <textarea bind:value={topicDescription}></textarea>

  {#if imageResponse}
    <label for="imagePrompts">Image Prompt</label>
    <textarea bind:value={imageResponse} rows="5"></textarea>
  {:else}
    <label for="imagePrompts">Image Prompts</label>
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
    <input type="text" bind:value={newImagePrompt} />
    <button class="primary-button" on:click={addImagePrompt}
      >Add Image Prompt</button
    >
  {/if}

  <label for="response">Prompt</label>
  <textarea bind:value={response} rows="5"></textarea>

  <label for="category">Select Category</label>
  <select bind:value={categoryId}>
    {#each categories as cat}
      <option value={cat.id}>{cat.name}</option>
    {/each}
  </select>

  <button class="primary-button" on:click={savePrompt}>Save Prompt</button>
  <button class="secondary-button" on:click={() => dispatch('close')}
    >Close</button
  >
</div>

<style>
  .container {
    background: transparent;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 70%;
    max-height: 90vh;
    overflow-y: auto;
  }
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    padding: 8px 16px;
    margin-right: 8px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  .primary-button {
    background: blue;
    color: white;
  }
  .secondary-button {
    background: gray;
    color: white;
  }
</style>
