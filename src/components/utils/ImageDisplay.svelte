<script lang="ts">
  export let image: string | undefined;
  export let image_type: string = 'url';
  export let width: number;
  export let fullWidthImage: boolean = false;

  let isLoading = true;
  let imageSrc = '';

  // Watch for changes in image props
  $: {
    if (image) {
      if (image_type === 'url') {
        imageSrc = image;
        isLoading = true; // Ensure loader shows until image loads
      } else {
        imageSrc = `data:image/png;base64,${image}`;
        isLoading = false; // Base64 images load instantly
      }
    } else {
      imageSrc = ''; // Reset image source when null
      isLoading = true;
    }
  }

  function handleImageLoad() {
    isLoading = false; // Hide loader once the image loads
  }

  function handleImageError() {
    console.error('Image failed to load:', imageSrc);
    isLoading = true; // Keep the loader if the image fails
  }
</script>

{#if isLoading}
  <img class="image loading-image" src="/icons/loading.png" alt="Loading..." />
  {#if width <= 600}
    <p class="click-hint" style:display={fullWidthImage ? 'none' : 'block'}>
      Click to change image size
    </p>
  {/if}
{/if}

<img
  class="image"
  src={imageSrc}
  alt=""
  on:load={handleImageLoad}
  on:error={handleImageError}
  style={isLoading ? 'display: none;' : 'display: block;'}
/>

<style>
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1em;
  }

  .loading-image {
    object-fit: contain;
    animation: pulse 5s linear infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.2;
    }
  }

  .click-hint {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 1em;
    color: rgb(51, 226, 230);
    animation: pulse 5s linear infinite;
  }
</style>
