<script lang="ts">
  import { checkUserState } from '@utils/route-guard';
  import { AdminApp } from '@lib/admin';

  import CloseSVG from '@components/icons/Close.svelte';

  let admin = new AdminApp();

  let categoryID: number = $state(1);

  $effect(() => {
    checkUserState('/dashboard/dream', true);
  });

  // JSON UPLOAD

  let importedFile: Nullable<File> = $state(null);
  let dragover: boolean = $state(false);

  const ondragleave = () => dragover = false;
  const ondragover = () => dragover = true;

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length > 1) return;
    dragover = false;
    importedFile = input.files[0];
  };

  const handleImportStory = async () => {
    const importedStory = (await parseJsonFile()) as CreatePrompt;
    importedStory.category = categoryID;

    function parseJsonFile() {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) =>
          resolve(JSON.parse(event.target!.result as any));
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(importedFile!);
      });
    }

    await admin.createNewStory(importedStory);
    importedFile = null;
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container">
  <h5>Dream It. Create It. Bring It to Life.</h5>
  <a class="button-anchor" href="/dashboard/dream/create">Create</a>
  <h5>Start a new story from an infinite well of possibilities.</h5>

  <hr />

  <h5>Add the finishing touches to your masterpiece.</h5>
  <a class="button-anchor" href="/dashboard/dream/manage">Manage</a>
  <h5>Upload media, refine, and perfect your vision.</h5>

  <hr />

  <h5>Import Story Object</h5>

  {#if importedFile}
    <div class="flex-row pad-8 round-8 gap-8 transparent-gray-bg shad">
      <h5>{importedFile.name}</h5>
      <CloseSVG onclick={() => (importedFile = null)} voidBtn={true} />
    </div>
  {:else}
    <div
      class="dropzone"
      class:dragover
      {ondragover}
      {ondragleave}
      role="button"
      tabindex="-1"
    >
      <label for="json-upload">📁 Drop files here or click to upload</label>
      <input
        id="json-upload"
        type="file"
        max="1"
        accept="application/json"
        onchange={(e) => handleFileUpload(e)}
      />
    </div>
  {/if}

  {#await admin.fetchCategories() then categories: CategoryView[]}
    <div class="input-container">
      <label for="category">Select Category</label>
      {#if categories}
        <select id="category" bind:value={categoryID}>
          {#each categories as { id, name }}
            <option value={id}>{name}</option>
          {/each}
        </select>
      {/if}
    </div>
  {/await}

  <button disabled={!importedFile} onclick={handleImportStory}>
    Import story
  </button>
</section>
