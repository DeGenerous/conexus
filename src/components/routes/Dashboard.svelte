<script lang="ts">
  import { onMount } from 'svelte';

  import { Account } from '@lib/account';
  import { getCurrentUser } from '@utils/route-guard';
  import { referralCodes } from '@stores/account.svelte';
  import { showProfile } from '@stores/modal.svelte';
  import openModal from '@stores/modal.svelte';
  import { referralActivationNotice, refreshDataModal } from '@constants/modal';
  import { ClearCache } from '@constants/cache';
  import { toastStore } from '@stores/toast.svelte';

  import DoorSVG from '@components/icons/Door.svelte';
  import CopySVG from '@components/icons/Copy.svelte';
  import ResetSVG from '@components/icons/Reset.svelte';

  const account: Account = new Account();

  let user: Nullable<User> = $state(null);
  let subStatus = $state<Nullable<SubscriptionStatus>>(null);

  let loading = $state<boolean>(true);
  let copySvgFocus = $state<Nullable<string>>(null);

  onMount(async () => {
    user = await getCurrentUser();
    if (account && user && user.email_confirmed) {
      account.getReferralCodes();
      checkSubscription();
    }
    loading = false;
  });

  const copyRefCode = (refCode: string) => {
    let codeBtn = document.getElementById(refCode) as HTMLButtonElement;
    navigator.clipboard.writeText(refCode);
    codeBtn.classList.add('copied'); // animation
    setTimeout(() => codeBtn.classList.remove('copied'), 600);
  };

  const checkSubscription = async () => {
    subStatus = await account.subscriptionStatus();
  };

  const dateToString = (date: Date) => {
    const dateObject: Date = new Date(date);

    const day: string = ('0' + dateObject.getDate()).slice(-2);
    const month: string = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const year: number = dateObject.getFullYear();

    const fullDate: string = `${day}.${month}.${year}`;
    return fullDate;
  };
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
  {#if user.email && user.first_name && user.email_confirmed}
    <!-- REFERRAL CODES -->
    <section class="ref-codes-wrapper container">
      {#if $referralCodes !== null}
        {#if $referralCodes.filter((code) => code.is_used).length == 10}
          <h4 class="text-glowing">🏆 You've unlocked all 10 referrals 🚀</h4>
          <p class="text-glowing">
            Your early support won't go unnoticed. Stay tuned for updates.
          </p>
        {:else}
          {#key $referralCodes}
            <h4>Your referral codes</h4>
            <ul class="referral-codes flex-row">
              {#each $referralCodes as code}
                <button
                  class="ref-code void-btn flex-row pad-8 round-8 dark-txt fade-in"
                  class:used-code={code.is_used}
                  id={code.code}
                  onclick={() => copyRefCode(code.code)}
                  onpointerover={() => (copySvgFocus = code.code)}
                  onfocus={() => (copySvgFocus = code.code)}
                  onpointerout={() => (copySvgFocus = null)}
                  onblur={() => (copySvgFocus = null)}
                  aria-label="Copy code {code.code}"
                  tabindex={code.is_used ? -1 : 0}
                >
                  <p class="pad-8 round-8 soft-white-txt transparent-dark-bg">
                    {code.code}
                  </p>
                  {#if !code.is_used}
                    <CopySVG {copySvgFocus} data={code.code} />
                  {/if}
                </button>
              {/each}
            </ul>
            <h4>
              Your referrals: {$referralCodes.filter((code) => code.is_used)
                .length} / 10
            </h4>
          {/key}
        {/if}
      {:else}
        <button
          onclick={() => {
            if (!user?.referred) {
              openModal(
                referralActivationNotice,
                'Proceed',
                () => (window.location.href = '/referral'),
              );
              return;
            }
            account.generateReferralCode().then(() => window.location.reload());
          }}
        >
          Get referral codes
        </button>
      {/if}
    </section>
  {/if}

  <!-- NEWSLETTER SUBSCRIPTION -->
  {#if user.email_confirmed}
    <section class="newsletter container">
      {#if subStatus}
        {#if subStatus.is_active}
          <h4>Newsletter Subscription</h4>

          {#if subStatus.subscribed_at}
            <h5
              class="subscription pad-8 round-8 transparent-gray-bg dark-txt shad fade-in"
            >
              Active since: {dateToString(subStatus.subscribed_at.Time)}
            </h5>
          {/if}
          <button
            class="unsubscribe-button void-btn min-size-btn"
            onclick={() => {
              account.unsubscribeNewsletter().then(() => checkSubscription());
            }}
          >
            Unsubscribe
          </button>
        {:else}
          <h4>Subscribe to Newsletter:</h4>
          <button
            class="green-btn"
            onclick={() => {
              account.subscribeNewsletter().then(() => checkSubscription());
            }}
          >
            Subscribe
          </button>
        {/if}
      {/if}
    </section>

    <ResetSVG
      onclick={() => {
        openModal(refreshDataModal, 'Refresh', () => {
          ClearCache('full');
          toastStore.show(
            'The cache has been reset. Fresh data will be fetched when needed.',
            'info',
          );
          account.getReferralCodes();
        });
      }}
      text="Refresh Data"
    />
  {/if}
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
    max-width: min(95%, 80rem);

    @include respond-up(small-desktop) {
      width: auto;
    }

    &.ref-codes-wrapper {
      width: auto;

      .referral-codes {
        flex-wrap: wrap;

        .ref-code {
          width: 100%;
          gap: 0.5rem;
          background-color: $deep-green;
          @include box-shadow;

          &:hover:not(.used-code),
          &:active:not(.used-code),
          &:focus:not(.used-code) {
            @include scale-up(soft);
            @include bright;
            @include box-shadow(deep);
          }

          p {
            width: 100%;
            @include box-shadow(soft, inset);
          }

          &.used-code {
            cursor: not-allowed;
            @include gray(0.25);

            p {
              @include white-txt(0.5);
            }
          }

          @include respond-up(tablet) {
            width: auto;
          }
        }
      }
    }

    &.newsletter {
      padding-inline: 2rem;

      .subscription {
        background-color: $deep-green;
        @include white-txt;
      }

      .unsubscribe-button {
        width: auto;
        height: auto;
        @include red(0.5, text);

        &:hover,
        &:active,
        &:focus {
          text-decoration: underline;
          @include red(1, text);
        }
      }
    }
  }
</style>
