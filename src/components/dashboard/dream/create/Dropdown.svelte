<script>
  export let name;
  let isOpen = false;

  const toggleDropdown = () => {
    isOpen = !isOpen;
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section class="blur">
  <div
    class="buttons-wrapper"
    on:click={toggleDropdown}
    role="button"
    tabindex="0"
  >
    <h2 style={isOpen ? 'color: rgb(51, 226, 230)' : ''}>{name}</h2>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-100 -100 200 200"
      class="option-selector-svg"
      fill={isOpen ? 'rgb(51, 226, 230)' : '#dedede'}
      stroke={isOpen ? 'rgb(51, 226, 230)' : '#dedede'}
      stroke-width="20"
      stroke-linecap="round"
      stroke-linejoin="round"
      transform={isOpen ? 'rotate(180)' : ''}
    >
      <polygon
        class="option-selector-icon"
        points="
          -40 -90 -40 90 50 0
        "
        transform="rotate(90)"
      />
    </svg>
  </div>
  {#if isOpen}
    <div class="container">
      <slot />
    </div>
  {/if}
</section>

<style>
  section {
    width: 95vw;
    background-color: rgba(36, 65, 189, 0.5);
    box-shadow: 0 0.25vw 0.5vw #010020;
    padding: 0.5vw;
    border-radius: 1.75vw;
  }

  .buttons-wrapper {
    width: 100%;
    padding-block: 1vw;
  }

  .buttons-wrapper:hover,
  .buttons-wrapper:active {
    filter: brightness(125%);
  }

  .container {
    width: 100%;
    animation: fadeIn 0.6s ease-in-out forwards;
    background-color: rgba(1, 0, 32, 0.5);
  }

  @media only screen and (max-width: 600px) {
    section {
      width: 100vw;
      border-radius: 0;
    }

    .container {
      border-radius: 0;
    }
  }
</style>
