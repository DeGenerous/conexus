<!-- LEGACY SVELTE 3/4 SYNTAX -->
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
  let video: string | null = null;

  let tooMuchFiles: boolean = false;

  let dragover: boolean = false;

  const ondragleave = () => (dragover = false);
  const ondragover = () => (dragover = true);

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
      const videoData = await mediaManager.fetchTopicMedia(
        topic_id.toString(),
        'video',
      );

      backgrounds = [...bgData];
      description = descData.length ? descData[0] : null;
      tile = tileData.length ? tileData[0] : null;
      video = videoData.length ? videoData[0] : null;
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
        } else if (type === 'video') {
          const response = await mediaManager.uploadTopicMedia(
            files[0],
            topic_id,
            'video',
          );
          video = response[0];
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
      } else if (type === 'video') {
        video = null;
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
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  <section class="container">
    <!-- Background Upload -->
    <h4>Backgrounds</h4>
    {#if backgrounds.length >= 3}
      <p class="validation green-txt">You've already uploaded 3 backgrounds</p>
    {:else}
      <div
        class="dropzone"
        class:dragover
        on:dragover={ondragover}
        on:dragleave={ondragleave}
        role="button"
        tabindex="-1"
      >
        <label for="tile-upload">📁 Drop image(s) here or click to upload (only &lt1.5MB AVIF files, max 3)</label>
        <input
          id="tile-upload"
          type="file"
          max="1"
          size="1572864"
          accept="image/avif"
          on:change={(e) => handleFileUpload(e, 'background')}
        />
      </div>
      {#if tooMuchFiles}
        <p class="validation">You can only upload up to 3 background images!</p>
      {/if}
    {/if}

    <div class="media-wrapper">
      {#each backgrounds as bg}
        <span class="content flex">
          <img
            src={serveUrl(bg)}
            alt="Background"
            draggable="false"
          />
          <button
            class="red-btn"
            on:click={() => handleDelete(bg, 'background')}
          >
            Delete
          </button>
        </span>
      {/each}
    </div>

    <hr />

    <!-- Description Upload -->
    <h4>Description</h4>
    {#if description}
      <p class="validation green-txt">You've already uploaded a description picture.</p>
    {:else}
      <div
        class="dropzone"
        class:dragover
        on:dragover={ondragover}
        on:dragleave={ondragleave}
        role="button"
        tabindex="-1"
      >
        <label for="description-upload">📁 Drop image here or click to upload (only &lt1.5MB AVIF files)</label>
        <input
          id="description-upload"
          type="file"
          max="1"
          size="1572864"
          accept="image/avif"
          on:change={(e) => handleFileUpload(e, 'description')}
        />
      </div>
    {/if}
    {#if description}
      <span class="content flex">
        <img
          src={serveUrl(description)}
          alt="Description"
          class="preview"
          draggable="false"
        />
        <button
          class="red-btn"
          on:click={() => handleDelete(description ?? '', 'description')}
        >
          Delete
        </button>
      </span>
    {/if}

    <hr />

    <!-- Tile Upload -->
    <h4>Tile</h4>
    {#if tile}
      <p class="validation green-txt">You've already uploaded a tile picture.</p>
    {:else}
      <div
        class="dropzone"
        class:dragover
        on:dragover={ondragover}
        on:dragleave={ondragleave}
        role="button"
        tabindex="-1"
      >
        <label for="tile-upload">📁 Drop image here or click to upload (only &lt1.5MB AVIF files)</label>
        <input
          id="tile-upload"
          type="file"
          max="1"
          size="1572864"
          accept="image/avif"
          on:change={(e) => handleFileUpload(e, 'tile')}
        />
      </div>
    {/if}
    {#if tile}
      <span class="content flex">
        <img src={serveUrl(tile)} alt="Tile" class="preview" draggable="false" />
        <button
          class="red-btn"
          on:click={() => handleDelete(tile ?? '', 'tile')}
        >
          Delete
        </button>
      </span>
    {/if}

    <hr />

    <!-- Audio Upload -->
    <h4>Audio</h4>
    {#if audio}
      <p class="validation green-txt">You've already uploaded an audio file.</p>
    {:else}
      <div
        class="dropzone"
        class:dragover
        on:dragover={ondragover}
        on:dragleave={ondragleave}
        role="button"
        tabindex="-1"
      >
        <label for="audio-upload">📁 Drop audio here or click to upload (only &lt6MB MP3 files)</label>
        <input
        id="audio-upload"
        type="file"
        max="1"
        size="6291456"
        accept="audio/mp3"
        on:change={(e) => handleFileUpload(e, 'audio')}
        />
      </div>
    {/if}
    {#if audio}
      <span class="content media-wrapper">
        <audio controls>
          <source src={serveUrl(audio)} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        <button
          class="red-btn"
          on:click={() => handleDelete(audio ?? '', 'audio')}
        >
          Delete
        </button>
      </span>
    {/if}

    <hr />

    <!-- Video Upload -->
    <h4>Video</h4>
    {#if video}
      <p class="validation green-txt">You've already uploaded a video file.</p>
    {:else}
      <div
        class="dropzone"
        class:dragover
        on:dragover={ondragover}
        on:dragleave={ondragleave}
        role="button"
        tabindex="-1"
      >
        <label for="video-upload">📁 Drop video here or click to upload (only &lt10MB MP4 files)</label>
        <input
          id="video-upload"
          type="file"
          max="1"
          size="10485760"
          accept="video/mp4"
          on:change={(e) => handleFileUpload(e, 'video')}
        />
      </div>
    {/if}
    {#if video}
      <span class="content flex">
        <video controls class="preview video-preview" draggable="false">
          <source src={serveUrl(video)} type="video/mp4" />
          <track
            kind="captions"
            src="path/to/captions.vtt"
            srclang="en"
            label="English"
          />
          Your browser does not support the video tag.
        </video>
        <button
          class="red-btn"
          on:click={() => handleDelete(video ?? '', 'video')}
        >
          Delete
        </button>
      </span>
    {/if}
  </section>
{/if}

<style lang="scss">
  @use "/src/styles/mixins" as *;

  section {
    flex-flow: row wrap;
  }
</style>
