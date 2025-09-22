<script lang="ts">
  import { onMount } from 'svelte';

  import { userState } from '@utils/route-guard';
  import CategoryView from '@lib/category';
  import AppView from '@lib/view';

  let categoryView = new CategoryView();
  let appView = new AppView();

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

  let selectedSectionId = $state('');
  let newCategoryName = $state<string>('');
  let newCategoryDescription = $state<string>('');
  let newCategorySortOrder = $state<number>(0);

  let sections = $state<Section[]>([]);
  let categories = $state<Category[]>([]);

  let loadingSections = $state(false);
  let loadingCategories = $state(false);
  let addingCategory = $state(false);

  let errorSections = $state('');
  let errorCategories = $state('');
  let errorAdd = $state('');

  onMount(async () => {
    isAdmin = await userState('admin');
    isCreator = await userState('creator');

    if (isAdmin) {
      loadingSections = true;
      try {
        sections = await appView.getSections();
      } catch {
        errorSections = 'Failed to load sections';
      } finally {
        loadingSections = false;
      }
    } else if (isCreator) {
      fetchCategories();
    }
  });

  // Automatically fetch categories when admin changes section
  $effect(() => {
    if (isAdmin && selectedSectionId) {
      fetchCategories();
    }
  });

  async function fetchCategories() {
    loadingCategories = true;
    errorCategories = '';
    try {
      categories = isAdmin
        ? await categoryView.listAdminCategories(selectedSectionId)
        : await categoryView.listCreatorCategories();
    } catch {
      errorCategories = 'Failed to load categories';
    } finally {
      loadingCategories = false;
    }
  }

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
      await fetchCategories(); // refresh list
    } catch {
      errorAdd = 'Failed to add category';
    } finally {
      addingCategory = false;
    }
  }
</script>

<section class="dream-container fade-in">
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
</section>

<div class="new-category container">
  <input bind:value={newCategoryName} placeholder="Enter New Category Name" />
  <input
    bind:value={newCategoryDescription}
    placeholder="Enter New Category Description"
  />
  <input
    type="number"
    bind:value={newCategorySortOrder}
    placeholder="Enter New Category Sort Order"
  />
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

  .new-category {
    input {
      width: 100%;
    }

    @include respond-up(tablet) {
      flex-direction: row;
    }
  }
</style>
