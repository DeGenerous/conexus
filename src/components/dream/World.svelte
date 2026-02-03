<script lang="ts">
  import { tablePrompt } from '@stores/dream.svelte';
  import Dropdown from '@components/utils/Dropdown.svelte';
</script>

<Dropdown name="Describe World" table={true}>
  <section class="flex">
    <div class="flex-row">
      <h4>Environment</h4>
      <textarea
        id="setting"
        placeholder="Describe the time and place where your story unfolds, whether it's a futuristic city, a medieval kingdom, a distant galaxy, or somewhere beyond imagination."
        rows="2"
        bind:value={$tablePrompt.environment}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>Exposition</h4>
      <textarea
        id="exposition"
        placeholder="Set the stage for your story—introduce the world, key events leading up to the present, and any important background details the reader needs to know."
        rows="2"
        bind:value={$tablePrompt.exposition}
      ></textarea>
    </div>

    <div class="flex-row">
      <h4>First Action</h4>
      <textarea
        id="first-act"
        placeholder="Describe how the story begins—introduce the main character, their current situation, and the inciting event that sets the plot in motion."
        rows="2"
        bind:value={$tablePrompt.first_action}
      ></textarea>
    </div>
  </section>
</Dropdown>
