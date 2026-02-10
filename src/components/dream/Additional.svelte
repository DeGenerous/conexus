<script lang="ts">
  import { storyData, tablePrompt } from '@stores/dream.svelte';
</script>

<div class="additional-content">
  <div class="input-container gap-8">
    <h4>Art Direction</h4>
    <textarea
      id="image-prompts"
      class:red-border={$storyData.image_prompt.length > 5000}
      placeholder="e.g. &quot;Dark, moody cyberpunk. Neon-lit rain, gritty textures, heavy shadows.&quot;"
      rows="2"
      bind:value={$storyData.image_prompt}
    ></textarea>
    <p class="transparent-white-txt caption-font">
      Describe the visual mood, lighting, and style for your story's imagery.
    </p>
    {#if $storyData.image_prompt && $storyData.image_prompt.length > 5000}
      <p class="validation">
        Too long. Max 5000 characters ({$storyData.image_prompt.length} used).
      </p>
    {/if}
  </div>

  <div class="input-container gap-8">
    <h4>Additional Notes</h4>
    <textarea
      id="additional-notes"
      placeholder="e.g. &quot;Focus on dialogue, external conflict, and fast-paced action. Include a plot twist if the protagonist drinks a potion.&quot;"
      rows="2"
      bind:value={$tablePrompt.additional_data}
    ></textarea>
    <p class="transparent-white-txt caption-font">
      Any extra instructions, references, or details for CoNexus to consider.
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
