<script lang="ts">
  import { onMount } from 'svelte';

  import { blankImage, serveUrl } from '@constants/media';
  import {
    validateFiles,
    MEDIA_RULES,
    resolveRenderableImage,
  } from '@utils/file-validation';
  import { toastStore } from '@stores/toast.svelte';
  import { toAvif } from '@utils/avif-convert';

  let {
    topic_media_files = $bindable(),
    handleMediaUpload,
    handleDeleteMedia,
  }: {
    topic_media_files: TopicMediaFile[];
    handleMediaUpload: (media_type: MediaType, file: File) => Promise<string[]>;
    handleDeleteMedia: (
      file_id: string,
      media_type: MediaType,
    ) => Promise<void>;
  } = $props();

  let isLoading = $state<boolean>(false);

  let backgrounds = $state<string[]>([]);
  let description = $state<string | null>(null);
  let tile = $state<string | null>(null);
  let audio = $state<string[]>([]);
  let video = $state<string | null>(null);
  let descriptionPreview = $state<string>(blankImage);
  let tilePreview = $state<string>(blankImage);
  let backgroundSources = $state<Record<string, string>>({});

  let tooMuchFiles = $state<boolean>(false);

  let dragover = $state<Nullable<string>>(null);

  const ondragleave = () => (dragover = null);
  const ondragover = (type: string) => (dragover = type);

  const formatMiB = (bytes: number) =>
    `${(bytes / 1_048_576).toFixed(1).replace(/\.0$/, '')} MiB`;

  const slotLimitLabel: Record<MediaType, string> = {
    description: formatMiB(MEDIA_RULES.description.maxBytes),
    tile: formatMiB(MEDIA_RULES.tile.maxBytes),
    background: formatMiB(MEDIA_RULES.background.maxBytes),
    video: formatMiB(MEDIA_RULES.video.maxBytes),
    audio: formatMiB(MEDIA_RULES.audio.maxBytes),
  };

  // map UI ‘MediaType’ → slot key
  // map backend media types to the individual slot buckets we track in local rune state
  const typeToSlot = {
    description: 'description',
    tile: 'tile',
    background: 'background',
    video: 'video',
    audio: 'audio',
  };

  // helper counters let us enforce per-slot upload limits before we hit the API
  const counters = {
    description: () => (description ? 1 : 0),
    tile: () => (tile ? 1 : 0),
    background: () => backgrounds.length,
    video: () => (video ? 1 : 0),
    audio: () => audio.length,
  };

  // Derive live preview for the description slot
  $effect(() => {
    const fileId = description;
    if (!fileId) {
      descriptionPreview = blankImage;
      return;
    }

    let cancelled = false;

    const candidate = serveUrl(fileId);
    descriptionPreview = candidate;

    (async () => {
      const safe = await resolveRenderableImage(candidate);
      if (!cancelled) descriptionPreview = safe;
    })();

    return () => {
      cancelled = true;
    };
  });

  // Derive live preview for the tile slot
  $effect(() => {
    const fileId = tile;
    if (!fileId) {
      tilePreview = blankImage;
      return;
    }

    let cancelled = false;

    const candidate = serveUrl(fileId);
    tilePreview = candidate;

    (async () => {
      const safe = await resolveRenderableImage(candidate);
      if (!cancelled) tilePreview = safe;
    })();

    return () => {
      cancelled = true;
    };
  });

  // Keep background previews in sync when files are added/removed
  $effect(() => {
    const ids = backgrounds.slice();
    if (!ids.length) {
      backgroundSources = {};
      return;
    }

    let cancelled = false;

    backgroundSources = Object.fromEntries(ids.map((id) => [id, serveUrl(id)]));

    (async () => {
      const entries = await Promise.all(
        ids.map(async (id) => {
          const safe = await resolveRenderableImage(serveUrl(id));
          return [id, safe] as const;
        }),
      );

      if (!cancelled) {
        backgroundSources = Object.fromEntries(entries);
      }
    })();

    return () => {
      cancelled = true;
    };
  });

  // Fetch stored media on load
  const loadMedia = async () => {
    if (!topic_media_files) return;
    isLoading = true;

    for (const file of topic_media_files) {
      const slot = typeToSlot[file.media_type];
      if (!slot) continue; // skip unknown media types

      if (slot === 'background') {
        backgrounds.push(file.file_id);
      } else if (slot === 'description') {
        description = file.file_id;
      } else if (slot === 'tile') {
        tile = file.file_id;
      } else if (slot === 'video') {
        video = file.file_id;
      } else if (slot === 'audio') {
        audio.push(file.file_id);
      }
    }

    isLoading = false;
  };

  onMount(loadMedia);

  /* true  ↦ we will try to convert client‑side
    false ↦ upload as‑is                         */
  function shouldConvertToAvif(slot: MediaType, file: File): boolean {
    if (!file.type.startsWith('image/')) return false; // not an image
    if (file.type === 'image/avif') return false; // already AVIF
    // only our three image slots are convertible
    return slot === 'description' || slot === 'tile' || slot === 'background';
  }

  // Handle file upload
  async function handleFileUpload(e: Event, slot: MediaType) {
    const input = e.target as HTMLInputElement;
    if (!input.files) return;

    try {
      const files = [...input.files];
      const accepted = await validateFiles(slot, files, counters[slot]());

      for (const f of accepted) {
        let upload = f;

        if (shouldConvertToAvif(slot, f)) {
          toastStore.show(`Uploading ${f.name} file…`);
          try {
            const { file: converted } = await toAvif(f, {
              maxBytes: MEDIA_RULES[slot].maxBytes,
            });
            if (converted.size > MEDIA_RULES[slot].maxBytes) {
              throw new Error(
                `Converted image is larger than ${slotLimitLabel[slot]}`,
              );
            }
            upload = converted;
          } catch (err) {
            toastStore.show(String(err), 'error');
            continue; // skip this file
          }
        }

        console.log('Uploading media file:', upload);
        const [id] = await handleMediaUpload(slot, upload);
        if (!id) continue;

        /* ---------- refresh local state so the UI re‑renders ---------- */
        if (slot === 'background') {
          backgrounds = [...backgrounds, id].slice(0, 3);
        } else if (slot === 'description') {
          description = id;
        } else if (slot === 'tile') {
          tile = id;
        } else if (slot === 'video') {
          video = id;
        } else if (slot === 'audio') {
          audio = [...audio, id].slice(0, 3);
        }
      }
    } finally {
      input.value = '';
      dragover = null;
    }
  }

  const handleDelete = async (fileId: string, type: MediaType) => {
    try {
      await handleDeleteMedia(fileId, type);

      topic_media_files = topic_media_files.filter(
        (file) => file.file_id !== fileId,
      );

      if (type === 'background') {
        backgrounds = backgrounds.filter((bg) => bg !== fileId);
      } else if (type === 'description') {
        description = null;
      } else if (type === 'tile') {
        tile = null;
      } else if (type === 'audio') {
        audio = audio.filter((a) => a !== fileId);
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
              src={descriptionPreview}
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
              ⚠️ Max {slotLimitLabel.description}
            </label>
            <input
              id="description-upload"
              type="file"
              max="1"
              size="1572864"
              accept="image/avif,image/jpeg,image/png,image/webp"
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
              src={tilePreview}
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
              ⚠️ Max {slotLimitLabel.tile}
            </label>
            <input
              id="tile-upload"
              type="file"
              max="1"
              size="1572864"
              accept="image/avif,image/jpeg,image/png,image/webp"
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
              ⚠️ Max {slotLimitLabel.video} MP4 files
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
                <img
                  src={backgroundSources[bg] ?? blankImage}
                  alt="Background"
                  draggable="false"
                />
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
                ⚠️ Max {slotLimitLabel.background}
                <br />
                <br />
                Up to 3 files
              </label>
              <input
                id="bg-upload"
                type="file"
                max="3"
                size="1572864"
                accept="image/avif,image/jpeg,image/png,image/webp"
                onchange={(e) => handleFileUpload(e, 'background')}
                multiple
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
        <div class="content-wrapper">
          {#each audio as track}
            <span class="content audio-content" role="button" tabindex="0">
              <audio controls>
                <source src={serveUrl(track)} type="audio/mpeg" />
              </audio>
              <button
                class="red-btn"
                onclick={() => handleDelete(track, 'audio')}
              >
                Delete
              </button>
            </span>
          {/each}

          {#if audio.length < 3}
            <div
              class="dropzone audio-content"
              class:dragover={dragover === 'audio'}
              ondragover={() => ondragover('audio')}
              {ondragleave}
              role="button"
              tabindex="-1"
            >
              <label for="audio-upload">
                📁 Drop audio file(s) here or click to upload
                <br /><br />
                ⚠️ Max {slotLimitLabel.audio} MP3 files — up to 3 total
              </label>
              <input
                id="audio-upload"
                type="file"
                max="3"
                size="6291456"
                accept="audio/mp3"
                onchange={(e) => handleFileUpload(e, 'audio')}
                multiple
              />
            </div>
          {/if}
        </div>
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
