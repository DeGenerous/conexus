<script lang="ts">
  import blogPosts from '@constants/blog';
</script>

<section class="blog-pages">
  {#each blogPosts as { url, title, description }}
    <a href="/learn/blog/{url}">
      <img class="shad-behind" src="/learn/blog/{url}.avif" alt={title} />
      <article>
        <h5>{title}</h5>
        <p>{description}</p>
      </article>
    </a>
  {/each}
</section>
