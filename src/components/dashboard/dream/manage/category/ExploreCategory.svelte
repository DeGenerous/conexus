<script lang="ts">
  import CategoryFetcher from '@components/dashboard/dream/manage/category/CategoryFetcher.svelte';
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
      return;
    }

    await handleCategoryChange(selectedCategoryId, 'add');

    selectedCategoryId = '';
  }

  async function handleRemoveCategory(category_id: string) {
    topic_categories = topic_categories.filter(
      (category) => category.id !== category_id,
    );

    await handleCategoryChange(category_id, 'remove');
  }
</script>

<div class="flex-row">
  <h4>Genres</h4>
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

<div>
  <CategoryFetcher bind:selectedSectionId>
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
            <select bind:value={selectedCategoryId}>
              {#each categories.filter((c) => !topic_categories.some((tc: Category) => tc.id === c.id)) as { id, name }}
                <option value={id}>{name}</option>
              {/each}
            </select>
          {:else}
            <p class="validation">No categories found</p>
          {/if}
        </div>
      {/if}
    {/snippet}
  </CategoryFetcher>
</div>
