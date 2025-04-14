<script lang="ts">
  import { onMount } from 'svelte';

  import { checkUserState } from '@utils/route-guard';
  import { AdminApp } from '@lib/admin';

  let admin = new AdminApp();

  let categoryID: number = 1;
  let importedFile: Nullable<File> = null;

  onMount(async () => {
    await checkUserState('/dashboard/dream', true);
  });

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length > 1) return;

    importedFile = input.files[0];
  }

  const handleImportStory = async () => {
    const importedStory = await parseJsonFile() as CreatePrompt;
    importedStory.category = categoryID;

    function parseJsonFile() {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target!.result as any))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(importedFile!)
      })
    }

    await admin.createNewStory(importedStory);
    importedFile = null;
}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="container-wrapper">
  <div class="container blur">
    <h3>Dream It. Create It. Bring It to Life.</h3>
    <a class="button-anchor" href="/dashboard/dream/create">Create</a>
    <h3>Start a new story from an infinite well of possibilities.</h3>

    <hr />

    <h3>Add the finishing touches to your masterpiece.</h3>
    <a class="button-anchor" href="/dashboard/dream/manage">Manage</a>
    <h3>Upload media, refine, and perfect your vision.</h3>

    <hr />
    
    <h3>Import Story Object</h3>

    {#if importedFile}
      <div class="json-file">
        <h3>{importedFile.name}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          class="close-svg"
          stroke="rgba(255, 60, 64, 0.85)"
          stroke-width="30"
          stroke-linecap="round"
          on:click={() => (importedFile = null)}
          role="button"
          tabindex="0"
        >
          <path d="M -65 -65 L 65 65 M -65 65 L 65 -65" fill="none" />
        </svg>
      </div>
    {:else}
      <label class="json-upload" for="json-upload">Upload JSON</label>
      <input
        id="json-upload"
        type="file"
        max="1"
        accept="application/json"
        on:change={(e) => handleFileUpload(e)}
      />
    {/if}

    {#await admin.fetchCategories() then categories: CategoryView[]}
      <div class="input-container">
        <label for="category">Select Category:</label>
        {#if categories}
          <select
            class="selector"
            bind:value={categoryID}
          >
            {#each categories as { id, name }}
              <option value={id}>{name}</option>
            {/each}
          </select>
        {/if}
      </div>
    {/await}

    <button
      disabled={!importedFile}
      on:click={handleImportStory}
    >
      IMPORT STORY
    </button>
  </div>
</section>

<style>
  a {
    text-transform: uppercase;
  }

  input[type='file'] {
    display: none;
  }

  .json-upload {
    cursor: pointer;
    padding: 1vw;
    font-size: 1.5vw;
    line-height: 1.5vw;
    color: #dedede;
    background-color: rgba(56, 117, 250, 0.5);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
  }

  .json-upload:hover,
  .json-upload:active {
    color: rgba(51, 226, 230, 0.9);
    background-color: rgba(56, 117, 250, 0.9);
    border-color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    text-shadow: 0 0 0.25vw rgba(1, 0, 32, 0.5);
    transform: scale(1.05);
  }

  .json-file {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    background-color: rgba(56, 117, 250, 0.5);
    border-radius: 1vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  .json-file h3 {
    color: #dedede;
  }

  @media only screen and (max-width: 600px) {
    .json-upload {
      font-size: 1em;
      line-height: 1.75em;
      padding: 0.25em 1em;
      border-radius: 0.5em;
    }

    .json-file {
      gap: 1em;
      padding: 0.5em;
      border-radius: 0.5em;
    }
  }
</style>
