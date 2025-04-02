<script>
  import dreamData from '@constants/dream';
  import { tablePrompt } from '@stores/dream';

  import Dropdown from './Dropdown.svelte';
  import Slider from './Slider.svelte';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<Dropdown name="Build Writing Style">
  <div class="dream-box style-options">
    <div class="buttons-wrapper">
      <h2>Tense</h2>
      <div class="container dream-radio-buttons">
        {#each dreamData.tense as tense}
          <span
            class:active={tense === $tablePrompt.tense}
            role="button"
            tabindex="0"
            on:click={() => ($tablePrompt.tense = tense)}
          >
            {dreamData.capitalize(tense)}
          </span>
        {/each}
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Story Arcs</h2>
      <div class="container">
        <Slider
          bind:sliderValue={$tablePrompt.storyArcs}
          parameters={dreamData.min_max}
          inputValue={2}
          hints={[
            'A simple narrative with a clear beginning, middle, and end.',
            'A balanced journey with character growth and key turning points.',
            'A deep story with twists, challenges, and evolving developments.',
          ]}
        />
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Style</h2>
      <div class="container dream-radio-buttons">
        {#each dreamData.writingStyle as style}
          <span
            class:active={style === $tablePrompt.writingStyle}
            role="button"
            tabindex="0"
            on:click={() => ($tablePrompt.writingStyle = style)}
          >
            {dreamData.capitalize(style)}
          </span>
        {/each}
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Voice</h2>
      <div class="container dream-radio-buttons">
        {#each dreamData.voice as voice}
          <span
            class:active={voice === $tablePrompt.voice}
            role="button"
            tabindex="0"
            on:click={() => ($tablePrompt.voice = voice)}
          >
            {dreamData.capitalize(voice)}
          </span>
        {/each}
      </div>
    </div>

    <div class="buttons-wrapper">
      <h2>Pacing</h2>
      <div class="container">
        <Slider
          bind:sliderValue={$tablePrompt.pacing}
          parameters={dreamData.min_max}
          inputValue={2}
          hints={[
            'Slower pacing focuses on deep character moments, world-building, and gradual story progression.',
            'A balanced mix of action, character development, and key events unfolding naturally.',
            'Fast-paced storytelling with rapid events, high stakes, and minimal downtime.',
          ]}
        />
      </div>
    </div>
  </div>

  <hr />

  <div class="input-container">
    <label class="section-title" for="point-of-view">Point of View</label>
    <textarea
      id="point-of-view"
      class="story-input"
      placeholder="Specify the perspective of the story—first-person, second-person, or third-person—and whose eyes we experience the journey through. E.g. First-person, from the detective’s skeptical assistant, uncovering their mentor’s hidden dark secret."
      rows="3"
      bind:value={$tablePrompt.POV}
    ></textarea>
  </div>

  <hr />

  <h3>Story Tone</h3>

  <div class="dream-box tone-characteristics">
    {#each $tablePrompt.tone as { name, value }}
      <div class="buttons-wrapper">
        <h2>{dreamData.capitalize(name)}</h2>
        <div class="container">
          <Slider bind:sliderValue={value} />
        </div>
      </div>
    {/each}
  </div>
</Dropdown>

<style>
  textarea {
    width: 80vw;
  }

  label,
  h3 {
    color: #dedede;
  }

  .tone-characteristics {
    width: auto;
  }

  .style-options {
    width: 84vw;
  }

  .style-options .container {
    width: 70vw;
  }

  @media only screen and (max-width: 600px) {
    textarea {
      width: 90vw;
    }

    .tone-characteristics,
    .style-options {
      width: 100vw;
    }

    .style-options .container {
      width: 95vw;
    }
  }
</style>
