<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { AdminApp } from '@lib/admin';

  let admin = new AdminApp();

  let categories: CategoryView[] = [];
  let newCategoryName: string = '';

  onMount(async () => {
    categories = await admin.fetchCategories();
  });

  const createNewCategory = async () => {
    await admin.newCategory(newCategoryName).then(async () => {
      categories = await admin.fetchCategories();
      newCategoryName = '';
    });
  };
</script>

<section class="dream-container">
  <h4>Categories</h4>
  <div class="container">
    {#if categories.length > 0}
      {#each categories as { name }}
        <button class="void-btn transition pad-8 pad-inline round-8 shad">
          <h5>{name}</h5>
        </button>
      {/each}
    {:else}
      <p class="validation">No categories found</p>
    {/if}
  </div>
</section>

<div class="new-category container">
  <input
    bind:value={newCategoryName}
    placeholder="Enter Name"
  />
  <button class="green-btn" on:click={createNewCategory}>
    Add New Category
  </button>
</div>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  .dream-container {
    .container {
      flex-wrap: wrap;
      justify-content: center;

      button {
        @include gray(0.25);
        @include white-txt(soft);

        &:hover,
        &:active {
          @include cyan(1, text);
          @include light-blue(0.5);
          @include scale-up(soft);
          @include box-shadow(deep);
        }

        h5 {
          color: inherit;
          text-shadow: none;
        }
      }
    }
  }

  .new-category {
    input {
      width: 100%;
    }

    @include respond-up(tablet) {
      flex-direction: row;
    }
  }
</style>
