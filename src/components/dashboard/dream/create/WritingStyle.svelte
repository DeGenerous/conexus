<script>
  import dreamData from '@constants/dream';
  import { tablePrompt } from '@stores/dream.svelte';

  import Dropdown from './Dropdown.svelte';
  import Slider from './Slider.svelte';
</script>

<Dropdown name="Build Writing Style">
  <section class="dream-container">
    <div class="flex-row">
      <h4>Tense</h4>
      <div class="container">
        {#each dreamData.tense as tense}
          <button
            class="void-btn dream-radio-btn"
            class:active={tense === $tablePrompt.tense}
            onclick={() => ($tablePrompt.tense = tense)}
          >
            {tense}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex-row">
      <h4>Story Arcs</h4>
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

    <div class="flex-row">
      <h4>Style</h4>
      <div class="container dream-radio-buttons">
        {#each dreamData.writingStyle as style}
          <button
            class="void-btn dream-radio-btn"
            class:active={style === $tablePrompt.writingStyle}
            onclick={() => ($tablePrompt.writingStyle = style)}
          >
            {style}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex-row">
      <h4>Voice</h4>
      <div class="container dream-radio-buttons">
        {#each dreamData.voice as voice}
          <button
            class="void-btn dream-radio-btn"
            class:active={voice === $tablePrompt.voice}
            onclick={() => ($tablePrompt.voice = voice)}
          >
            {voice}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex-row">
      <h4>Pacing</h4>
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

    <div class="flex-row">
      <h4>Point of View</h4>
      <textarea
        id="point-of-view"
        placeholder="Specify the perspective of the story—first-person, second-person, or third-person—and whose eyes we experience the journey through. E.g. First-person, from the detective’s skeptical assistant, uncovering their mentor’s hidden dark secret."
        rows="3"
        bind:value={$tablePrompt.POV}
      ></textarea>
    </div>
  </section>

  <hr />

  <h3>Story Tone</h3>

  {#each $tablePrompt.tone as { name, value }}
    <span class="tone flex">
      <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
      <div class="container">
        <Slider bind:sliderValue={value} inputValue={3} />
      </div>
    </span>
  {/each}
</Dropdown>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    width: 100%;
  }

  .tone {
    width: 100%;

    @include respond-up(tablet) {
      flex-direction: row;

      h4 {
        width: 12rem;
        text-align: right;
      }
    }
  }
</style>
