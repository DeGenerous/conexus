<script lang="ts">
  import blogPosts from '@constants/blog';
  import { blogURL } from '@constants/media';
</script>

<section class="blog-pages">
  {#each blogPosts as { url, title, description }}
    <a class="nohover-link" href="/learn/blog/{url}">
      <img class="shad-behind" src="{blogURL}/{url}.jpeg" alt={title} />
      <article>
        <h5>{title}</h5>
        <p>{description}</p>
      </article>
    </a>
  {/each}
</section>
