<script lang="ts">
  import CategoryFetcher from '@components/dashboard/common/CategoryFetcher.svelte';
  import { toastStore } from '@stores/toast.svelte';

  import CloseSVG from '@components/icons/Close.svelte';

  let { isAdmin, isCreator, topic_categories, handleCategoryChange } = $props<{
    isAdmin: boolean;
    isCreator: boolean;
    topic_categories: TopicCategory[];
    handleCategoryChange: (
      categoryId: string,
      method: 'add' | 'remove',
    ) => Promise<void>;
  }>();

  let selectedSectionId = $state<string>('');

  let selectedCategoryId = $state<string>('');

  async function handleAddCategory() {
    if (selectedCategoryId === '') return;

    if (topic_categories.some((tc) => tc.id === selectedCategoryId)) {
      // Category already exists
      return toastStore.show('Category already exists', 'error');
    }

    await handleCategoryChange(selectedCategoryId, 'add');

    selectedCategoryId = '';
  }

  async function handleRemoveCategory(category_id: string) {
    if (topic_categories.length <= 1)
      return toastStore.show(
        'Topic should have at least one category',
        'error',
      );

    try {
      await handleCategoryChange(category_id, 'remove');

      topic_categories = topic_categories.filter(
        (category) => category.id !== category_id,
      );
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="flex-row">
  <h4>Categories</h4>
  <div class="container">
    {#if topic_categories.length > 0}
      {#each topic_categories as category (category)}
        <button class="void-btn small-purple-tile">
          <p>{category.name}</p>
          <CloseSVG
            onclick={() => handleRemoveCategory(category.id)}
            voidBtn={true}
            dark={true}
          />
        </button>
      {/each}
    {:else}
      <p class="valigation">No categories selected</p>
    {/if}
  </div>
</div>

<span class="flex-row flex-wrap">
  <CategoryFetcher bind:selectedSectionId>
    {#snippet children(
      loadingSections: boolean,
      errorSections: string,
      sections: Section[],
      loadingCategories: boolean,
      errorCategories: string,
      categories: Category[],
    )}
      {#if isAdmin}
        {#if loadingSections}
          <p class="validation green-txt">Loading sections...</p>
        {:else if errorSections}
          <p class="validation">{errorSections}</p>
        {:else if sections.length > 0}
          <select bind:value={selectedSectionId}>
            <option value="" disabled hidden>Select section</option>
            {#each sections as { id, name }}
              <option value={id}>{name}</option>
            {/each}
          </select>
        {:else}
          <p class="validation">No sections found</p>
        {/if}
      {/if}

      {#if !loadingCategories && errorCategories}
        <p class="validation">{errorCategories}</p>
      {:else}
        {@const availableCategories = categories.filter(
          (c) => !topic_categories.some((tc: Category) => tc.id === c.id),
        )}
        <select
          bind:value={selectedCategoryId}
          disabled={(isAdmin && !selectedSectionId) ||
            !availableCategories.length}
        >
          <option value="" hidden disabled>
            {#if availableCategories.length > 0}
              Select category
            {:else if isAdmin && !selectedSectionId}
              No section selected
            {:else if !loadingCategories}
              No categories found
            {/if}
          </option>
          {#if availableCategories.length > 0}
            {#each availableCategories as { id, name }}
              <option value={id}>{name}</option>
            {/each}
          {/if}
        </select>
      {/if}

      <button onclick={handleAddCategory} disabled={!selectedCategoryId}>
        Add Category
      </button>
    {/snippet}
  </CategoryFetcher>
</span>

<style lang="scss">
  @use '/src/styles/mixins' as *;
</style>
