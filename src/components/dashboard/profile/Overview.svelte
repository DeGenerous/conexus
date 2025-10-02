<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import { removeWallethModal } from '@constants/modal';
  import {
    regexpPasswordValidation,
    regexpLengthCheck,
    regexpCapitalLetterCheck,
    regexpLowercaseLetterCheck,
    regexpNumberCheck,
    regexpSpecialCharCheck,
    regexpRestrictedCharsCheck,
  } from '@constants/regexp';
  import Account from '@lib/account';
  import Authentication from '@lib/authentication';
  import { accountError } from '@stores/account.svelte';
  import openModal from '@stores/modal.svelte';
  import passwordVisible from '@stores/password-visibility.svelte';
  import { getCurrentUser } from '@utils/route-guard';
  import { refreshDataModal } from '@constants/modal';
  import { toastStore } from '@stores/toast.svelte';
  import { ClearCache } from '@constants/cache';

  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import ResetSVG from '@components/icons/Reset.svelte';
  import WalletConnect from '@components/web3/WalletConnect.svelte';

  // SIGNED IN USER PROFILE

  const account: Account = new Account();
  const authentication: Authentication = new Authentication();

  let user = $state<Nullable<User>>(null);
  let subscribedToNewsletter = $state<boolean>(false);

  onMount(async () => {
    user = await getCurrentUser();
    console.log(user);

    if (user && user.email_confirmed) {
      // account.getReferralCode();
      checkSubscription();
    }
  });

  const checkSubscription = async () => {
    if (!user?.email) return;
    subscribedToNewsletter = await account.subscriptionStatus(user?.email);
  };

  // Change password
  let editingPassword = $state<boolean>(false);
  let editOldPassword = $state<string>('');
  let editPassword = $state<string>('');
  let editPasswordConfirm = $state<string>('');

  const saveChangedPassword = async (e: Event) => {
    e.preventDefault();
    $accountError = null as AccountError; // reset storage from any old errors
    await account.changePassword({
      old_password: editOldPassword,
      new_password: editPassword,
    });
    if (!$accountError || !$accountError.changePassword)
      editingPassword = false;
    editPassword = '';
    editPasswordConfirm = '';
  };

  const openRemoveWalletModal = (id: string) =>
    openModal(removeWallethModal, 'Remove', () =>
      console.log('Remove wallet ID: ' + id),
    );
</script>

{#if user}
  <section class="flex">
    <header class="flex-row">
      {#if user.credits > 0}
        <p>
          Credits remaining this month:
          <strong>
            {user.credits}
          </strong>
        </p>
      {:else}
        <p class="validation">Error fetching credits...</p>
      {/if}
      <DoorSVG
        state="outside"
        text="Sign out"
        onclick={() => authentication.logout()}
      />
    </header>

    {#if user.email && user.first_name}
      <hr />

      <h4>Account</h4>

      <form class="flex">
        <div class="input-container">
          <label for="mail">Email</label>
          <input id="mail" type="email" value={user.email} disabled />
        </div>
        {#if !user.email_confirmed && !user.is_oauth}
          <p class="validation">Please check your inbox and confirm email</p>
        {/if}
        <div class="input-container">
          <label for="first-name">First name</label>
          <input
            id="first-name"
            type="text"
            value={user.first_name}
            disabled={true}
          />
        </div>
        <div class="input-container">
          <label for="last-name">Last name</label>
          <input
            id="last-name"
            type="text"
            value={user.last_name}
            disabled={true}
          />
        </div>

        {#if editingPassword}
          <div class="input-container">
            <label for="password">Old password</label>
            <input
              id="password"
              class:red-border={!editOldPassword}
              type={passwordVisible.edit ? 'text' : 'password'}
              placeholder="Enter old password"
              bind:value={editOldPassword}
            />
          </div>

          {#if !editOldPassword}
            <p class="validation">Please enter your old password</p>
          {/if}

          <div class="input-container">
            <label for="new-password">New password</label>
            <input
              id="new-password"
              class:red-border={!regexpPasswordValidation.test(editPassword)}
              type={passwordVisible.edit ? 'text' : 'password'}
              placeholder="Provide new password"
              bind:value={editPassword}
            />
            <EyeSVG visibility="edit" />
          </div>
          <input
            class:red-border={!regexpPasswordValidation.test(editPassword) ||
              editPassword !== editPasswordConfirm}
            type={passwordVisible.edit ? 'text' : 'password'}
            placeholder="Confirm new password"
            bind:value={editPasswordConfirm}
          />

          {#if editPassword}
            {#if !regexpRestrictedCharsCheck.test(editPassword)}
              <p class="validation">
                Password contains a restricted character!
              </p>
            {:else if !regexpLengthCheck.test(editPassword)}
              <p class="validation">
                Password should contain 8 - 24 characters
              </p>
            {/if}

            {#if !regexpSpecialCharCheck.test(editPassword)}
              <p class="validation">
                Provide at least one special character: @ $ ! % * # ? & , .
              </p>
            {/if}

            {#if !regexpCapitalLetterCheck.test(editPassword)}
              <p class="validation">Provide at least one capital letter</p>
            {/if}

            {#if !regexpLowercaseLetterCheck.test(editPassword)}
              <p class="validation">Provide at least one lowercase letter</p>
            {/if}

            {#if !regexpNumberCheck.test(editPassword)}
              <p class="validation">Provide at least one number</p>
            {/if}

            {#if editPasswordConfirm && editPassword !== editPasswordConfirm}
              <p class="validation">Passwords do not match!</p>
            {/if}
          {:else}
            <p class="validation">Please enter new password</p>
          {/if}

          {#if $accountError && $accountError.changePassword}
            <p class="validation">{$accountError.changePassword}</p>
          {/if}
        {/if}

        {#if !user.is_oauth}
          <div class="flex-row">
            {#if editingPassword}
              <button
                class="red-btn"
                type="button"
                onclick={() => (editingPassword = false)}
              >
                Cancel
              </button>
              <SaveSVG
                onclick={saveChangedPassword}
                disabled={!editPassword ||
                  !regexpPasswordValidation.test(editPassword) ||
                  editPassword !== editPasswordConfirm}
              />
            {:else}
              <button type="button" onclick={() => (editingPassword = true)}>
                Change password
              </button>
            {/if}
          </div>
        {/if}
      </form>

      <hr />
    {/if}

    {#key user}
      <div class="web3-wallets flex">
        {#if user.wallets && user.wallets.length >= 1}
          <h4>Connected Addresses</h4>
          <ul class="flex-row">
            {#each user.wallets.filter((address) => !address.faux) as { id, wallet }, index}
              <span class="wallet small-tile">
                <h4>{index + 1}</h4>
                <p class="pad-8 round-8 transparent-dark-bg soft-white-txt">
                  {wallet.slice(0, 6) + '...' + wallet.slice(-4)}
                </p>
                <CloseSVG
                  onclick={() => openRemoveWalletModal(id!)}
                  voidBtn={true}
                />
              </span>
            {/each}
          </ul>
          {#if user?.email && user?.first_name}
            <WalletConnect linking={true} title={'Add another address'} />
          {/if}

          {#if $accountError && $accountError.selectMainWallet}
            <p class="validation">{$accountError.selectMainWallet}</p>
          {/if}
        {:else}
          <WalletConnect linking={true} title={'Connect Web3 Wallet'} />
        {/if}
      </div>
      
    {/key}

    <hr />

    {#if user.email_confirmed}
      {#if subscribedToNewsletter}
        <button
          class="red-btn"
          onclick={() => {
            account
              .unsubscribeNewsletter(user?.email!)
              .then(() => checkSubscription());
          }}
        >
          Unsubscribe from Newsletter
        </button>
      {:else}
        <button
          class="green-btn"
          onclick={() => {
            account
              .subscribeNewsletter(user?.email!)
              .then(() => checkSubscription());
          }}
        >
          Subscribe to Newsletter
        </button>
      {/if}
    {/if}

    <ResetSVG
      onclick={() => {
        openModal(refreshDataModal, 'Refresh', () => {
          ClearCache('full');
          toastStore.show(
            'The cache has been reset. Fresh data will be fetched when needed.',
            'info',
          );
          account.getReferralCode();
        });
      }}
      text="Refresh Data"
    />
  </section>

  <!-- TODO: Add newsletter, refresh data button, referral codes (?) -->
{:else}
  <h5>Loading profile data...</h5>
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  section {
    width: 100%;

    header {
      width: 100%;
      justify-content: space-between;
    }

    .web3-wallets {
      ul {
        flex-wrap: wrap;
      }

      .wallet {
        min-width: 14rem;
        @include blue;

        h4 {
          @include dark-blue(1, text);
        }

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          @include bright;
        }

        &:disabled {
          cursor: not-allowed;
          fill: $cyan;
          box-shadow: $shadow-plus-inset-glow;
          @include blue(1, bg, bright);

          p,
          h4 {
            color: $cyan;
          }
        }
      }
    }
  }
</style>
