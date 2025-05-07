<script lang="ts">
  import { ClearCache, CATEGORY_CACHE_KEY } from '@constants/cache';
  import { AdminApp } from '@lib/admin';
  import { onMount } from 'svelte';

  let admin = new AdminApp();

  let categories: CategoryView[] = [];
  let newCategoryName: string = '';

  onMount(async () => {
    categories = await admin.fetchCategories();
  });

  const createNewCategory = async () => {
    await admin.newCategory(newCategoryName).then(async () => {
      // delete categories from localstorage
      ClearCache(CATEGORY_CACHE_KEY);
      // fetch categories again
      categories = await admin.fetchCategories();
      newCategoryName = '';
    });
  };
</script>

<div class="dream-box blur categories-list">
  <div class="buttons-wrapper">
    <h2>Categories</h2>
    <div class="container buttons-wrapper categories-wrapper">
      {#if categories.length > 0}
        {#each categories as { name }}
          <div class="category">
            <h3>{name}</h3>
          </div>
        {/each}
      {:else}
        <h3>No categories found.</h3>
      {/if}
    </div>
  </div>
</div>

<div class="container blur buttons-wrapper new-category">
  <input
    class="story-input"
    bind:value={newCategoryName}
    placeholder="Enter Name"
  />
  <button on:click={createNewCategory}>Add New Category</button>
</div>

<style>
  .new-category {
    width: 50vw;
    padding: 2vw;
    gap: 2vw;
    border-radius: 1.5vw;
  }

  .new-category input {
    width: 30vw;
  }

  .new-category button {
    width: 20vw;
  }

  .categories-list {
    align-items: center;
    width: auto;
    max-width: 95vw;
  }

  .categories-wrapper {
    flex-flow: row wrap;
    justify-content: center !important;
  }

  .category {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    background-color: rgba(56, 117, 250, 0.5);
    border-radius: 1vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  .category h3 {
    color: #dedede;
  }

  @media only screen and (max-width: 600px) {
    .categories-list {
      width: 100vw;
      max-width: none;
    }

    .categories-list .container {
      flex-flow: row wrap;
    }

    .category {
      gap: 1em;
      padding: 0.5em;
      border-radius: 0.5em;
    }
  }

  @media only screen and (max-width: 600px) {
    .new-category {
      width: 100vw;
      padding: 1.5em 1em;
      gap: 1em;
      border-radius: 0;
    }

    .new-category input {
      width: 95vw;
      text-align: center;
    }

    .new-category button {
      width: 50vw;
    }
  }
</style>
