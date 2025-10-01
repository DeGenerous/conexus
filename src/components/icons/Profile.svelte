<script lang="ts">
  import { showProfile } from '@stores/modal.svelte';

  let {
    activeTab,
    user,
  }: {
    activeTab: string;
    user: Nullable<User>;
  } = $props();

  let svgFocus = $state<boolean>(false);
</script>

<a
  class="navigation-tab dashboard-tab"
  class:active={activeTab === 'Dashboard'}
  id="profile-icon"
  aria-label="Profile"
  href="/dashboard"
  onclick={(event) => {
    if (!user) {
      event.preventDefault();
      $showProfile = true;
    }
  }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-75 -75 150 150"
    aria-label="Profile"
  >
    <circle cy="-25" r="30" />
    <path d="M -55 55 Q -60 20 -25 15 L 25 15 Q 60 20 55 55 Z" />
  </svg>
  <p>Dashboard</p>
</a>

<div
  class="credits-tab flex-row gap-8 transition"
  onpointerover={() => (svgFocus = true)}
  onpointerout={() => (svgFocus = false)}
>
  <h4>
    Credits:
    {#if user}
      {user.credits}
    {:else}
      ...
    {/if}
  </h4>

  <span class="flex transition" class:visible={svgFocus}>
    <a href="/dashboard#/profile/overview" target="_self">Profile</a>
    <a href="/dashboard#/profile/bookmarks" target="_self">Bookmarks</a>
  </span>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .credits-tab {
    display: none;
    position: relative;
    height: 2.5rem;
    min-width: 10rem;
    padding-inline: 0.5rem;
    border-radius: 0.5rem;
    color: $cyan;
    @include cyan(0.1);

    h4 {
      font-size: 28px;
      line-height: 1;
      color: inherit;
    }

    span {
      position: absolute;
      top: calc(100% - 1rem);
      top: 100%;
      right: -1rem;
      min-height: 3.5rem;
      width: 12rem;
      gap: 0;
      padding-top: 1rem;
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
        &:focus {
          @include navy;
          @include cyan(1, text);
        }
      }
    }

    &:hover,
    &:active,
    &:focus {
      color: $dark-blue;
      @include cyan;
    }

    @include respond-up(small-desktop) {
      display: flex;
    }
  }
</style>
