<script lang="ts">
  import { onMount } from 'svelte';

  import Account from '@lib/account';
  import { showProfile } from '@stores/modal.svelte';

  import DoorSVG from '@components/icons/Door.svelte';

  let user: Nullable<User> = $state(null);
  let noWalletDetected = $state<boolean>(false);

  let loading = $state<boolean>(true);

  onMount(async () => {
    user = await Account.getUser();
    if (user) {
      // Show 'Connect Wallet' preview if there is no wallets connected
      const { wallets } = user;
      const allWallets = wallets
        ?.filter((wallet) => !wallet.faux)
        .map(({ wallet }) => wallet);
      if (!allWallets?.length) noWalletDetected = true;
    }

    loading = false;
  });
</script>

<section class="transparent-container flex-row flex-wrap">
  <h5 class="learn-label">
    Explore Platform Knowledge{#if !user}&nbsp(No Sign-In Needed){/if}
  </h5>
  <a class="button-anchor purple-btn" href="/learn"> Learn & Explore </a>
</section>

{#if loading}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{:else if user}
  <section class="omnihub transparent-container flex-row flex-wrap">
    <span class="opaque-container fade-in">
      {#if noWalletDetected}
        <h5>
          Connect a wallet to activate OmniHub and access your assets, identity,
          and tools.
        </h5>
        <button class="button-glowing" onclick={() => ($showProfile = true)}>
          Open Your Profile
        </button>
      {:else}
        <p class="text-glowing">
          Track what you’ve earned. Decide who you become. OmniHub holds the
          keys.
        </p>
        <a class="button-anchor button-glowing" href="/omnihub">
          Enter the OmniHub
        </a>
        <p class="text-glowing">
          The archive of action. The forge of identity.
        </p>
      {/if}
    </span>
    <img
      class="fade-in"
      src="/omnihub/quarchon.avif"
      alt="Potential - Quarchon"
    />
  </section>
{:else}
  <section class="container">
    <h4 class="text-glowing">This Part of the Realm Is Yours to Unlock</h4>
    <DoorSVG
      state="inside"
      text="Sign in to view your dashboard"
      onclick={() => {
        $showProfile = true;
      }}
      glow={true}
    />
  </section>
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .learn-label {
    &::after {
      content: ':';
    }
  }

  section {
    @include auto-width;

    @include respond-up(small-desktop) {
      width: auto;
    }

    &.omnihub {
      padding-bottom: 0;
      background-image: url('/omnihub/anchor-bg.avif');
      background-position: bottom;
      background-size: contain;

      span {
        width: 100%;
      }

      img {
        width: 20rem;
      }

      @include respond-up(small-desktop) {
        span {
          width: auto;
        }
      }

      @include respond-up(large-desktop) {
        margin-inline: 0;
        padding-top: 2rem;

        span {
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>
