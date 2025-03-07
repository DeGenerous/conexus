<script lang="ts">
  import { onMount } from 'svelte';
  import MediaManager from '@lib/media';

  let mediaManager = new MediaManager();
  let file: File | null = null;
  let content: FolderContent | null = null;
  let isLoading = true;

  // Fetch initial folder contents
  const loadFolderContents = async () => {
    try {
      content = await mediaManager.getFolderContents(
        '00000000-0000-0000-0000-000000000000',
      );
    } catch (error) {
      console.error('Failed to load folder contents:', error);
    } finally {
      isLoading = false;
    }
  };

  // Handle file upload event
  const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || !content) return;

    file = input.files[0];

    try {
      await mediaManager.uploadFile(file, content.id);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  onMount(async () => {
    await loadFolderContents();
  });
</script>

<div class="container">
  {#if isLoading}
    <p>Loading folder...</p>
  {:else if content}
    <h1>{content.name}</h1>

    <input
      type="file"
      multiple
      on:change={handleFileUpload}
      disabled={!content}
    />

    <div class="content-grid">
      {#each content.folders as folder}
        <div class="folder">
          📁 {folder.name}
        </div>
      {/each}

      {#each content.files as file}
        <div class="file">
          {#if file.content_type.includes('image')}
            <img src={`/api/media/serve/${file.id}`} alt={file.name} />
          {:else if file.content_type.includes('video')}
            <!-- svelte-ignore a11y_media_has_caption -->
            <video controls>
              <source
                src={`/api/media/serve/${file.id}`}
                type={file.content_type}
              />
            </video>
          {:else if file.content_type.includes('audio')}
            <!-- svelte-ignore a11y_media_has_caption -->
            <audio controls>
              <source
                src={`/api/media/serve/${file.id}`}
                type={file.content_type}
              />
            </audio>
          {:else}
            📄 {file.name}
          {/if}
          <div>
            📄 {file.name}
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p>Failed to load content.</p>
  {/if}
</div>

<style>
  .container {
    padding: 1rem;
    max-width: 600px;
    margin: auto;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  input[type='file']:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .content-grid {
    display: grid;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .folder,
  .file {
    padding: 0.5rem;
    border-radius: 5px;
    background: #f3f3f3;
  }
</style>
