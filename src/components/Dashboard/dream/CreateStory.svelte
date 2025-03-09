<script lang="ts">
  import countries from '../../../data/countries.json';
  import dreamData from '../../../data/dream';
  import { promptSettings, openPrompt, tablePrompt } from '@stores/dream';

  import Slider from './create/Slider.svelte';
  import Characters from './create/Characters.svelte';
  import Scenario from './create/Scenario.svelte';
  import WritingStyle from './create/WritingStyle.svelte';

  let promptFormat: 'Table' | 'Open' = 'Table';

  let newImagePrompt: string = '';
  const addImagePrompt = () => {
    if (newImagePrompt === '') return;
    $promptSettings.imagePrompts = [
      ...$promptSettings.imagePrompts,
      newImagePrompt,
    ];
    newImagePrompt = '';
  };
  const removeImagePrompt = (index: number) => {
    $promptSettings.imagePrompts = $promptSettings.imagePrompts.filter(
      (prompt, nr) => {
        return nr !== index;
      },
    );
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

  const showPrompt = () => {
    console.log($promptSettings);
    console.log('Table:');
    console.log($tablePrompt);
    console.log('Open:');
    console.log($openPrompt);
  };
</script>

<svelte:window on:keypress={handleEnterKey} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container-wrapper dream-wrapper">
  <h2 class="page-title">
    Be the author of your own destiny and the architect of your dreams
  </h2>

  <!-- TITLE, DESCRIPTION, IMAGE PROMPTS -->
  <div class="dream-box blur general-parameters">
    <div class="input-container">
      <label for="topic">Story</label>
      <input
        id="topic"
        class="story-input dream-textfield"
        type="text"
        placeholder="Enter Story Name"
        bind:value={$promptSettings.name}
      />
    </div>

    <div class="input-container">
      <label for="description">Description</label>
      <textarea
        id="description"
        class="story-input dream-textfield"
        placeholder="Describe the overall story, its key themes, and what kind of journey the main character will take. Is it an epic adventure, a gripping mystery, or a heartwarming romance? Keep it engaging and set the stage for the reader!"
        rows="3"
        bind:value={$promptSettings.description}
      ></textarea>
    </div>

    <hr />

    <h3>Image Generation Instructions</h3>
    {#if $promptSettings.imagePrompts.length > 0}
      <ul class="container-wrapper image-prompts">
        {#each $promptSettings.imagePrompts as prompt, index}
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
      placeholder="E.g. A breathtaking cosmic landscape filled with swirling galaxies, ancient ruins, and a lone traveler standing at the edge of destiny."
      rows="2"
      bind:value={newImagePrompt}
    ></textarea>
    <button on:click={addImagePrompt}>Add Image Prompt</button>
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

  <div class="buttons-wrapper">
    <button class="red-button blur">CLEAR</button>
    <button class="blur">SAVE DRAFT</button>
    <button class="green-button blur" on:click={showPrompt}
      >CREATE A DREAM</button
    >
  </div>
</section>

<style>
  .page-title {
    text-shadow: 0 0.25vw 0.25vw #010020;
  }

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

  #blank {
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
