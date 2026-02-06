<script lang="ts">
  import { storyData, tablePrompt } from '@stores/dream.svelte';
</script>

<div class="additional-content">
  <div class="input-container gap-8">
    <h4>Image Generation Instructions</h4>
    <textarea
      id="image-prompts"
      class:red-border={$storyData.image_prompt.length > 5000}
      placeholder="e.g. &quot;Dark, moody cyberpunk. Neon-lit rain, gritty textures, heavy shadows.&quot;"
      rows="2"
      bind:value={$storyData.image_prompt}
    ></textarea>
    <p class="transparent-white-txt caption-font">
      Describe the visual mood, lighting, and style for AI-generated story
      images.
    </p>
    {#if $storyData.image_prompt && $storyData.image_prompt.length > 5000}
      <p class="validation">
        Please shorten your message to 5000 characters or less, you've typed {$storyData
          .image_prompt.length}
      </p>
    {/if}
  </div>

  <div class="input-container gap-8">
    <h4>Additional Notes</h4>
    <textarea
      id="additional-notes"
      placeholder="e.g. &quot;Include a plot twist involving time travel. Reference the visual style of Blade Runner.&quot;"
      rows="2"
      bind:value={$tablePrompt.additional_data}
    ></textarea>
    <p class="transparent-white-txt caption-font">
      Any extra instructions, references, or details you want the AI to
      consider.
    </p>
  </div>
</div>

<style lang="scss">
  .additional-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    h4 {
      width: auto;
    }
  }
</style>
