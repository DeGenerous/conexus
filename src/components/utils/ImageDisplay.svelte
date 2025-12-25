<script lang="ts">
  import { blankImage } from '@constants/media';
  import { resolveRenderableImage } from '@utils/file-validation';

  let {
    image,
    image_type = 'url',
    style = '',
  }: {
    image: string | undefined;
    image_type?: string;
    style?: string;
  } = $props();

  let fullWidthImage = $state<boolean>(false);
  let isLoading = $state<boolean>(true);
  let imageSrc = $state<string>('');

  // Watch for changes in image props
  $effect(() => {
    let cancelled = false;

    if (!image) {
      imageSrc = blankImage; // reset the source if null
      isLoading = true;
      return () => {
        cancelled = true;
      };
    }

    if (image_type === 'url') {
      // Validate remote URLs before binding them to the <img>
      imageSrc = image;
      isLoading = false;
      (async () => {
        const safeSrc = await resolveRenderableImage(image);
        if (!cancelled) {
          if (safeSrc !== image) imageSrc = safeSrc;
        }
      })();
    } else {
      imageSrc = `data:image/png;base64,${image}`;
      isLoading = false; // Base64 images load instantly
    }

    return () => {
      cancelled = true;
    };
  });

  function handleImageLoad() {
    isLoading = false; // Hide loader once the image loads
  }

  function handleImageError() {
    console.error('Image failed to load:', imageSrc);
    imageSrc = blankImage;
    isLoading = false;
  }
</script>

<button
  id="step-image"
  class="void-btn container loading-animation"
  class:loading={isLoading}
  class:slim={!fullWidthImage}
  onclick={() => (fullWidthImage = !fullWidthImage)}
  {style}
>
  {#if isLoading}
    <span>
      <img src="/icons/loading.png" alt="Loading..." />
      <p>Click to change image size</p>
    </span>
  {:else}
    <img
      style:visibility={isLoading ? 'hidden' : 'visible'}
      src={imageSrc}
      alt=""
      onload={handleImageLoad}
      onerror={handleImageError}
    />
  {/if}
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button.container {
    width: 100%;
    padding: 0;
    animation: none;
    background-color: unset;

    &.loading {
      animation: shimmer 2s ease infinite;
    }

    span {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        opacity: 0.25;
        transform: scale(0.75);
        filter: grayscale(100%);
      }

      p {
        position: absolute;
        width: 100%;
        bottom: 1rem;
        opacity: 0.25;
        color: var(--theme-font);
      }
    }

    img {
      max-height: 100%;
      height: 100%;
      border-radius: inherit;

      @include respond-up(small-desktop) {
        max-height: 400px;
        aspect-ratio: 16 / 9;
      }
    }

    &.slim {
      height: 512px;
    }

    @include respond-up(tablet) {
      cursor: default;

      p {
        display: none;
      }

      &.slim {
        height: auto;
      }
    }
  }
</style>
