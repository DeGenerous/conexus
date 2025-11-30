<script lang="ts">
  import Authentication from '@lib/authentication';
  import { showProfile } from '@stores/modal.svelte';
  import { user, approvedTester } from '@stores/account.svelte';
  import { redirectTo } from '@utils/route-guard';
  import { blankImage, serveUrl } from '@constants/media';
  import { resolveRenderableImage } from '@utils/file-validation';
  import { getAvatarInitial } from '@utils/avatar';

  import DreamSVG from '@components/icons/Dream.svelte';

  let { activeTab }: { activeTab: string } = $props();

  let authentication: Authentication = new Authentication();

  let svgFocus = $state<boolean>(false);

  let avatarUrl = $state<string>('');
  let avatarFileId = $state<string>('');
  let avatarImage = $state<string>(blankImage);
  let avatarInitial = $state<string>('');

  $effect(() => {
    if ($user) {
      avatarUrl = $user.avatar_url || '';
      avatarFileId = $user.avatar_file_id || '';
      avatarInitial = getAvatarInitial($user.username);
    } else {
      avatarUrl = '';
      avatarFileId = '';
      avatarInitial = '';
    }
  });

  $effect(() => {
    const candidate = avatarFileId
      ? serveUrl(avatarFileId)
      : avatarUrl
        ? avatarUrl
        : '';

    if (!candidate) {
      avatarImage = blankImage;
      return;
    }

    resolveRenderableImage(candidate)
      .then((res) => {
        avatarImage = res;
      })
      .catch(() => {
        avatarImage = blankImage;
      });
  });
</script>

<a
  class="navigation-tab dream-tab pc-only"
  class:active={activeTab === 'Dashboard'}
  class:inactive={!$approvedTester}
  aria-label="Dream"
  href="/dashboard#/dream/create"
  onclick={(event) => {
    event.preventDefault();
    if (!$user) {
      $showProfile = true;
    } else {
      redirectTo('/dashboard#/dream/create');
    }
  }}
>
  <DreamSVG />
  <p>Dream</p>
</a>

<a
  class="navigation-tab dream-tab mobile-only"
  class="navigation-tab dream-tab pc-only"
  class:active={activeTab === 'Dashboard'}
  class:inactive={!$approvedTester}
  aria-label="Dream"
  href="/dashboard#/dream/create"
  onclick={(event) => {
    event.preventDefault();
    if (!$user) {
      $showProfile = true;
    } else {
      redirectTo('/dashboard#/dream/create');
    }
  }}
>
  <DreamSVG />
  <p>Dream</p>
</a>

<a
  class="navigation-tab dream-tab mobile-only"
  class:active={activeTab === 'Dashboard'}
  class:inactive={!$approvedTester}
  aria-label="Dashboard"
  href="/dashboard#/dashboard"
  onclick={(event) => {
    if (!$user) {
      event.preventDefault();
      $showProfile = true;
    }
  }}
>
  <DreamSVG />
  <p>Dashboard</p>
</a>

<a
  class="navigation-tab profile-tab"
  class:active={activeTab === $user?.username}
  class:inactive={!$approvedTester}
  class:nopadding={!!$user}
  aria-label="Profile"
  href={$user ? `/c/${$user.username!}` : '/dashboard#/dashboard'}
  onclick={(event) => {
    if (!$user) {
      event.preventDefault();
      $showProfile = true;
    }
  }}
  onpointerover={() => (svgFocus = true)}
  onpointerout={() => (svgFocus = false)}
>
  {#if $user}
    {#if avatarFileId || avatarUrl}
      <img src={avatarImage} alt="PFP" />
    {:else if avatarInitial}
      <div class="avatar-initial" aria-label="Profile initial">
        {avatarInitial}
      </div>
    {:else}
      <img src={avatarImage} alt="PFP" />
    {/if}
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-75 -75 150 150"
      aria-label="Profile"
    >
      <circle cy="-25" r="30" />
      <path d="M -55 55 Q -60 20 -25 15 L 25 15 Q 60 20 55 55 Z" />
    </svg>
  {/if}
  <p>Profile</p>
</a>

{#if $user}
  <span
    class="dropdown flex transition"
    class:visible={svgFocus}
    onpointerover={() => (svgFocus = true)}
    onpointerout={() => (svgFocus = false)}
  >
    <a
      class="nohover-link"
      href="/dashboard#/dashboard"
      onclick={(event) => {
        event.preventDefault();
        redirectTo('/dashboard#/dashboard');
      }}
    >
      Dashboard
    </a>
    <a
      class="nohover-link"
      href="/dashboard#/profile/overview"
      onclick={(event) => {
        event.preventDefault();
        redirectTo('/dashboard#/profile/overview');
      }}
    >
      Account
    </a>
    <a
      class="nohover-link"
      href="/dashboard#/profile/bookmarks"
      onclick={(event) => {
        event.preventDefault();
        redirectTo('/dashboard#/profile/bookmarks');
      }}
    >
      Bookmarks
    </a>
    <a
      class="nohover-link"
      href="/dashboard#/profile/settings"
      onclick={(event) => {
        event.preventDefault();
        redirectTo('/dashboard#/profile/settings');
      }}
    >
      Settings
    </a>
    {#if $user?.wallets?.filter((wallet) => !wallet.faux).length}
      <a
        class="nohover-link"
        href="/dashboard#/omnihub"
        onclick={(event) => {
          event.preventDefault();
          redirectTo('/dashboard#/omnihub');
        }}
      >
        OmniHub
      </a>
    {/if}
    <a
      class="nohover-link"
      href="/"
      onclick={(event) => {
        event.preventDefault();
        authentication.logout();
      }}
    >
      Sign Out
    </a>
  </span>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .dream-tab {
    &.pc-only {
      display: none;
    }

    &.mobile-only {
      display: flex;
    }

    @include respond-up('small-desktop') {
      &.pc-only {
        display: flex;
        margin-left: auto;
      }

      &.mobile-only {
        display: none;
      }
    }
  }

  .profile-tab {
    img,
    .avatar-initial {
      width: 2rem;
      border-radius: 50%;
      aspect-ratio: 1 / 1;
    }

    .avatar-initial {
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      text-transform: uppercase;
      @include cyan;
      @include dark-blue(1, text);
    }

    @include respond-up('small-desktop') {
      padding: 0.5rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      fill: $light-blue;
      @include navy(0.5);

      img,
      .avatar-initial {
        width: 100%;
      }

      .avatar-initial {
        font-size: 1.5rem;
      }

      &.nopadding {
        padding: 0;
      }

      p {
        display: none;
      }

      &:hover,
      &:active,
      &:focus-visible {
        fill: $cyan;
        @include dark-blue;
      }
    }
  }

  .dropdown {
    position: absolute;
    top: 3rem;
    right: -1rem;
    min-height: 3.5rem;
    width: 12rem;
    padding-top: 1.5rem;
    gap: 0;
    border-bottom-left-radius: 0.5rem;
    background-color: $dark-blue;
    fill: $cyan !important;
    opacity: 0;
    transform: translateX(100%);
    z-index: -1;
    @include box-shadow;

    &.visible {
      opacity: 1;
      transform: translateX(0);
    }

    a {
      width: 100%;
      border-radius: 0.5rem;
      padding: 0.5rem 1.5rem;
      text-decoration: none;
      @include white-txt;

      &:hover,
      &:active,
      &:focus-visible {
        @include navy;
        @include cyan(1, text);
      }
    }
  }
</style>
