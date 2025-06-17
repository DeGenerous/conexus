<script lang="ts">
  import { serveUrl } from '@constants/media';
  import MediaManager from '@lib/media';

  let { topic_id = $bindable() }: { topic_id: number } = $props();

  let mediaManager = new MediaManager();

  let isLoading = $state<boolean>(true);

  let backgrounds = $state<string[]>([]);
  let description = $state<string | null>(null);
  let tile = $state<string | null>(null);
  let audio = $state<string | null>(null);
  let video = $state<string | null>(null);

  let tooMuchFiles = $state<boolean>(false);

  let dragover = $state<Nullable<string>>(null);

  const ondragleave = () => (dragover = null);
  const ondragover = (type: string) => (dragover = type);

  $effect(() => {
    loadMedia();
  });

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
    dragover = null;

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
</script>

{#if isLoading}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else}
  <section class="dream-container fade-in">
    <div class="container content-wrapper">
      <!-- Description Upload -->
      <div class="media-section flex">
        <h4>Description</h4>
        {#if description}
          <span class="content flex" role="button" tabindex="0">
            <img
              src={serveUrl(description)}
              alt="Description"
              class="preview"
              draggable="false"
            />
            <button
              class="red-btn"
              onclick={() => handleDelete(description ?? '', 'description')}
            >
              Delete
            </button>
          </span>
        {:else}
          <div
            class="dropzone"
            class:dragover={dragover === 'description'}
            ondragover={() => ondragover('description')}
            {ondragleave}
            role="button"
            tabindex="-1"
          >
            <label for="description-upload">
              📁 Drop image here or click to upload
              <br />
              <br />
              ❗ Only &lt1.5MB AVIF files
            </label>
            <input
              id="description-upload"
              type="file"
              max="1"
              size="1572864"
              accept="image/avif"
              onchange={(e) => handleFileUpload(e, 'description')}
            />
          </div>
        {/if}
      </div>

      <!-- Tile Upload -->
      <div class="media-section flex">
        <h4>Tile</h4>
        {#if tile}
          <span class="content flex" role="button" tabindex="0">
            <img
              src={serveUrl(tile)}
              alt="Tile"
              class="preview"
              draggable="false"
            />
            <button
              class="red-btn"
              onclick={() => handleDelete(tile ?? '', 'tile')}
            >
              Delete
            </button>
          </span>
        {:else}
          <div
            class="dropzone"
            class:dragover={dragover === 'tile'}
            ondragover={() => ondragover('tile')}
            {ondragleave}
            role="button"
            tabindex="-1"
          >
            <label for="tile-upload">
              📁 Drop image here or click to upload
              <br />
              <br />
              ❗ Only &lt1.5MB AVIF files
            </label>
            <input
              id="tile-upload"
              type="file"
              max="1"
              size="1572864"
              accept="image/avif"
              onchange={(e) => handleFileUpload(e, 'tile')}
            />
          </div>
        {/if}
      </div>

      <!-- Video Upload -->
      <div class="media-section flex">
        <h4>Video</h4>
        {#if video}
          <span class="content flex" role="button" tabindex="0">
            <video controls draggable="false">
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
              onclick={() => handleDelete(video ?? '', 'video')}
            >
              Delete
            </button>
          </span>
        {:else}
          <div
            class="dropzone"
            class:dragover={dragover === 'video'}
            ondragover={() => ondragover('video')}
            {ondragleave}
            role="button"
            tabindex="-1"
          >
            <label for="video-upload">
              📁 Drop video here or click to upload
              <br />
              <br />
              ❗ Only &lt10MB MP4 files
            </label>
            <input
              id="video-upload"
              type="file"
              max="1"
              size="10485760"
              accept="video/mp4"
              onchange={(e) => handleFileUpload(e, 'video')}
            />
          </div>
        {/if}
      </div>
    </div>

    <div class="container">
      <!-- Background Upload -->
      <div class="media-section flex">
        <h4>Backgrounds</h4>
        <div class="content-wrapper">
          {#if backgrounds.length}
            {#each backgrounds as bg}
              <span class="content flex" role="button" tabindex="0">
                <img src={serveUrl(bg)} alt="Background" draggable="false" />
                <button
                  class="red-btn"
                  onclick={() => handleDelete(bg, 'background')}
                >
                  Delete
                </button>
              </span>
            {/each}
          {/if}
          {#if backgrounds.length < 3}
            <div
              class="dropzone"
              class:dragover={dragover === 'bg'}
              ondragover={() => ondragover('bg')}
              {ondragleave}
              role="button"
              tabindex="-1"
            >
              <label for="bg-upload">
                📁 Drop image(s) here or click to upload
                <br />
                <br />
                ❗ Only &lt1.5MB AVIF files
                <br />
                <br />
                Up to 3 files
              </label>
              <input
                id="bg-upload"
                type="file"
                max="1"
                size="1572864"
                accept="image/avif"
                onchange={(e) => handleFileUpload(e, 'background')}
              />
            </div>
          {/if}
        </div>
        {#if tooMuchFiles}
          <p class="validation">
            You can only upload up to 3 background images!
          </p>
        {/if}
      </div>
    </div>

    <div class="container">
      <!-- Audio Upload -->
      <div class="media-section flex">
        <h4>Audio</h4>
        {#if audio}
          <span class="content audio-content" role="button" tabindex="0">
            <audio controls>
              <source src={serveUrl(audio)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <button
              class="red-btn"
              onclick={() => handleDelete(audio ?? '', 'audio')}
            >
              Delete
            </button>
          </span>
        {:else}
          <div
            class="dropzone audio-content"
            class:dragover={dragover === 'audio'}
            ondragover={() => ondragover('audio')}
            {ondragleave}
            role="button"
            tabindex="-1"
          >
            <label for="audio-upload">
              📁 Drop audio here or click to upload
              <br />
              <br />
              ❗ Only &lt6MB MP3 files
            </label>
            <input
              id="audio-upload"
              type="file"
              max="1"
              size="6291456"
              accept="audio/mp3"
              onchange={(e) => handleFileUpload(e, 'audio')}
            />
          </div>
        {/if}
      </div>
    </div>
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-container {
    flex-flow: row wrap;
    align-items: flex-start;

    & > .container {
      width: auto;
      margin-inline: 0;
    }

    .content-wrapper {
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: flex-start;
      gap: 1rem;
    }

    .media-section {
      width: auto;
      flex-direction: column;

      h4 {
        width: auto;
        text-align: center;
      }

      .dropzone {
        width: 14rem;
        height: 17rem;
        padding: 1rem;
      }

      .content {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        width: 14rem;
        max-height: 17rem;
        @include gray(0.25);
        @include box-shadow;

        img,
        video {
          width: 100%;
          min-height: 7rem;
          max-height: 100%;
          border-radius: 0.25rem;
          @include dark-blue(0.5);
        }

        &:hover,
        &:active {
          @include light-blue(0.5);
          @include bright;
          @include scale-up(soft);
          @include box-shadow(deep);
        }
      }

      .audio-content {
        min-width: 20rem;
        height: unset;

        @include respond-up(small-desktop) {
          width: 36rem;
          max-height: 7rem;
        }

        audio {
          width: 100%;
        }
      }
    }
  }
</style>
