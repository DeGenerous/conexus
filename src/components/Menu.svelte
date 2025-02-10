<script lang="ts">
  import { authenticated } from '@stores/account';
  import { showProfile } from '@stores/modal';

  import Intro from './Intro.svelte';

  let isLogged: boolean = false;
  let signInSvgFocus: boolean = false;

  authenticated.subscribe((value) => {
    isLogged = value.loggedIn;
  });
</script>

<!-- Logged In -->

{#if isLogged}
  <Intro />
{:else}
  <section class="blur">
    <h3>Please</h3>
    <button
      on:click={() => ($showProfile = true)}
      on:pointerover={() => (signInSvgFocus = true)}
      on:pointerout={() => (signInSvgFocus = false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        class="door-svg"
        fill="none"
        stroke="#dedede"
        stroke-width="12"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="stroke: {signInSvgFocus ? 'rgb(51, 226, 230)' : '#dedede'}"
      >
        <defs>
          <mask id="door-svg-mask">
            <rect
              x="-25"
              y="-75"
              width="100"
              height="150"
              rx="15"
              fill="none"
              stroke="white"
            />
            <line
              x1="-25"
              y1="-35"
              x2="-25"
              y2="35"
              stroke="black"
              stroke-width="14"
              stroke-linecap="square"
            />
          </mask>
        </defs>

        <path
          style="transform: {signInSvgFocus ? 'translateX(10%)' : 'none'}"
          d="
            M -80 0
            L 30 0
            L 5 -25
            M 30 0
            L 5 25
          "
          fill="none"
        />
        <rect
          x="-25"
          y="-75"
          width="100"
          height="150"
          rx="15"
          mask="url(#door-svg-mask)"
        />
      </svg>
      Sign in your Profile
    </button>
    <h3>to access stories.</h3>
  </section>
{/if}

<style>
  section {
    width: 50vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
    padding: 2vw;
    background-color: rgba(1, 0, 32, 0.75);
    border-radius: 1.5vw;
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.5),
      0 0 0.5vw #010020;
  }

  @media only screen and (max-width: 600px) {
    section {
      width: 95%;
      gap: 0.5em;
      padding: 1em;
      border-radius: 1em;
    }
  }
</style>
