<script lang="ts">
  import { authenticated } from '@stores/account';
  import { showProfile } from '@stores/modal';

  import Intro from './Intro.svelte';
  import DoorSVG from '@components/icons/Door.svelte';

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
      <DoorSVG state="inside" {signInSvgFocus} />
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
