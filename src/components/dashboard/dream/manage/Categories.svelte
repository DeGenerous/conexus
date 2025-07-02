<script lang="ts">
  import { AdminApp } from '@lib/admin';

  let admin = new AdminApp();

  let categories = $state<CategoryView[]>([]);
  let newCategoryName = $state<string>('');

  $effect(() => {
    admin.fetchCategories().then((res) => (categories = res));
  });

  const createNewCategory = async () => {
    await admin.newCategory(newCategoryName).then(async () => {
      categories = await admin.fetchCategories();
      newCategoryName = '';
    });
  };
</script>

<section class="dream-container fade-in">
  <h4>Categories</h4>
  <div class="container">
    {#if categories.length > 0}
      {#each categories as { name }}
        <button class="category void-btn small-tile">
          <p>{name}</p>
        </button>
      {/each}
    {:else}
      <p class="validation">No categories found</p>
    {/if}
  </div>
</section>

<div class="new-category container">
  <input bind:value={newCategoryName} placeholder="Enter Name" />
  <button class="green-btn" onclick={createNewCategory}>
    Add New Category
  </button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-container {
    .container {
      flex-wrap: wrap;
      justify-content: center;

      .category {
        @include gray(0.25);

        &:hover,
        &:active {
          @include cyan(1, text);
          @include light-blue(0.5);
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
