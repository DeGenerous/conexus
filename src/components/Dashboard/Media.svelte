<script lang="ts">
  import { onMount } from 'svelte';

  import { serveUrl } from '@constants/media';
  import MediaManager from '@lib/media';

  let mediaManager = new MediaManager();

  export let topic_name = 'Escape'; // Default topic_name
  let topic_id = '1'; // Default topic_id

  let isLoading = true;

  let backgrounds: string[] = [];
  let description: string | null = null;
  let tile: string | null = null;
  let audio: string | null = null;

  // Fetch stored media on load
  const loadMedia = async () => {
    try {
      const bgData = await mediaManager.fetchTopicMedia(topic_id, 'background');
      const descData = await mediaManager.fetchTopicMedia(
        topic_id,
        'description',
      );
      const tileData = await mediaManager.fetchTopicMedia(topic_id, 'tile');
      const audioData = await mediaManager.fetchTopicMedia(topic_id, 'audio');

      backgrounds = [...bgData.map((fileId) => ` ${serveUrl}${fileId}`)]; // ✅ Prefix each background
      description = descData.length ? ` ${serveUrl}${descData[0]}` : null; // ✅ Prefix description
      tile = tileData.length ? ` ${serveUrl}${tileData[0]}` : null; // ✅ Prefix tile
      audio = audioData.length ? ` ${serveUrl}${audioData[0]}` : null; // ✅ Prefix audio
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
      let fileUrls: string[] = [];

      if (type === 'background') {
        if (files.length + backgrounds.length > 3) {
          alert('You can only upload up to 3 background images.');
          return;
        }
        for (const file of files) {
          const response = await mediaManager.uploadFileBackground(
            file,
            topic_name,
          );
          if (response.file_id) {
            fileUrls.push(` ${serveUrl}${response.file_id}`);
          }
        }
        backgrounds = [...backgrounds, ...fileUrls].slice(0, 3); // Keep max 3
      } else {
        if (files.length > 1) {
          alert('Only one file is allowed for this type.');
          return;
        }

        if (type === 'description') {
          const response = await mediaManager.uploadFileDescription(
            files[0],
            topic_name,
          );
          const fileUrl = ` ${serveUrl}${response.file_id}`;
          description = fileUrl;
        } else if (type === 'tile') {
          const response = await mediaManager.uploadFileTile(
            files[0],
            topic_name,
          );
          const fileUrl = ` ${serveUrl}${response.file_id}`;
          tile = fileUrl;
        } else if (type === 'audio') {
          const response = await mediaManager.uploadFileAudio(
            files[0],
            topic_name,
          );
          const fileUrl = ` ${serveUrl}${response.file_id}`;
          audio = fileUrl;
        }

        // Reset input value
        input.value = '';
      }
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  console.log('Media component loaded', backgrounds, description, tile);

  onMount(async () => {
    await loadMedia();
  });
</script>

<div class="container">
  {#if isLoading}
    <p>Loading media...</p>
  {:else}
    <h1>Story Builder</h1>

    <div class="media-sections">
      <!-- Background Upload -->
      <div class="media-group">
        <h2>Backgrounds</h2>
        {#if backgrounds.length >= 3}
          <p>Max 3 backgrounds uploaded.</p>
        {:else}
          <label for="backgrounds-upload">Upload Backgrounds (Max 3):</label>
          <input
            id="backgrounds-upload"
            type="file"
            multiple
            on:change={(e) => handleFileUpload(e, 'background')}
          />
        {/if}

        <div class="media-grid">
          {#each backgrounds as bg}
            <img src={bg} alt="Background" class="preview" />
          {/each}
        </div>
      </div>

      <!-- Description Upload -->
      <div class="media-group">
        <h2>Description</h2>
        <label for="description-upload">Upload Description:</label>
        <input
          id="description-upload"
          type="file"
          on:change={(e) => handleFileUpload(e, 'description')}
        />
        {#if description}
          <img src={description} alt="Description" class="preview" />
        {/if}
      </div>

      <!-- Tile Upload -->
      <div class="media-group">
        <h2>Tile</h2>
        <label for="tile-upload">Upload Tile:</label>
        <input
          id="tile-upload"
          type="file"
          on:change={(e) => handleFileUpload(e, 'tile')}
        />
        {#if tile}
          <img src={tile} alt="Tile" class="preview" />
        {/if}
      </div>

      <!-- Audio Upload -->
      <div class="media-group">
        <h2>Audio</h2>
        <label for="audio-upload">Upload Audio:</label>
        <input
          id="audio-upload"
          type="file"
          on:change={(e) => handleFileUpload(e, 'audio')}
        />
        {#if audio}
          <audio controls>
            <source src={audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    padding: 1.5rem;
    max-width: 600px;
    width: 100%;
    margin: auto;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .media-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .media-group {
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  }

  h2 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }

  label {
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type='file'] {
    display: block;
    margin-bottom: 0.8rem;
  }

  .media-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }

  .preview {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
</style>
