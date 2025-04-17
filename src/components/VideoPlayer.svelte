<script lang="ts">
  import { onMount } from "svelte";

  export let webSources: VideoPlaylist[] = [];
  export let mobileSources: VideoPlaylist[] = [];

  let videoElement: HTMLVideoElement;

  let playing = false;
  let muted = false;
  let progress = 0;
  let showControls: boolean = false;

  onMount(() => {
    const timeSlider = document.getElementById("time-slider") as HTMLInputElement;
    setTimeout(() => (timeSlider.value = "0"));
  })

  function togglePlay() {
    if (videoElement.paused) {
      videoElement.play();
      playing = true;
    } else {
      videoElement.pause();
      playing = false;
      showControls = true;
    }
  }

  function toggleMute() {
    videoElement.muted = !videoElement.muted;
    muted = videoElement.muted;
  }

  function updateProgress() {
    progress = (videoElement.currentTime / videoElement.duration) * 100;
  }

  function seek() {
    const newTime = (progress / 100) * videoElement.duration;
    videoElement.currentTime = newTime;
  }

  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if webSources.length > 0 || mobileSources.length > 0}
  <div
    class="player"
    on:click={togglePlay}
    on:pointerover={() => (showControls = true)}
    on:pointerout={() => (showControls = false)}
    role="button"
    tabindex="0"
  >
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

    <div
      class="controls"
      style:transform={showControls
        ? "none"
        : "translateY(100%)"
      }
      on:click|stopPropagation
      role="button"
      tabindex="0"
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox="-100 -100 200 200"
        class="play-pause-svg"
        fill="white"
        stroke="white"
        stroke-width="25"
        stroke-linecap="round"
        stroke-linejoin="round"
        on:click={togglePlay}
        role="button"
        tabindex="0"
      >
        {#if playing}
          <line stroke-width="50" x1="-50" y1="-75" x2="-50" y2="75" />
          <line stroke-width="50" x1="50" y1="-75" x2="50" y2="75" />
        {:else}
          <polygon
            class="play-svg-x"
            points="-50 -75 -50 75 75 0"
          />
        {/if}
      </svg>

      <input
        id="time-slider"
        type="range"
        min="0"
        max="100"
        bind:value={progress}
        on:input={seek}
      />
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        class="volume-svg"
        fill="#dedede"
        stroke="#dedede"
        stroke-linejoin="round"
        stroke-linecap="round"
        on:click={toggleMute}
        role="button"
        tabindex="0"
        aria-label="Adjust volume"
        style="opacity: {muted ? '0.5' : '1'}"
      >
        <defs>
          <mask id="volume-svg-top-mask">
            <rect
              x="-100"
              y="-100"
              width="200"
              height="200"
              fill="white"
              style="transform: {muted ? 'translateX(-200px)' : 'none'}"
            />
          </mask>
          <mask id="volume-svg-bottom-mask">
            <rect
              x="100"
              y="-100"
              width="200"
              height="200"
              fill="white"
              style="transform: {muted ? 'translateX(-200px)' : 'none'}"
            />
          </mask>
          <mask id="volume-svg-crossed-out-mask">
            <g fill="white" stroke="white">
              <polygon
                points="
                  -40 -50 85 -85 85 -55 -40 -20
                "
                stroke-width="15"
              />
              <line x1="-35" y1="-40" x2="-35" y2="68" stroke-width="25" />
              <line x1="80" y1="-60" x2="80" y2="44" stroke-width="25" />
              <ellipse cx="-58" cy="70" rx="35" ry="22" />
              <ellipse cx="57" cy="46" rx="35" ry="22" />
            </g>
            <line
              x1="75"
              y1="-95"
              x2="-95"
              y2="75"
              stroke="black"
              stroke-width="15"
            />
          </mask>
        </defs>

        <g mask="url(#volume-svg-top-mask)">
          <polygon
            points="
              -40 -50 85 -85 85 -55 -40 -20
            "
            stroke-width="15"
          />
          <line x1="-35" y1="-40" x2="-35" y2="68" stroke-width="25" />
          <line x1="80" y1="-60" x2="80" y2="44" stroke-width="25" />
          <ellipse cx="-58" cy="70" rx="35" ry="22" />
          <ellipse cx="57" cy="46" rx="35" ry="22" />
        </g>

        <g mask="url(#volume-svg-bottom-mask)">
          <g mask="url(#volume-svg-crossed-out-mask)">
            <polygon
              points="
                -40 -50 85 -85 85 -55 -40 -20
              "
              stroke-width="15"
            />
            <line x1="-35" y1="-40" x2="-35" y2="68" stroke-width="25" />
            <line x1="80" y1="-60" x2="80" y2="44" stroke-width="25" />
            <ellipse cx="-58" cy="70" rx="35" ry="22" />
            <ellipse cx="57" cy="46" rx="35" ry="22" />
          </g>
          <line x1="90" y1="-90" x2="-90" y2="90" stroke-width="15" />
        </g>
      </svg>
    </div>
  </div>
{/if}

<style>
  .player {
    display: flex;
    position: relative;
    width: 75vw;
    height: auto;
    background-color: rgba(1, 0, 32, 0.75);
    border-radius: 1.5vw;
    box-shadow: 0 0 0.5vw #010020;
    overflow: hidden;
  }

  video {
    width: 100%;
    border-radius: inherit;
  }

  .controls {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;
    padding: 1vw;
    border-radius: inherit;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background: rgba(1, 0, 32, 0.75);
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 10;
  }

  input[type='range'] {
    width: 100%;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    .player {
      width: 90vw;
      border-radius: 1em;
    }

    .controls {
      transform: none !important;
      padding: 0.5em 1em;
      gap: 1em;
    }
  }
</style>
