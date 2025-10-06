<script lang="ts">
  import dreamData from '@constants/dream';
  import { tablePrompt } from '@stores/dream.svelte';

  import Dropdown from '@components/utils/Dropdown.svelte';
  import Slider from '@components/utils/Slider.svelte';

  const tenseHints = {
    past: 'Tells the story as if it already happened, allowing reflection and depth. Great for epic tales and classic adventures.',
    present:
      'Unfolds events in real time, creating urgency and immediacy. Ideal for thrillers or immersive experiences.',
    future:
      'Projects events that will happen, often suited for sci-fi, speculation, or visionary storytelling.',
  };

  const styleHints = {
    descriptive:
      'Rich in sensory detail and atmosphere. Perfect for building vivid worlds and emotional depth.',
    narrative:
      'Focused on plot and characters. Moves the story forward through scenes, actions, and dialogue.',
    expository:
      'Explains ideas, settings, or events directly. Useful for informative or philosophical stories.',
  };

  const voiceHints = {
    active:
      'The subject performs the action. Direct, engaging, and dynamic (“She solved the mystery”).',
    passive:
      'The subject receives the action. Subtle, reflective, or mysterious (“The mystery was solved by her”).',
  };
</script>

<Dropdown name="Build Writing Style">
  <section class="dream-container">
    <div class="flex-row">
      <h4>Tense</h4>
      <div class="container">
        <span class="flex-row">
          {#each dreamData.tense as tense}
            <button
              class="void-btn dream-radio-btn"
              class:active={tense === $tablePrompt.tense}
              onclick={() => ($tablePrompt.tense = tense)}
            >
              {tense}
            </button>
          {/each}
        </span>
        <p>{tenseHints[$tablePrompt.tense]}</p>
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
      <div class="container">
        <span class="flex-row">
          {#each dreamData.writingStyle as style}
            <button
              class="void-btn dream-radio-btn"
              class:active={style === $tablePrompt.writingStyle}
              onclick={() => ($tablePrompt.writingStyle = style)}
            >
              {style}
            </button>
          {/each}
        </span>
        <p>{styleHints[$tablePrompt.writingStyle]}</p>
      </div>
    </div>

    <div class="flex-row">
      <h4>Voice</h4>
      <div class="container">
        <span class="flex-row">
          {#each dreamData.voice as voice}
            <button
              class="void-btn dream-radio-btn"
              class:active={voice === $tablePrompt.voice}
              onclick={() => ($tablePrompt.voice = voice)}
            >
              {voice}
            </button>
          {/each}
        </span>
        <p>{voiceHints[$tablePrompt.voice]}</p>
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

  {#each $tablePrompt.tone as { name, value, hints }}
    <span class="tone flex">
      <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
      <div class="container">
        <Slider bind:sliderValue={value} inputValue={3} {hints} />
      </div>
    </span>
  {/each}
</Dropdown>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    width: 100%;

    .container {
      flex-direction: column;

      span {
        width: 100%;
        flex-wrap: wrap;
        justify-content: space-around;
      }

      p {
        @include white-txt(0.5);
        @include font(caption);
      }
    }
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
