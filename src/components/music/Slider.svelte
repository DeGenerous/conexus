<script lang="ts">
  import { onMount } from 'svelte';
  import type { Writable } from 'svelte/store';

  export let type: 'voice' | 'music';
  export let volume: Writable<VolumeControl>;
  export let restartable: boolean = false;

  $: inputValue = !$volume.muted ? $volume.volume : 0;

  onMount(() => {
    if (localStorage.getItem(`${type}-volume`)) {
      const volumeValue = JSON.parse(
        localStorage.getItem(`${type}-volume`) as string,
      );
      $volume = volumeValue;
      if (type === 'voice') {
        voiceMuted = $volume.muted;
      } else if (type === 'music') {
        volumeMuted = $volume.muted;
      }
    }
  });

  const mute = () => {
    volume.update((v) => {
      if (type === 'voice') {
        voiceMuted = !v.muted;
      } else if (type === 'music') {
        volumeMuted = !v.muted;
      }
      return { ...v, muted: !v.muted };
    });
    localStorage.setItem(`${type}-volume`, JSON.stringify($volume));
  };

  const update = () => {
    volume.set({
      muted: false,
      volume: inputValue,
      restart: false,
    });
    localStorage.setItem(`${type}-volume`, JSON.stringify($volume));
  };

  const restart = () => {
    volume.update((v) => ({ ...v, restart: true }));
  };

  // SVG Icons
  let voiceMuted: boolean = false;
  let volumeMuted: boolean = false;
  let voiceSvgFocus: boolean = false;
  let replaySvgFocuse: boolean = false;

  $: disabledInput =
    type === 'voice'
      ? voiceMuted
        ? true
        : false
      : type === 'music'
        ? volumeMuted
          ? true
          : false
        : true;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div>
  {#if type === 'voice'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="voice-svg"
      fill="#dedede"
      stroke="#dedede"
      stroke-width="15"
      stroke-linecap="round"
      on:click={mute}
      on:pointerover={() => {
        if (!voiceMuted) voiceSvgFocus = true;
      }}
      on:pointerout={() => {
        if (!voiceMuted) voiceSvgFocus = false;
      }}
      role="button"
      tabindex="0"
      aria-label="Adjust voice"
      style="opacity: {voiceMuted ? '0.5' : '1'}"
    >
      <defs>
        <mask id="voice-svg-top-mask">
          <rect
            x="-100"
            y="-100"
            width="200"
            height="200"
            fill="white"
            style="transform: {voiceMuted ? 'translateX(-200px)' : 'none'}"
          />
        </mask>
        <mask id="voice-svg-bottom-mask">
          <rect
            x="100"
            y="-100"
            width="200"
            height="200"
            fill="white"
            style="transform: {voiceMuted ? 'translateX(-200px)' : 'none'}"
          />
        </mask>
        <mask id="voice-svg-crossed-out-mask">
          <g fill="white" stroke="white">
            <rect
              x="-35"
              y="-90"
              width="70"
              height="125"
              rx="100"
              ry="40"
              stroke="none"
            />
            <path
              d="
                M -55 -10
                C -60 74 60 74 55 -10
              "
              fill="none"
            />
            <path
              d="
                M 0 55
                L 0 85
                M 25 85
                L -25 85
              "
              fill="none"
            />
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

      <g mask="url(#voice-svg-top-mask)">
        <rect
          x="-35"
          y="-90"
          width="70"
          height="125"
          rx="100"
          ry="40"
          stroke="none"
        />
        <path
          d="
            M -55 -10
            C -60 74 60 74 55 -10
          "
          fill="none"
          style="transform: {voiceSvgFocus ? 'scaleX(-1)' : 'none'}"
        />
        <path
          d="
            M 0 55
            L 0 85
            M 25 85
            L -25 85
          "
          fill="none"
        />
      </g>

      <g mask="url(#voice-svg-bottom-mask)">
        <g mask="url(#voice-svg-crossed-out-mask)">
          <rect
            x="-35"
            y="-90"
            width="70"
            height="125"
            rx="100"
            ry="40"
            stroke="none"
          />
          <path
            d="
              M -55 -10
              C -60 74 60 74 55 -10
            "
            fill="none"
          />
          <path
            d="
              M 0 55
              L 0 85
              M 25 85
              L -25 85
            "
            fill="none"
          />
        </g>
        <line x1="85" y1="-85" x2="-85" y2="85" stroke-width="15" />
      </g>
    </svg>
  {:else if type === 'music'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="volume-svg"
      fill="#dedede"
      stroke="#dedede"
      stroke-linejoin="round"
      stroke-linecap="round"
      on:click={mute}
      role="button"
      tabindex="0"
      aria-label="Adjust volume"
      style="opacity: {volumeMuted ? '0.5' : '1'}"
    >
      <defs>
        <mask id="volume-svg-top-mask">
          <rect
            x="-100"
            y="-100"
            width="200"
            height="200"
            fill="white"
            style="transform: {volumeMuted ? 'translateX(-200px)' : 'none'}"
          />
        </mask>
        <mask id="volume-svg-bottom-mask">
          <rect
            x="100"
            y="-100"
            width="200"
            height="200"
            fill="white"
            style="transform: {volumeMuted ? 'translateX(-200px)' : 'none'}"
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
  {/if}

  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    bind:value={inputValue}
    on:change={update}
    disabled={disabledInput}
  />

  {#if restartable}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="replay-svg"
      fill="#dedede"
      stroke="#dedede"
      stroke-width="20"
      stroke-linejoin="round"
      stroke-linecap="round"
      on:click={restart}
      on:pointerover={() => (replaySvgFocuse = true)}
      on:pointerout={() => (replaySvgFocuse = false)}
      role="button"
      tabindex="0"
      aria-label="Replay"
      style={voiceMuted
        ? 'opacity: 0.5; transform: none; fill: #dedede; stroke: #dedede; cursor: not-allowed;'
        : ''}
    >
      <g
        style="transform: {replaySvgFocuse && !voiceMuted
          ? 'rotate(-15deg)'
          : 'none'}"
      >
        <path
          d="
            M -70 -40
            A 80 80 0 1 1 -50 50
          "
          fill="none"
        />
        <polygon
          points="
            -70 -40 -70 -80 -30 -50
          "
        />
      </g>
      <line
        x1="0"
        y1="-5"
        x2="0"
        y2="-50"
        style="transform: {replaySvgFocuse && !voiceMuted
          ? 'rotate(-360deg)'
          : 'none'}"
      />
      <line
        x1="2.5"
        y1="-2.5"
        x2="20"
        y2="10"
        style="transform: {replaySvgFocuse && !voiceMuted
          ? 'rotate(-30deg)'
          : 'none'}"
      />
    </svg>
  {/if}
</div>

<style>
  div {
    height: 3.5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5vw 1vw;
    gap: 1vw;
    background-color: rgba(1, 0, 32, 0.5);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 1em;
  }

  svg {
    height: 1.5vw;
    width: 1.5vw;
  }

  input {
    cursor: pointer;
    height: 0.5vw;
    width: 7.5vw;
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media screen and (max-width: 600px) {
    div {
      height: 2.5em;
      padding: 0.5em;
      border-radius: 0.5em;
      gap: 0.5em;
      box-shadow: inset 0 0 0.5vw #010020;
      background-color: rgba(1, 0, 32, 0.35);
      border: none;
    }

    svg {
      height: 1.25em;
      width: 1.25em;
    }

    input {
      height: 1vw;
      width: 26vw;
    }
  }

  @media screen and (min-width: 1280px) {
    div {
      height: 3rem;
      padding: 0.5rem 1rem;
      gap: 1rem;
      border-width: 0.05rem;
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    input {
      width: 7.5rem;
    }
  }
</style>
