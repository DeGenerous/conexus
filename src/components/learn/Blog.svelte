<script lang="ts">
  import blogPosts from '@constants/blog';
</script>

<section class="flex">
  {#each blogPosts as { image, title, description }}
    <div class="preview flex-row">
      <img src={image} alt={title} />
      <article class="flex">
        <h5>{title}</h5>
        <p>{description}</p>
      </article>
    </div>
  {/each}
</section>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    color: $soft-white;

    .preview {
    }
  }
</style>
