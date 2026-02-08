<script lang="ts">
  import { tablePrompt } from '@stores/dream.svelte';
</script>

<div class="input-container">
  <label for="setting">Environment</label>
  <textarea
    id="setting"
    placeholder="e.g. &quot;A crumbling space station orbiting a dying star, year 3047&quot;"
    rows="2"
    bind:value={$tablePrompt.environment}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    When and where the story takes place. Include time period, location, and
    atmosphere.
  </p>
</div>

<div class="input-container">
  <label for="exposition">Exposition</label>
  <textarea
    id="exposition"
    placeholder="e.g. &quot;The colony lost contact with Earth 200 years ago and has been slowly declining since&quot;"
    rows="2"
    bind:value={$tablePrompt.exposition}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    What happened before the story begins? Key history the player needs to
    understand.
  </p>
</div>

<div class="input-container">
  <label for="first-act">First Action</label>
  <textarea
    id="first-act"
    placeholder="e.g. &quot;A distress signal wakes the captain from cryo-sleep. The crew who sent it is gone.&quot;"
    rows="2"
    bind:value={$tablePrompt.first_action}
  ></textarea>
  <p class="transparent-white-txt caption-font">
    The moment that kicks the story into motion. What happens first?
  </p>
</div>
