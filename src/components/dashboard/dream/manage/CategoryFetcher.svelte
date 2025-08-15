<script lang="ts">
  import { onMount } from 'svelte';

  import CategoryView from '@lib/category';
  import AppView from '@lib/view';

  let {
    isAdmin,
    isCreator,
    selectedSectionId = $bindable(),
    content,
  }: {
    isAdmin: boolean;
    isCreator: boolean;
    selectedSectionId: string;
    content: (props: {
      sections: Section[];
      categories: Category[];
      loadingSections: boolean;
      loadingCategories: boolean;
      errorSections: string;
      errorCategories: string;
      fetchSections: () => Promise<void>;
      fetchCategories: () => Promise<void>;
    }) => any;
  } = $props();

  let categoryView = new CategoryView();
  let appView = new AppView();

  let sections = $state<Section[]>([]);
  let categories = $state<Category[]>([]);

  let loadingSections = $state(false);
  let loadingCategories = $state(false);
  let errorSections = $state('');
  let errorCategories = $state('');

  // Fetch sections for admins
  async function fetchSections() {
    if (!isAdmin) return;
    loadingSections = true;
    errorSections = '';
    try {
      sections = await appView.getSections();
    } catch {
      errorSections = 'Failed to load sections';
    } finally {
      loadingSections = false;
    }
  }

  // Fetch categories for admins or creators
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

  // Initial load
  onMount(() => {
    if (isAdmin) fetchSections();
    else if (isCreator) fetchCategories();
  });

  // When admin changes section, fetch categories
  $effect(() => {
    if (isAdmin && selectedSectionId) fetchCategories();
  });
</script>

<!-- <slot
  {sections}
  {categories}
  {loadingSections}
  {loadingCategories}
  {errorSections}
  {errorCategories}
  {selectedSectionId}
  {fetchSections}
  {fetchCategories}
/> -->

{@render content({
  sections,
  categories,
  loadingSections,
  loadingCategories,
  errorSections,
  errorCategories,
  fetchSections,
  fetchCategories,
})}
