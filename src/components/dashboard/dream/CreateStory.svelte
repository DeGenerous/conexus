<script lang="ts">
  import { onMount } from 'svelte';
  import countries from '@constants/countries.json';
  import dreamData from '@constants/dream';
  import { AdminApp } from '@lib/admin';
  import {
    storyData,
    promptSettings,
    openPrompt,
    tablePrompt,
    clearAllData,
  } from '@stores/dream';
  import generatePrompt from '@utils/prompt';

  import Slider from './create/Slider.svelte';
  import Characters from './create/Characters.svelte';
  import Scenario from './create/Scenario.svelte';
  import WritingStyle from './create/WritingStyle.svelte';
  import { checkUserState } from '@utils/route-guard';

  let admin = new AdminApp();

  let promptFormat: 'Table' | 'Open' = 'Table';

  onMount(async () => {
    await checkUserState('/dashboard/dream/create', true);
  });

  let newImagePrompt: string = '';
  const addImagePrompt = () => {
    if (newImagePrompt === '') return;
    $storyData.imagePrompts = [...$storyData.imagePrompts, newImagePrompt];
    newImagePrompt = '';
  };
  const removeImagePrompt = (index: number) => {
    $storyData.imagePrompts = $storyData.imagePrompts.filter((prompt, nr) => {
      return nr !== index;
    });
  };

  function handleEnterKey(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.repeat) return;
    const activeInput = document.activeElement as HTMLElement;
    switch (activeInput.id) {
      case 'image-prompts': {
        event.preventDefault();
        addImagePrompt();
        break;
      }
    }
  }

  const generateStory = async () => {
    const promptData: TablePrompt | string =
      promptFormat === 'Table' ? $tablePrompt : $openPrompt;
    await admin.createNewStory(
      generatePrompt($storyData, $promptSettings, promptData),
    );
    window.location.reload();
  };

  $: validation =
    $storyData.name &&
    $storyData.description &&
    $storyData.description.length > 100 &&
    $storyData.imagePrompts.length > 0 &&
    $storyData.category;
</script>

<svelte:window on:keypress={handleEnterKey} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container-wrapper dream-wrapper">
  <div class="buttons-wrapper">
    <label for="section">Select Category:</label>
    <select
      class="selector"
      class:red-border={!$storyData.category}
      bind:value={$storyData.category}
    >
      <option value={null} selected={true} disabled hidden>Select</option>
      {#await admin.fetchCategories() then categories}
        {#each categories as { name, id }}
          <option value={id}>{name}</option>
        {/each}
      {/await}
    </select>
  </div>

  <!-- TITLE, DESCRIPTION, IMAGE PROMPTS -->
  <div class="dream-box blur general-parameters">
    <div class="input-container">
      <label for="topic">Story</label>
      <input
        id="topic"
        class="story-input dream-textfield"
        class:red-border={!$storyData.name}
        type="text"
        placeholder="Enter Story Name"
        bind:value={$storyData.name}
      />
    </div>

    <div class="input-container">
      <label for="description">Description</label>
      <textarea
        id="description"
        class="story-input dream-textfield"
        class:red-border={$storyData.description.length < 100}
        placeholder="Describe the overall story, its key themes, and what kind of journey the main character will take. Is it an epic adventure, a gripping mystery, or a heartwarming romance? Keep it engaging and set the stage for the reader!"
        rows="3"
        bind:value={$storyData.description}
      ></textarea>
      {#if $storyData.description && $storyData.description.length < 100}
        <p class="validation">
          Description should be longer! Enter {100 -
            $storyData.description.length} more characters
        </p>
      {/if}
    </div>

    <hr />

    <h3>Image Generation Instructions</h3>
    {#if $storyData.imagePrompts.length > 0}
      <ul class="container-wrapper image-prompts">
        {#each $storyData.imagePrompts as prompt, index}
          <li class="buttons-wrapper added-prompt">
            <h3>{prompt}</h3>
            <button
              class="red-button"
              on:click={() => removeImagePrompt(index)}
            >
              Remove
            </button>
          </li>
        {/each}
      </ul>
    {/if}
    <textarea
      id="image-prompts"
      class="story-input dream-textfield"
      class:red-border={$storyData.imagePrompts.length < 1}
      placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
      rows="2"
      bind:value={newImagePrompt}
    ></textarea>
    {#if $storyData.imagePrompts.length < 1}
      <p class="validation">Add at least one image prompt</p>
    {/if}
    <button on:click={addImagePrompt} disabled={newImagePrompt === ''}
      >Add Image Prompt</button
    >
  </div>

  <!-- MAIN SETTINGS -->
  <div class="dream-box blur main-settings">
    <div class="buttons-wrapper">
      <h2>Content</h2>
      <div class="container">
        <div class="input-container">
          <label for="style">Style</label>
          <select class="selector" bind:value={$promptSettings.imageStyle}>
            {#each dreamData.imageStyle as option}
              <option value={option}>{dreamData.capitalize(option)}</option>
            {/each}
          </select>
        </div>

        <div class="input-container">
          <label for="language">Language</label>
          <select
            id="language"
            class="selector"
            bind:value={$promptSettings.language}
          >
            {#each countries as { name }}
              <option value={name}>{name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Interactivity</h2>
      <div class="container">
        <div class="input-container">
          <label for="language">Frequency</label>
          <select
            id="language"
            class="selector"
            bind:value={$promptSettings.interactivity}
          >
            {#each dreamData.min_max as option}
              <option value={option}>{dreamData.capitalize(option)}</option>
            {/each}
          </select>
        </div>

        <div class="input-container">
          <label for="font">Difficulty</label>
          <select
            id="font"
            class="selector"
            bind:value={$promptSettings.difficulty}
          >
            {#each dreamData.min_max as option}
              <option value={option}>{dreamData.capitalize(option)}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Length</h2>
      <div class="container">
        <Slider
          bind:sliderValue={$promptSettings.length}
          parameters={dreamData.min_max}
          inputValue={2}
        />
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Format</h2>
      <div class="container dream-radio-buttons">
        <span
          class:active={promptFormat === 'Table'}
          on:click={() => (promptFormat = 'Table')}
          role="button"
          tabindex="0"
        >
          Table
        </span>
        <span
          class:active={promptFormat === 'Open'}
          on:click={() => (promptFormat = 'Open')}
          role="button"
          tabindex="0"
        >
          Open
        </span>
      </div>
    </div>
  </div>

  {#if promptFormat === 'Table'}
    <div class="dream-box blur">
      <div class="buttons-wrapper">
        <h2>Set Premise</h2>
        <textarea
          id="premise"
          class="story-input dream-textfield"
          placeholder="Summarize the core of your story—who the main character is, what challenge they face, and what’s at stake in their journey."
          rows="2"
          bind:value={$tablePrompt.premise}
        ></textarea>
      </div>

      <div class="buttons-wrapper">
        <h2>Set Environment</h2>
        <textarea
          id="setting"
          class="story-input dream-textfield"
          placeholder="Describe the time and place where your story unfolds, whether it's a futuristic city, a medieval kingdom, a distant galaxy, or somewhere beyond imagination."
          rows="2"
          bind:value={$tablePrompt.environment}
        ></textarea>
      </div>

      <div class="buttons-wrapper">
        <h2>Set Exposition</h2>
        <textarea
          id="exposition"
          class="story-input dream-textfield"
          placeholder="Set the stage for your story—introduce the world, key events leading up to the present, and any important background details the reader needs to know."
          rows="2"
          bind:value={$tablePrompt.exposition}
        ></textarea>
      </div>

      <div class="buttons-wrapper">
        <h2>Set First Action</h2>
        <textarea
          id="first-act"
          class="story-input dream-textfield"
          placeholder="Describe how the story begins—introduce the main character, their current situation, and the inciting event that sets the plot in motion."
          rows="2"
          bind:value={$tablePrompt.firstAction}
        ></textarea>
      </div>
    </div>

    <Characters />

    <Scenario />

    <WritingStyle />

    <div class="dream-box blur open-prompt">
      <h2>
        If you have anything else you wish to add to improve the story, you may
        write it here:
      </h2>
      <textarea
        class="story-input dream-textfield additional-filed"
        placeholder="Add any additional styling, references, details, twists, character ideas, or world-building elements you’d like to include in your story."
        rows="2"
        bind:value={$tablePrompt.additionalData}
      ></textarea>
    </div>
  {:else}
    <div class="dream-box blur open-prompt">
      <h2>Write up a scenario of Your Story:</h2>
      <textarea
        id="blank"
        class="story-input dream-textfield"
        placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
        rows="5"
        bind:value={$openPrompt}
      ></textarea>
    </div>
  {/if}

  {#if !validation}
    <p class="validation">Fill all required fields!</p>
  {/if}

  <div class="buttons-wrapper">
    <button class="red-button blur" on:click={clearAllData}> RESET </button>
    <button
      class="green-button blur"
      on:click={generateStory}
      disabled={!validation}
    >
      CREATE A DREAM
    </button>
  </div>
</section>

<style>
  #topic {
    text-align: center;
    width: 40vw;
  }

  .image-prompts {
    gap: 1vw;
  }

  .main-settings {
    width: auto;
  }

  .general-parameters {
    width: 95vw;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
  }

  .general-parameters h3,
  .general-parameters label {
    color: #dedede;
    line-height: 2.5vw;
  }

  .general-parameters textarea {
    width: 85vw;
  }

  .open-prompt {
    align-items: center;
    padding: 0.5vw;
  }

  .open-prompt h2 {
    line-height: 4vw;
  }

  #blank,
  .additional-filed {
    width: 90vw;
  }

  @media only screen and (max-width: 600px) {
    .selector {
      width: 85vw;
      padding-block: 0.5em;
    }

    #topic {
      width: 90vw;
    }

    #description {
      min-height: 12em;
    }

    .image-prompts {
      gap: 1em;
      padding-block: 1em;
    }

    .general-parameters {
      width: 100%;
      padding: 1em 0;
    }

    .general-parameters h3,
    .general-parameters label {
      line-height: 1.5em;
    }

    .general-parameters textarea {
      width: 90vw;
    }

    .main-settings {
      width: 100%;
    }

    .open-prompt {
      padding: 1em;
    }

    .open-prompt h2 {
      line-height: 1.5em;
    }

    #blank {
      min-height: 50vh;
    }
  }
</style>
