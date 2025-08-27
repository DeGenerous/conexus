<script lang="ts">
  import { onMount } from 'svelte';

  import CategoryView from '@lib/category';
  import { ensureCreator, userState } from '@utils/route-guard';

  import CategoryFetcher from '@components/dashboard/new/common/CategoryFetcher.svelte';

  let categoryView = new CategoryView();

  let isAdmin = $state(false);
  let isCreator = $state(false);

  let selectedSectionId = $state('');

  let fetchCategories = $state<() => Promise<void>>();

  let newCategoryName = $state<string>('');
  let newCategoryDescription = $state<string>('');
  let newCategorySortOrder = $state<number>(0);

  let addingCategory = $state(false);

  let errorAdd = $state('');

  async function addCategory() {
    if (!newCategoryName.trim()) return;

    addingCategory = true;
    errorAdd = '';

    try {
      if (isAdmin) {
        if (!selectedSectionId) {
          errorAdd = 'Please select a section first.';
          return;
        }
        await categoryView.createAdminCategory(selectedSectionId, {
          name: newCategoryName,
          description: '',
          dashboard_sort_order: 0,
        });
      } else {
        await categoryView.createCreatorCategory({
          name: newCategoryName,
          description: '',
          dashboard_sort_order: 0,
        });
      }

      newCategoryName = '';

      if (fetchCategories) await fetchCategories(); // refresh list
    } catch {
      errorAdd = 'Failed to add category';
    } finally {
      addingCategory = false;
    }
  }

  onMount(async () => {
    ensureCreator();

    isAdmin = await userState('admin');
    isCreator = await userState('creator');
  });
</script>

<section class="dream-container fade-in">
  <CategoryFetcher bind:selectedSectionId bind:fetchCategories>
    {#snippet Data(
      loadingSections: boolean,
      errorSections: string,
      sections: Section[],
      loadingCategories: boolean,
      errorCategories: string,
      categories: Category[],
    )}
      {#if isAdmin}
        {#if loadingSections}
          <p>Loading sections...</p>
        {:else if errorSections}
          <p class="validation">{errorSections}</p>
        {:else}
          <h4>Sections: {sections.length}</h4>
          <div class="container">
            {#if sections.length > 0}
              <select bind:value={selectedSectionId}>
                <option value="">Select a section</option>
                {#each sections as { id, name }}
                  <option value={id}>{name}</option>
                {/each}
              </select>
            {:else}
              <p class="validation">No sections found</p>
            {/if}
          </div>
        {/if}
      {/if}

      {#if loadingCategories}
        <p>Loading categories...</p>
      {:else if errorCategories}
        <p class="validation">{errorCategories}</p>
      {:else}
        <h4>Categories: {categories.length}</h4>
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
      {/if}
    {/snippet}
  </CategoryFetcher>
</section>

<div class="container">
  <div class="category-inputs">
    <div>
      <label for="new-category-name">New Category Name:</label>
      <input
        id="new-category-name"
        bind:value={newCategoryName}
        placeholder="Enter New Category Name"
      />
    </div>
    <div>
      <label for="new-category-description">New Category Description:</label>
      <input
        id="new-category-description"
        bind:value={newCategoryDescription}
        placeholder="Enter New Category Description"
      />
    </div>
    <div>
      <label for="new-category-sort-order">New Category Sort Order:</label>
      <input
        id="new-category-sort-order"
        type="number"
        bind:value={newCategorySortOrder}
        placeholder="Enter New Category Sort Order"
      />
    </div>
  </div>
  <button
    class="green-btn"
    onclick={addCategory}
    disabled={!newCategoryName || addingCategory}
  >
    {#if addingCategory}
      Adding...
    {:else}
      Add Category
    {/if}
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

  .category-inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    label {
      font-weight: bold;
    }

    input {
      width: 100%;
    }

    @include respond-up(tablet) {
      flex-direction: row;
    }
  }
</style>
