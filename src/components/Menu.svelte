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
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else if isLogged}
  <Intro />
{:else}
  <video class="pc-video blur round fade-in shad" controls autoplay loop muted>
    <source src={`${trailerURL}/CoNexusTrailer.webm`} type="video/webm" />
    <source src={`${trailerURL}/CoNexusTrailer.mp4`} type="video/mp4" />
    <track kind="captions" />
  </video>

  <video class="mobile-video blur round fade-in shad" controls autoplay loop muted>
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
    play now
  </button>
{/if}

<style lang="scss">
  @use "/src/styles/mixins" as *;

  video {
    display: none;
    width: clamp(250px, 95%, 70rem);
  }

  .mobile-video {
    display: block;
  }

  .pc-video {
    display: none;
  }

  @include respond-up(tablet) {
    .mobile-video {
      display: none;
    }

    .pc-video {
      display: block;
    }
  }
</style>
