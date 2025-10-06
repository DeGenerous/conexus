<script lang="ts">
  import { onMount } from 'svelte';
  import { type Snippet } from 'svelte';

  import CategoryView from '@lib/category';
  import AppView from '@lib/view';
  import { userState } from '@utils/route-guard';

  let {
    selectedSectionId = $bindable(),
    fetchCategories = $bindable(),
    children,
  }: {
    selectedSectionId: string;
    fetchCategories?: () => Promise<void>;
    children: Snippet<
      [
        loadingSections: boolean,
        errorSections: string,
        sections: Section[],
        loadingCategories: boolean,
        errorCategories: string,
        categories: Category[],
      ]
    >;
  } = $props();

  let isAdmin = $state<boolean>(false);
  let isCreator = $state<boolean>(false);

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
  async function fetchCategoriesBase() {
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

  fetchCategories = async () => {
    if (isAdmin && selectedSectionId) {
      await fetchCategoriesBase();
    } else if (isCreator) {
      await fetchCategoriesBase();
    }
  };

  // Initial load
  onMount(async () => {
    isAdmin = await userState('admin');
    isCreator = await userState('creator');

    if (isAdmin) await fetchSections();
    else if (isCreator) await fetchCategoriesBase();
  });

  // When admin changes section, fetch categories
  $effect(() => {
    if (isAdmin && selectedSectionId) fetchCategoriesBase();
  });
</script>

{@render children(
  loadingSections,
  errorSections,
  sections,
  loadingCategories,
  errorCategories,
  categories,
)}
