<script lang="ts">
  import CategoryFetcher from './CategoryFetcher.svelte';

  let isAdmin = true;
  let isCreator = false;

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
</script>

<CategoryFetcher
  {isAdmin}
  {isCreator}
  bind:selectedSectionId
  {sections}
  {categories}
  {loadingSections}
  {loadingCategories}
  {errorSections}
  {errorCategories}
>
  {#snippet sectionsData({ sections, loadingSections, errorSections })}
    {#if loadingSections}
      <p>Loading sections...</p>
    {:else if errorSections}
      <p class="validation">{errorSections}</p>
    {:else}
      <select bind:value={selectedSectionId}>
        <option value="">Select a section</option>
        {#each sections as { id, name }}
          <option value={id}>{name}</option>
        {/each}
      </select>
    {/if}
  {/snippet}

  {#snippet categoriesData({ categories, loadingCategories, errorCategories })}
    {#if loadingCategories}
      <p>Loading categories...</p>
    {:else if errorCategories}
      <p class="validation">{errorCategories}</p>
    {:else}
      {#each categories as { name }}
        <button class="category void-btn small-tile">
          <p>{name}</p>
        </button>
      {/each}
    {/if}
  {/snippet}
</CategoryFetcher>
