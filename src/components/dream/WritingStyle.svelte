<script lang="ts">
  import dreamData from '@constants/dream';
  import { tablePrompt } from '@stores/dream.svelte';

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

<div class="writing-style-content">
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
      <p>
        {$tablePrompt.tense
          ? tenseHints[$tablePrompt.tense as keyof typeof tenseHints]
          : ''}
      </p>
    </div>
  </div>

  <div class="flex-row">
    <h4>Story Arcs</h4>
    <div class="container">
      <Slider
        bind:sliderValue={$tablePrompt.story_arcs}
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
            class:active={style === $tablePrompt.writing_style}
            onclick={() => ($tablePrompt.writing_style = style)}
          >
            {style}
          </button>
        {/each}
      </span>
      <p>
        {$tablePrompt.writing_style
          ? styleHints[$tablePrompt.writing_style as keyof typeof styleHints]
          : ''}
      </p>
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
      <p>
        {$tablePrompt.voice
          ? voiceHints[$tablePrompt.voice as keyof typeof voiceHints]
          : ''}
      </p>
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
    <div class="container gap-8">
      <textarea
        id="point-of-view"
        placeholder="e.g. &quot;First-person, through the detective's partner&quot;"
        rows="3"
        bind:value={$tablePrompt.pov}
      ></textarea>
      <p class="transparent-white-txt caption-font">
        Whose eyes does the player see through? First-person (I), second-person
        (you), or third-person (they).
      </p>
    </div>
  </div>

  <hr />

  <h3 class="h4-font">Story Tone</h3>
  <p class="transparent-white-txt caption-font tone-helper">
    Adjust how much of each emotion runs through the narrative.
  </p>

  {#each $tablePrompt.tone as { name, value, hints }}
    <span class="tone flex">
      <h4>{name.charAt(0).toUpperCase() + name.slice(1)}</h4>
      <div class="container">
        <Slider bind:sliderValue={value} inputValue={3} {hints} />
      </div>
    </span>
  {/each}
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .writing-style-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

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

    textarea {
      width: 100%;
    }
  }

  .tone-helper {
    text-align: center;
    margin-bottom: 0.5rem;
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
