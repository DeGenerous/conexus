<script lang="ts">
  import { AdminApp } from '@lib/admin';

  let admin = new AdminApp();

  let newCategoryName: string = '';
</script>

<div class="container blur buttons-wrapper new-category">
  <input
    class="story-input"
    bind:value={newCategoryName}
    placeholder="Enter Name"
  />
  <button on:click={() => admin.newCategory(newCategoryName)}
    >Add New Category</button
  >
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
</style>
