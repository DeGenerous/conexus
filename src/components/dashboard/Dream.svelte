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

  const ondragleave = () => (dragover = false);
  const ondragover = () => (dragover = true);

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length > 1) return;
    dragover = false;
    importedFile = input.files[0];
  };

  function isValidStory(story: any) {
    if (
      !story ||
      typeof story !== 'object' ||
      typeof story.topic !== 'string' ||
      typeof story.description !== 'string' ||
      typeof story.image_prompt !== 'string' ||
      typeof story.category !== 'number' ||
      typeof story.prompt !== 'string'
    ) {
      throw new Error('You imported an invalid Story JSON');
    }
  }

  const handleImportStory = async () => {
    try {
      const importedStory = (await parseJsonFile()) as CreatePrompt;
      importedStory.category = categoryID;

      function parseJsonFile(): Promise<unknown> {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = (event) => {
            try {
              const result = JSON.parse(event.target!.result as string);
              resolve(result);
            } catch (err) {
              reject(new Error('Invalid JSON format'));
            }
          };
          fileReader.onerror = (error) => reject(error);
          fileReader.readAsText(importedFile!);
        });
      }
      isValidStory(importedStory);
      await admin.createNewStory(importedStory);
    } catch (error) {
      alert('You imported an invalid Story JSON');
    }
    importedFile = null;
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container fade-in">
  <p class="text-glowing">Dream It. Create It. Bring It to Life.</p>
  <a class="button-anchor button-glowing" href="/dashboard/dream/create">
    Create
  </a>
  <p class="text-glowing">
    Start a new story from an infinite well of possibilities.
  </p>

  <hr />

  <p class="text-glowing">Add the finishing touches to your masterpiece.</p>
  <a class="button-anchor button-glowing" href="/dashboard/dream/manage">
    Manage
  </a>
  <p class="text-glowing">Upload media, refine, and perfect your vision.</p>
</section>

<div class="container fade-in">
  <p class="transparent-white-txt">Import Story Object (DevTool)</p>

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
        accept="application/JSON"
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
</div>
