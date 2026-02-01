<script lang="ts">
  import { showProfile } from '@stores/modal.svelte';
  import { user, approvedTester } from '@stores/account.svelte';
  import { blankImage, serveUrl } from '@constants/media';
  import { resolveRenderableImage } from '@utils/file-validation';
  import { getAvatarInitial } from '@utils/avatar';

  let {
    activeTab,
    expanded = false,
    onclick,
    onpointerenter,
    onpointerleave,
  }: {
    activeTab: string;
    expanded?: boolean;
    onclick?: () => void;
    onpointerenter?: (event: PointerEvent) => void;
    onpointerleave?: (event: PointerEvent) => void;
  } = $props();

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

<button
  class="void-btn navigation-tab profile-tab"
  class:active={activeTab === $user?.username}
  class:inactive={!$approvedTester}
  aria-label={expanded ? 'Close menu' : 'Open menu'}
  aria-haspopup="true"
  aria-expanded={expanded}
  onclick={() => {
    if (!$user) {
      $showProfile = true;
      return;
    }
    onclick?.();
  }}
  {onpointerenter}
  {onpointerleave}
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
  <p class="pc-only">Profile</p>
  <span class="arrow icon" data-size="sm" aria-hidden="true"></span>
</button>

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

    .arrow {
      width: 0.5rem;
      aspect-ratio: 1 / 1;
      flex: none;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg);
    }

    &:hover .arrow {
      transform: scaleY(1.1) translateY(10%) rotate(45deg);
    }

    @include respond-up('small-desktop') {
      margin-left: auto;
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
