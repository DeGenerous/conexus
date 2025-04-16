<script lang="ts">
  export let webSources: VideoPlaylist[] = [];
  export let mobileSources: VideoPlaylist[] = [];

  let videoElement: HTMLVideoElement;

  let playing = false;
  let muted = false;
  let progress = 0;

  function togglePlay() {
    if (videoElement.paused) {
      videoElement.play();
      playing = true;
    } else {
      videoElement.pause();
      playing = false;
    }
  }

  function toggleMute() {
    videoElement.muted = !videoElement.muted;
    muted = videoElement.muted;
  }

  function updateProgress() {
    progress = (videoElement.currentTime / videoElement.duration) * 100;
  }

  function seek(e) {
    const newTime = (e.target.value / 100) * videoElement.duration;
    videoElement.currentTime = newTime;
  }

  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
</script>

{#if webSources.length > 0 || mobileSources.length > 0}
  <div class="player">
    {#if isMobile}
      <video bind:this={videoElement} on:timeupdate={updateProgress}>
        <track
          kind="captions"
          src="/captions.vtt"
          srclang="en"
          label="English"
        />
        {#each mobileSources as src}
          <source src={src.src} type={src.type} />
        {/each}
      </video>
    {:else}
      <video bind:this={videoElement} on:timeupdate={updateProgress}>
        <track
          kind="captions"
          src="/captions.vtt"
          srclang="en"
          label="English"
        />
        {#each webSources as src}
          <source src={src.src} type={src.type} />
        {/each}
      </video>
    {/if}

    <div class="controls">
      <button on:click={togglePlay}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <input type="range" min="0" max="100" value={progress} on:input={seek} />
      <button on:click={toggleMute}>
        {muted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  </div>
{/if}

<style>
  .player {
    position: relative;
    width: 640px;
  }

  video {
    width: 100%;
    border-radius: 12px;
  }

  .controls {
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5em;
    color: white;
    border-radius: 0 0 12px 12px;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  input[type='range'] {
    flex: 1;
    margin: 0 1em;
  }
</style>
