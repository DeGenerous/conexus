<script lang="ts">
  import CategoryView from '@lib/category';
  import { isAdmin } from '@stores/account.svelte';
  import { toastStore } from '@stores/toast.svelte';

  import CategoryFetcher from '@components/dashboard/common/CategoryFetcher.svelte';
  import CloseSVG from '@components/icons/Close.svelte';

  let { onUpdate }: { onUpdate?: () => Promise<void> } = $props();

  let categoryView = new CategoryView();

  let selectedSectionId = $state('');
  let fetchCategories = $state<() => Promise<void>>();

  let newCategoryName = $state('');
  let addingCategory = $state(false);
  let deleteError = $state('');

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    const sanitized = newCategoryName.replace(/[<>]/g, '').trim();
    if (!sanitized) {
      toastStore.show('Please enter a valid category name.', 'error');
      return;
    }

    addingCategory = true;
    deleteError = '';

    try {
      if ($isAdmin) {
        if (!selectedSectionId) {
          toastStore.show('Please select a section first.', 'error');
          return;
        }
        await categoryView.createAdminCategory(selectedSectionId, {
          name: sanitized,
          description: '',
          dashboard_sort_order: 0,
        });
      } else {
        await categoryView.createCreatorCategory({
          name: sanitized,
          description: '',
          dashboard_sort_order: 0,
        });
      }

      newCategoryName = '';
      if (fetchCategories) await fetchCategories();
      await onUpdate?.();
    } catch {
      toastStore.show('Failed to add category', 'error');
    } finally {
      addingCategory = false;
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!category.id) {
      toastStore.show('Missing category id', 'error');
      return;
    }

    deleteError = '';

    try {
      const deleted = $isAdmin
        ? await categoryView.deleteAdminCategory(category.id)
        : await categoryView.deleteCreatorCategory(category.id);

      if (deleted) {
        if (fetchCategories) await fetchCategories();
        await onUpdate?.();
      }
    } catch (error) {
      deleteError = `Cannot delete "${category.name}" — it still has topics assigned.`;
    }
  };

  const onkeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.repeat) return;
    if (!newCategoryName) return;
    const active = document.activeElement as HTMLElement;
    if (active?.tagName === 'INPUT') {
      addCategory();
      active.blur();
    }
  };
</script>

<svelte:window {onkeydown} />

<div
  class="modal-content flex"
  onclick={(e) => e.stopPropagation()}
  role="presentation"
>
  <div class="dream-container">
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
          <div class="tile-container">
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
            Story Categories: {categories.length}
          {/if}
        </h4>
        <div class="container">
          {#if categories.length > 0}
            {#each categories as category (category.id)}
              <button class="void-btn small-blue-tile">
                <p>{category.name}</p>
                <CloseSVG
                  onclick={() => deleteCategory(category)}
                  voidBtn={true}
                />
              </button>
            {/each}
          {:else}
            <p class="validation">No story categories found</p>
          {/if}
        </div>

        {#if deleteError}
          <p class="validation">{deleteError}</p>
        {/if}
      {/snippet}
    </CategoryFetcher>
  </div>

  <div class="add-row">
    <span class="input-container">
      <label for="new-category-name">Name</label>
      <input
        id="new-category-name"
        bind:value={newCategoryName}
        placeholder="New Category Name"
      />
    </span>

    <button onclick={addCategory} disabled={!newCategoryName || addingCategory}>
      {#if addingCategory}
        Adding...
      {:else}
        Add Category
      {/if}
    </button>
  </div>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .add-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    width: 100%;
    align-items: flex-end;
    justify-content: center;
  }

  .container {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
