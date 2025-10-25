<script lang="ts">
  import { onMount } from 'svelte';

  import CategoryView from '@lib/category';
  import { checkUserRoles } from '@utils/route-guard';
  import { isAdmin } from '@stores/account.svelte';
  import { toastStore } from '@stores/toast.svelte';

  import CategoryFetcher from '@components/dashboard/common/CategoryFetcher.svelte';

  let categoryView = new CategoryView();

  let selectedSectionId = $state('');

  let fetchCategories = $state<() => Promise<void>>();

  let newCategoryName = $state<string>('');
  let newCategoryDescription = $state<string>('');
  let newCategorySortOrder = $state<number>(0);

  $effect(() => {
    if (newCategorySortOrder < 0) newCategorySortOrder = 0;
  });

  let addingCategory = $state(false);

  onMount(checkUserRoles);

  async function addCategory() {
    if (!newCategoryName.trim()) return;

    addingCategory = true;

    try {
      if ($isAdmin) {
        if (!selectedSectionId) {
          toastStore.show('Please select a section first.', 'error');
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
      toastStore.show('Failed to add category', 'error');
    } finally {
      addingCategory = false;
    }
  }

  const onkeypress = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.repeat) return;
    if (!newCategoryName) return;
    const activeInput = document.activeElement as HTMLElement;
    if (activeInput && activeInput.tagName === 'INPUT') {
      addCategory();
      activeInput.blur();
    }
  };
</script>

<svelte:window {onkeypress} />

<section class="dream-container">
  <CategoryFetcher bind:selectedSectionId bind:fetchCategories>
    {#snippet children(
      loadingSections: boolean,
      errorSections: string,
      sections: Section[],
      loadingCategories: boolean,
      errorCategories: string,
      categories: Category[],
    )}
      {#if $isAdmin}
        <h4>
          {#if loadingSections}
            Loading sections...
          {:else if errorSections}
            {errorSections}
          {:else}
            Sections: {sections.length}
          {/if}
        </h4>
        <div class="container">
          {#if sections.length > 0}
            <select bind:value={selectedSectionId}>
              <option value="" disabled hidden>Select a section</option>
              {#each sections as { id, name }}
                <option value={id}>{name}</option>
              {/each}
            </select>
          {:else}
            <p class="validation">No sections found</p>
          {/if}
        </div>
      {/if}

      <h4>
        {#if loadingCategories}
          Loading categories...
        {:else if errorCategories}
          {errorCategories}
        {:else}
          Categories: {categories.length}
        {/if}
      </h4>
      <div class="container">
        {#if categories.length > 0}
          {#each categories as { name }}
            <button class="void-btn small-tile">
              <p>{name}</p>
            </button>
          {/each}
        {:else}
          <p class="validation">No categories found</p>
        {/if}
      </div>
    {/snippet}
  </CategoryFetcher>
</section>

<div class="container">
  <span class="input-container">
    <label for="new-category-name">Name</label>
    <input
      id="new-category-name"
      bind:value={newCategoryName}
      placeholder="Enter New Category Name"
    />
  </span>
  <!-- <span class="input-container">
    <label for="new-category-description">Description</label>
    <input
      id="new-category-description"
      bind:value={newCategoryDescription}
      placeholder="Enter New Category Description"
    />
  </span> -->
  <span class="input-container">
    <label for="new-category-sort-order">Sort Order</label>
    <input
      id="new-category-sort-order"
      type="number"
      bind:value={newCategorySortOrder}
      placeholder="Enter New Category Sort Order"
    />
  </span>

  <button onclick={addCategory} disabled={!newCategoryName || addingCategory}>
    {#if addingCategory}
      Adding...
    {:else}
      Add New Category
    {/if}
  </button>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .container {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
