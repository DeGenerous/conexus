<script>
  import { createEventDispatcher } from 'svelte';

  let topicName = '';
  let topicDescription = '';
  let imagePrompts = [];
  let newImagePrompt = '';
  let categoryId = 1;
  let response = '';
  let imageResponse = '';
  let categories = [
    {
      id: 1,
      name: 'Community Picks',
    },
    {
      id: 2,
      name: 'Collabs Picks',
    },
    {
      id: 3,
      name: 'Dischordian Saga',
    },
  ];

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
  <h3>Prompt</h3>
  <div class="buttons-wrapper">
    <input class="user-input" placeholder="https://example.com" />
    <button>Parse Link</button>
  </div>
  <hr />
  <div class="buttons-wrapper">
    <h3>Click to upload PDF file:</h3>
    <button>Upload PDF</button>
  </div>
</div>

<div class="input-container">
  <label for="topic">Topic</label>
  <input
    id="topic"
    class="story-input"
    type="text"
    placeholder="Enter Story Name"
    bind:value={topicName}
  />
</div>

<div class="input-container">
  <label for="description">Description</label>
  <textarea
    id="description"
    class="story-input"
    placeholder="E.g. Across the endless expanse of the universe, where ancient legends whisper and future civilizations rise, every story is a journey—of struggle and triumph, heroes and villains, discovery and transformation. From the depths of the ocean to the stars above, fate weaves an intricate tapestry of adventure, mystery, and the boundless pursuit of meaning."
    rows="4"
    bind:value={topicDescription}
  ></textarea>
</div>

{#if imageResponse}
  <div class="input-container">
    <label for="image-prompts">Image Prompt</label>
    <textarea
      id="image-prompts"
      class="story-input"
      placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
      rows="3"
      bind:value={imageResponse}
    ></textarea>
  </div>
{:else}
  <div class="container">
    <h3>Image Prompt</h3>
    <ul class="container-wrapper image-prompts">
      {#each imagePrompts as prompt, index}
        <li class="buttons-wrapper">
          <h3>{prompt}</h3>
          <button class="red-button" on:click={() => removeImagePrompt(index)}
            >Remove</button
          >
        </li>
        <hr />
      {/each}
    </ul>
    <input
      id="image-prompts"
      class="story-input"
      type="text"
      placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
      bind:value={newImagePrompt}
    />
    <button class="primary-button" on:click={addImagePrompt}
      >Add Image Prompt</button
    >
  </div>
{/if}

<div class="input-container">
  <label for="response">Prompt</label>
  <textarea
    id="response"
    class="story-input"
    placeholder="E.g. Create a story about an endless universe filled with mystery, adventure, and destiny. Across the vast expanse of space, from ancient ruins hidden in distant galaxies to the forgotten echoes of civilizations long past, heroes and villains rise and fall in the eternal struggle for meaning and power. This journey could span from the deep oceans of an alien world to the neon-lit streets of a futuristic metropolis, where choices shape fate and every path leads to a new discovery. Will your protagonist uncover lost secrets, defy impossible odds, or carve their own destiny in the cosmos? The story is yours to tell."
    rows="7"
    bind:value={response}
  ></textarea>
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
  <button class="red-button" on:click={() => dispatch('close')}> Close </button>
  <button class="green-button" on:click={savePrompt}> Save Prompt </button>
</div>

<style>
  label:not(.selector-label) {
    color: rgba(51, 226, 230, 0.9);
  }

  #topic {
    width: 50vw;
    text-align: center;
  }

  #image-prompts {
    width: 85vw;
  }

  textarea {
    width: 90vw;
    min-height: 20vh;
    max-height: 100vh;
  }

  .image-prompts {
    gap: 1vw;
  }

  .image-prompts h3 {
    color: rgba(51, 226, 230, 0.9);
    line-height: 2.5vw;
  }

  @media only screen and (max-width: 600px) {
    .container {
      width: 100vw;
      border-radius: 0;
    }

    .story-input {
      width: 90vw !important;
    }

    .image-prompts {
      gap: 1em;
    }

    .image-prompts h3 {
      line-height: 1.5em;
    }

    .image-prompts li {
      flex-direction: column;
      gap: 1em;
    }
  }
</style>
