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
  class="navigation-tab dream-tab"
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
  aria-label="Profile"
  href={$user ? `/c/${$user.username ?? 'unknown'}` : '/dashboard#/dashboard'}
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

<style lang="scss">
  @use '/src/styles/mixins' as *;

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
      margin-left: auto;
      flex-direction: row-reverse;
      fill: $light-blue;

      svg {
        width: 2rem;
        padding: 0.25rem;
      }

      img,
      .avatar-initial {
        width: 2rem;
      }

      .avatar-initial {
        font-size: 1.5rem;
      }
    }
  }
</style>
