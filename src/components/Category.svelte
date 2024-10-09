<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { categories } from '../stores/conexus';

  export let categoryName: string | undefined;

  let category: Category | undefined;

  const unsubscribe = categories.subscribe((value) => {
    category = value.find((cat) => cat.name === categoryName);
  });

  onMount(() => {
    console.log('Category mounted');
  });

  onDestroy(() => {
    console.log('Category destroyed');
  });
</script>

<div class="category">
  {#if category}
    <h2 class="category-title">{category.name}</h2>
  {/if}
</div>

<style>
  .category {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1vw 2.5vw;
    padding: 2vw;
    background-color: rgba(1, 0, 32, 0.75);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.25));
  }

  .category-title {
    text-align: center;
    font-size: 2vw;
    line-height: 2.5vw;
    color: rgba(255, 255, 255, 0.75);
  }
</style>
