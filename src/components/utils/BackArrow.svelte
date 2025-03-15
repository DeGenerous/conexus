<script lang="ts">
  export let href: string = './';

  const navigateBack = () => {
    window.history.back();
  };

  let backArrowSvgFocus: boolean = false;
</script>

{#if href === 'back'}
  <button class="icon arrow" on:click={navigateBack} aria-label="Back arrow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="circle-icon"
    >
      <defs>
        <mask id="back-arrow-svg-mask">
          <circle r="95" fill="white" />
          <path
            class="back-arrow-svg-mask"
            transform={backArrowSvgFocus ? 'scale(1.1)' : ''}
            d="
              M -14 -30
              L -14 -64
              L -76 -9
              L -14 48
              L -14 12
              Q 36 14 60 52
              Q 60 -26 -12 -30
              Z
            "
            fill="black"
            stroke="black"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </mask>
      </defs>

      <circle
        class="back-arrow-svg"
        r="95"
        fill="rgba(51, 226, 230, 0.75)"
        mask="url(#back-arrow-svg-mask)"
        on:pointerover={() => (backArrowSvgFocus = true)}
        on:pointerout={() => (backArrowSvgFocus = false)}
      />
    </svg>
  </button>
{:else}
  <a class="icon arrow" {href} aria-label="Back arrow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="circle-icon"
    >
      <defs>
        <mask id="back-arrow-svg-mask">
          <circle r="95" fill="white" />
          <path
            class="back-arrow-svg-mask"
            transform={backArrowSvgFocus ? 'scale(1.1)' : ''}
            d="
            M -14 -30
            L -14 -64
            L -76 -9
            L -14 48
            L -14 12
            Q 36 14 60 52
            Q 60 -26 -12 -30
            Z
          "
            fill="black"
            stroke="black"
            stroke-width="4"
            stroke-linejoin="round"
          />
        </mask>
      </defs>

      <circle
        class="back-arrow-svg"
        r="95"
        fill="rgba(51, 226, 230, 0.75)"
        mask="url(#back-arrow-svg-mask)"
        on:pointerover={() => (backArrowSvgFocus = true)}
        on:pointerout={() => (backArrowSvgFocus = false)}
      />
    </svg>
  </a>
{/if}

<style>
  a {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a svg {
    cursor: inherit;
  }
</style>
