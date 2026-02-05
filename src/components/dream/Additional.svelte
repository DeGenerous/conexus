<script lang="ts">
  import { storyData, tablePrompt } from '@stores/dream.svelte';
</script>

<section class="dream-container fade-in">
  <section class="flex">
    <h5>Image Generation Instructions</h5>
    <textarea
      id="image-prompts"
      class:red-border={$storyData.image_prompt.length > 5000}
      placeholder="What does your world feel like, what visual mood are you going for, and what elements stand out? Describe the environment, style, lighting, and textures you want to see."
      rows="2"
      bind:value={$storyData.image_prompt}
    ></textarea>
    {#if $storyData.image_prompt && $storyData.image_prompt.length > 5000}
      <p class="validation">
        Please shorten your message to 5000 characters or less, you’ve typed {$storyData
          .image_prompt.length}
      </p>
    {/if}
  </section>

  <section class="flex">
    <h5>
      If you have anything else you wish to add to improve the story, you may
      write it here
    </h5>
    <textarea
      placeholder="Add any additional styling, references, details, twists, character ideas, or world-building elements you’d like to include in your story."
      rows="2"
      bind:value={$tablePrompt.additional_data}
    ></textarea>
  </section>
</section>

<style>
  section.flex {
    width: 100%;
  }
</style>
