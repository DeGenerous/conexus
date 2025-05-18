<script lang="ts">
  import DoorSVG from '@components/icons/Door.svelte';
  import { trailerURL } from '@constants/media';
  import { authenticated, userCheck } from '@stores/account';
  import { showProfile } from '@stores/modal';

  import Intro from './Intro.svelte';

  let isLogged: boolean = false;
  let signInSvgFocus: boolean = false;

  authenticated.subscribe((value) => {
    isLogged = value.loggedIn;
  });
</script>

<!-- Logged In -->

{#if $userCheck}
  <img class="loading-icon" src="/icons/loading.png" alt="Loading" />
{:else if isLogged}
  <Intro />
{:else}
  <video class="blur pc-video" controls autoplay loop muted>
    <source src={`${trailerURL}/CoNexusTrailer.webm`} type="video/webm" />
    <source src={`${trailerURL}/CoNexusTrailer.mp4`} type="video/mp4" />
    <track kind="captions" />
  </video>

  <video class="blur mobile-video" controls autoplay loop muted>
    <source src={`${trailerURL}/CoNexusTrailerMobile.webm`} type="video/webm" />
    <source src={`${trailerURL}/CoNexusTrailerMobile.mp4`} type="video/mp4" />
    <track kind="captions" />
  </video>

  <button
    class="blur"
    on:click={() => ($showProfile = true)}
    on:pointerover={() => (signInSvgFocus = true)}
    on:pointerout={() => (signInSvgFocus = false)}
  >
    <DoorSVG state="inside" {signInSvgFocus} />
    PLAY NOW
  </button>
{/if}

<style>
  /* video {
    width: 75vw;
    background-color: rgba(1, 0, 32, 0.75);
    border-radius: 1.5vw;
    padding: 0.25vw;
    box-shadow:
      inset 0 0 0.5vw rgba(51, 226, 230, 0.5),
      0 0 0.5vw #010020;
  }

  .pc-video {
    display: block;
  }

  .mobile-video {
    display: none;
  }

  .loading-icon {
    height: 13.1vw;
  }

  @media only screen and (max-width: 600px) {
    video {
      width: 90%;
      padding: 0;
      border-radius: 1em;
    }

    .pc-video {
      display: none;
    }

    .mobile-video {
      display: block;
    }

    .loading-icon {
      height: 32vw;
    }
  } */
</style>
