<script lang="ts">
  import { onMount } from 'svelte';

  import { serveUrl } from '@constants/media';
  import MediaManager from '@lib/media';

  let mediaManager = new MediaManager();

  export let topic_id: number;

  let isLoading = true;

  let backgrounds: string[] = [];
  let description: string | null = null;
  let tile: string | null = null;
  let audio: string | null = null;

  let tooMuchFiles: boolean = false;

  // Fetch stored media on load
  const loadMedia = async () => {
    try {
      const bgData = await mediaManager.fetchTopicMedia(
        topic_id.toString(),
        'background',
      );
      const descData = await mediaManager.fetchTopicMedia(
        topic_id.toString(),
        'description',
      );
      const tileData = await mediaManager.fetchTopicMedia(
        topic_id.toString(),
        'tile',
      );
      const audioData = await mediaManager.fetchTopicMedia(
        topic_id.toString(),
        'audio',
      );

      backgrounds = [...bgData];
      description = descData.length ? descData[0] : null;
      tile = tileData.length ? tileData[0] : null;
      audio = audioData.length ? audioData[0] : null;
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      isLoading = false;
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: Event, type: MediaType) => {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    try {
      if (type === 'background') {
        // Check for files length
        if (files.length + backgrounds.length > 3) {
          tooMuchFiles = true;
          setTimeout(() => (tooMuchFiles = false), 5000);
          return;
        }
        for (const file of files) {
          const response = await mediaManager.uploadTopicMedia(
            file,
            topic_id,
            'background',
          );
          backgrounds = [...backgrounds, ...response].slice(0, 3); // Keep max 3
        }
      } else {
        if (files.length > 1) {
          alert('Only one file is allowed for this type.');
          return;
        }

        if (type === 'description') {
          const response = await mediaManager.uploadTopicMedia(
            files[0],
            topic_id,
            'description',
          );
          description = response[0];

        } else if (type === 'tile') {
          const response = await mediaManager.uploadTopicMedia(
            files[0],
            topic_id,
            'tile',
          );
          tile = response[0];

        } else if (type === 'audio') {
          const response = await mediaManager.uploadTopicMedia(
            files[0],
            topic_id,
            'audio',
          );
          audio = response[0];
        }

        // Reset input value
        input.value = '';
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleDelete = async (fileId: string, type: MediaType) => {
    try {
      await mediaManager.deleteTopicMedia(topic_id, fileId, type);

      if (type === 'background') {
        backgrounds = backgrounds.filter((bg) => bg !== fileId);
      } else if (type === 'description') {
        description = null;
      } else if (type === 'tile') {
        tile = null;
      } else if (type === 'audio') {
        audio = null;
      }
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  onMount(async () => {
    await loadMedia();
  });
</script>

{#if isLoading}
  <h2>Loading media...</h2>
{:else}
  <div class="container blur media-wrapper">
    <!-- Background Upload -->
    <h2>Backgrounds</h2>
    {#if backgrounds.length >= 3}
      <h3>You've already uploaded 3 backgrounds.</h3>
    {:else}
      <label for="backgrounds-upload">Upload Backgrounds (Max 3)</label>
      <input
        id="backgrounds-upload"
        type="file"
        multiple
        max={3 - backgrounds.length}
        size="1572864"
        accept="image/avif"
        on:change={(e) => handleFileUpload(e, 'background')}
      />
      <h3>Only AVIF format is accepted.</h3>
      {#if tooMuchFiles}
        <p class="validation">You can only upload up to 3 background images!</p>
      {/if}
    {/if}

    <div class="media-grid">
      {#each backgrounds as bg}
        <div class="preview-wrapper">
          <img src={`${serveUrl}${bg}`} alt="Background" class="preview" />
          <button
            class="red-button"
            on:click={() => handleDelete(bg, 'background')}
          >
            Delete
          </button>
        </div>
      {/each}
    </div>

    <hr />

    <!-- Description Upload -->
    <h2>Description</h2>
    {#if description}
      <h3>You've already uploaded a description picture.</h3>
    {:else}
      <label for="description-upload">Upload Description Picture</label>
      <input
        id="description-upload"
        type="file"
        max="1"
        size="1572864"
        accept="image/avif"
        on:change={(e) => handleFileUpload(e, 'description')}
      />
      <h3>Only AVIF format is accepted.</h3>
    {/if}
    {#if description}
      <img
        src={`${serveUrl}${description}`}
        alt="Description"
        class="preview"
      />
      <button
        class="red-button"
        on:click={() => handleDelete(description ?? '', 'description')}
      >
        Delete
      </button>
    {/if}

    <hr />

    <!-- Tile Upload -->
    <h2>Tile</h2>
    {#if tile}
      <h3>You've already uploaded a tile picture.</h3>
    {:else}
      <label for="tile-upload">Upload Tile Picture</label>
      <input
        id="tile-upload"
        type="file"
        max="1"
        size="1572864"
        accept="image/avif"
        on:change={(e) => handleFileUpload(e, 'tile')}
      />
      <h3>Only AVIF format is accepted.</h3>
    {/if}
    {#if tile}
      <img src={` ${serveUrl}${tile}`} alt="Tile" class="preview" />
      <button
        class="red-button"
        on:click={() => handleDelete(tile ?? '', 'tile')}
      >
        Delete
      </button>
    {/if}

    <hr />

    <!-- Audio Upload -->
    <h2>Audio</h2>
    {#if audio}
      <h3>You've already uploaded an audio file.</h3>
    {:else}
      <label for="audio-upload">Upload Audio</label>
      <input
        id="audio-upload"
        type="file"
        max="1"
        size="6291456"
        accept="audio/mp3"
        on:change={(e) => handleFileUpload(e, 'audio')}
      />
      <h3>Only MP3 format is accepted.</h3>
    {/if}
    {#if audio}
      <audio controls>
        <source src={` ${serveUrl}${audio}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button
        class="red-button"
        on:click={() => handleDelete(audio ?? '', 'audio')}
      >
        Delete
      </button>
    {/if}
  </div>
{/if}

<style>
  input[type='file'] {
    display: none;
  }

  label {
    cursor: pointer;
    padding: 1vw;
    font-size: 1.5vw;
    line-height: 1.5vw;
    color: #dedede;
    background-color: rgba(56, 117, 250, 0.5);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1vw;
  }

  label:hover,
  label:active {
    color: rgba(51, 226, 230, 0.9);
    background-color: rgba(56, 117, 250, 0.9);
    border-color: rgba(51, 226, 230, 0.9);
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    text-shadow: 0 0 0.25vw rgba(1, 0, 32, 0.5);
    transform: scale(1.05);
  }

  .media-wrapper {
    width: 95vw;
  }

  .media-grid {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .preview-wrapper {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
  }

  .preview {
    width: 20vw;
    aspect-ratio: 1/1;
    border-radius: 1vw;
    box-shadow: 0 0.25vw 0.5vw #010020;
  }

  @media only screen and (max-width: 600px) {
    .media-wrapper {
      width: 100vw;
    }

    label {
      font-size: 1em;
      line-height: 1.75em;
      padding: 0.25em 1em;
      border-radius: 0.5em;
    }

    .media-grid {
      gap: 1em;
    }

    .preview-wrapper {
      gap: 1em;
    }

    .preview {
      width: 90vw;
      border-radius: 0.5em;
    }
  }
</style>
