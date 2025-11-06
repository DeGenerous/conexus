<script lang="ts">
  import { blankImage } from '@constants/media';
  import { resolveRenderableImage } from '@utils/file-validation';

  let {
    width,
    zoom,
    image,
    image_type = 'url',
    imageWidth = 800,
    imageHeight = 512,
    boxShadow = true,
  }: {
    width: number;
    zoom: number;
    image: string | undefined;
    image_type?: string;
    imageWidth: number;
    imageHeight: number;
    boxShadow: boolean;
  } = $props();

  let fullWidthImage = $state<boolean>(false);
  let isLoading = $state<boolean>(true);
  let imageSrc = $state<string>('');

  // Watch for changes in image props
  $effect(() => {
    let cancelled = false;

    console.log('ImageDisplay received image:', image);

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
  class="void-btn transparent-container"
  onclick={() => (fullWidthImage = !fullWidthImage)}
  class:slim={!fullWidthImage}
  style:box-shadow={boxShadow ? '' : 'none'}
  style:border={boxShadow ? 'none' : ''}
  style:max-width="{imageWidth}px"
  style={width < 768 ? '' : `height: ${imageHeight}px`}
  style:zoom
>
  {#if isLoading}
    <span class="pulse-animation">
      <img src="/icons/loading.png" alt="Loading..." />
      <p>Click to change image size</p>
    </span>
  {:else}
    <img
      src={imageSrc}
      alt=""
      onload={handleImageLoad}
      onerror={handleImageError}
    />
  {/if}
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .transparent-container {
    padding: 0 !important;
    @include box-shadow;

    span {
      position: relative;
      width: 100%;
      height: 100%;

      p {
        position: absolute;
        width: 100%;
        bottom: 1rem;
      }
    }

    img {
      max-height: 100%;
      height: 100%;
      border-radius: inherit;
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

    @include respond-up(small-desktop) {
      width: 100%;
      height: unset;

      img {
        height: inherit;
      }
    }
  }
</style>
