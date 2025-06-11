<!-- LEGACY SVELTE 3/4 SYNTAX -->
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
  } from '@stores/dream.svelte';
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
    $storyData.category;
</script>

<!-- CATEGORY, TITLE, DESCRIPTION, IMAGE PROMPT -->
<div class="dream-container">
  <div class="input-container">
    <label for="category">Select Category</label>
    <select
      id="category"
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

  <hr />

  <div class="input-container">
    <label for="topic">Story</label>
    <input
      id="topic"
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
      class:red-border={$storyData.description.length < 100}
      placeholder="Describe the central premise, key themes, the main character's emotional journey ahead, and what kicks off the plot. Focus on what’s at stake, what makes the world unique, and why this story matters - make users want to see more."
      rows="3"
      bind:value={$storyData.description}
    ></textarea>
  </div>

  {#if $storyData.description && $storyData.description.length < 100}
    <p class="validation">
      Description should be longer! Enter {100 - $storyData.description.length} more
      characters
    </p>
  {/if}

  <hr />

  <div class="input-container">
    <label for="image-prompts">Image Generation Instructions</label>
    <textarea
      id="image-prompts"
      placeholder="What does your world feel like, what visual mood are you going for, and what elements stand out? Describe the environment, style, lighting, and textures you want to see."
      rows="2"
      bind:value={$storyData.imagePrompt}
    ></textarea>
  </div>
</div>

<!-- MAIN SETTINGS -->
<div class="dream-container">
  <div class="flex-row">
    <h4>Content</h4>
    <div class="container">
      <div class="input-container">
        <label for="style">Visual Style</label>
        <select id="style" bind:value={$promptSettings.imageStyle}>
          {#each dreamData.imageStyle as option}
            <option value={option}>{dreamData.capitalize(option)}</option>
          {/each}
        </select>
      </div>

      <div class="input-container">
        <label for="language">Language</label>
        <select id="language" bind:value={$promptSettings.language}>
          {#each countries as { name }}
            <option value={name}>{name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Interactivity</h4>
    <div class="container">
      <div class="input-container">
        <label for="frequency">Control</label>
        <select id="frequency" bind:value={$promptSettings.interactivity}>
          {#each dreamData.min_max as option}
            <option value={option}>{dreamData.capitalize(option)}</option>
          {/each}
        </select>
      </div>

      <div class="input-container">
        <label for="difficulty">Difficulty</label>
        <select id="difficulty" bind:value={$promptSettings.difficulty}>
          {#each dreamData.min_max as option}
            <option value={option}>{dreamData.capitalize(option)}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="flex-row">
    <h4>Length</h4>
    <div class="container">
      <Slider
        bind:sliderValue={$promptSettings.length}
        parameters={dreamData.min_max}
        inputValue={2}
      />
    </div>
  </div>

  <div class="flex-row">
    <h4>Format</h4>
    <div class="container">
      <button
        class="void-btn dream-radio-btn"
        class:active={promptFormat === 'Table'}
        on:click={() => (promptFormat = 'Table')}
      >
        Table
      </button>
      <button
        class="void-btn dream-radio-btn"
        class:active={promptFormat === 'Open'}
        on:click={() => (promptFormat = 'Open')}
      >
        Open
      </button>
    </div>
  </div>
</div>

{#if promptFormat === 'Table'}
  <div class="dream-container">
    <div class="flex-row">
      <h4>Set Premise</h4>
      <textarea
        id="premise"
        placeholder="Summarize the core of your story—who the main character is, what challenge they face, and what’s at stake in their journey."
        rows="2"
        bind:value={$tablePrompt.premise}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set Environment</h4>
      <textarea
        id="setting"
        placeholder="Describe the time and place where your story unfolds, whether it's a futuristic city, a medieval kingdom, a distant galaxy, or somewhere beyond imagination."
        rows="2"
        bind:value={$tablePrompt.environment}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set Exposition</h4>
      <textarea
        id="exposition"
        placeholder="Set the stage for your story—introduce the world, key events leading up to the present, and any important background details the reader needs to know."
        rows="2"
        bind:value={$tablePrompt.exposition}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Set First Action</h4>
      <textarea
        id="first-act"
        placeholder="Describe how the story begins—introduce the main character, their current situation, and the inciting event that sets the plot in motion."
        rows="2"
        bind:value={$tablePrompt.firstAction}
      ></textarea>
    </div>
  </div>

  <Characters />

  <Scenario />

  <WritingStyle />

  <div class="dream-container">
    <h4>
      If you have anything else you wish to add to improve the story, you may
      write it here
    </h4>
    <textarea
      placeholder="Add any additional styling, references, details, twists, character ideas, or world-building elements you’d like to include in your story."
      rows="2"
      bind:value={$tablePrompt.additionalData}
    ></textarea>
  </div>
{:else}
  <div class="dream-container">
    <h4>Write up a scenario of Your Story</h4>
    <textarea
      id="blank"
      placeholder="Describe any scenario you want, and the AI will turn it into a story! Whether it's a thrilling mystery, an epic fantasy, or a hilarious adventure, your imagination sets the stage. You can be as detailed or vague as you like—every idea sparks a unique tale. E.g. Make a unique Sherlock Holmes story where during an investigation he ends up taking a new type of drug, deeply affecting him so he’ll lead a fight both versus himself and a serial killer."
      rows="5"
      bind:value={$openPrompt}
    ></textarea>
  </div>
{/if}

{#if !validation}
  <p class="validation">Fill all required fields</p>
{/if}

<div class="flex-row flex-wrap">
  <button class="red-btn blur" on:click={clearAllData}> Reset </button>
  <!-- <button class="rose-btn blur" on:click={() => {}}> Save a draft </button> -->
  <button
    class="green-btn blur"
    on:click={generateStory}
    disabled={!validation}
  >
    Create a DREAM
  </button>
</div>
