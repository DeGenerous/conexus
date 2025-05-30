<script lang="ts">
  export let image: string | undefined;
  export let image_type: string = 'url';
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

<button
  class="void-btn transparent-container"
  on:click={() => (fullWidthImage = !fullWidthImage)}
  class:slim={!fullWidthImage}
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
      on:load={handleImageLoad}
      on:error={handleImageError}
    />
  {/if}
</button>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  button {
    padding: 0 !important;

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
      height: 100%;
      border-radius: inherit;
    }

    &.slim {
      height: 32rem;
    }

    @include respond-up(tablet) {
      height: auto !important;
      cursor: default;

      p {
        display: none;
      }
    }
  }

</style>
