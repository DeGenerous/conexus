<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import { ensureMessage } from '@constants/modal';
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
  import { referralActivationNotice, refreshDataModal } from '@constants/modal';
  import { toastStore } from '@stores/toast.svelte';
  import { ClearCache } from '@constants/cache';
  import { blankImage, serveUrl } from '@constants/media';
  import { MEDIA_RULES, validateFiles } from '@utils/file-validation';
  import { toAvif } from '@utils/avif-convert';

  import WalletConnect from '@components/web3/WalletConnect.svelte';
  import Dropdown from '@components/utils/Dropdown.svelte';

  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import ResetSVG from '@components/icons/Reset.svelte';
  import CopySVG from '@components/icons/Copy.svelte';
  import EditSVG from '@components/icons/Edit.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  // SIGNED IN USER PROFILE

  const account: Account = new Account();
  const authentication: Authentication = new Authentication();

  let user = $state<Nullable<User>>(null);
  let subscribedToNewsletter = $state<boolean>(false);

  let editingUsername = $state<boolean>(false);
  let usernameInput = $state<string>('player_12345');

  let editingBio = $state<boolean>(false);
  let bioInput = $state<string>('');
  let avatarUrl = $state<string>(blankImage);
  let isUploadingAvatar = $state<boolean>(false);
  let avatarInputEl = $state<HTMLInputElement | undefined>();

  const checkSubscription = async () => {
    if (!user?.email) return;
    subscribedToNewsletter = await account.subscriptionStatus(user?.email);
  };

  onMount(async () => {
    user = await getCurrentUser(true);
    console.log(user);

    if (user && user.email_confirmed) checkSubscription();

    usernameInput = user?.username || '';
    bioInput = user?.avatar_bio || '';
    avatarUrl = user?.avatar_url || blankImage;
  });

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

  const copyRefCode = (code: string) => {
    let codeBtn = document.getElementById(code) as HTMLButtonElement;
    navigator.clipboard.writeText(code);
    codeBtn.classList.add('copied'); // animation
    setTimeout(() => codeBtn.classList.remove('copied'), 600);
    toastStore.show('Copied to clipboard: ' + code);
  };

  // Web3 wallets

  const openSelectWalletModal = (wallet_id: string) => {
    openModal(
      ensureMessage('select this wallet as the main address for your account'),
      'Select',
      () => selectMainWallet(wallet_id),
    );
  };

  const selectMainWallet = async (wallet_id: string) => {
    await authentication.selectMainWallet(wallet_id);
    user = await getCurrentUser(true);
  };

  const openRemoveWalletModal = (event: Event, wallet_id: string) => {
    event.stopPropagation();
    openModal(
      ensureMessage('unlink this wallet from your account'),
      'Unlink',
      () => unlinkWallet(wallet_id),
    );
  };

  const unlinkWallet = async (walletId: string) => {
    await authentication.unlinkWallet(walletId);
    user = await getCurrentUser(true);
  };

  // Profile picture upload and conversion to AVIF

  function shouldConvertAvatar(file: File): boolean {
    if (!file.type.startsWith('image/')) return false;
    return file.type !== 'image/avif';
  }

  const triggerAvatarPicker = () => avatarInputEl?.click();

  const refreshUserAvatar = async () => {
    user = await getCurrentUser(true);
    avatarUrl = user?.avatar_url || blankImage;
  };

  const handleAvatarUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    try {
      isUploadingAvatar = true;

      const accepted = await validateFiles('description', [input.files[0]], 0);

      const nextFile = accepted.at(0);
      if (!nextFile) return;

      let upload = nextFile;

      if (shouldConvertAvatar(nextFile)) {
        toastStore.show(`Converting ${nextFile.name} to AVIF format…`);
        try {
          const avif = await toAvif(nextFile);
          if (avif.size > MEDIA_RULES.description.maxBytes) {
            throw new Error('Converted image is larger than 1.5 MiB');
          }
          upload = new File([avif], nextFile.name.replace(/\.\w+$/, '.avif'), {
            type: 'image/avif',
          });
        } catch (err) {
          toastStore.show(String(err), 'error');
          return;
        }
      }

      await account.changeAvatar(undefined, upload);
      await refreshUserAvatar();
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      isUploadingAvatar = false;
      input.value = '';
    }
  };
</script>

{#if user}
  <header class="flex-row">
    <DoorSVG
      state="outside"
      text="Sign out"
      onclick={() => authentication.logout()}
    />
  </header>

  <img class="pfp round" src={serveUrl(avatarUrl)} alt="PFP" />
  <button
    onclick={triggerAvatarPicker}
    disabled={isUploadingAvatar}
    aria-busy={isUploadingAvatar}
  >
    {#if isUploadingAvatar}
      <LoadingSVG />
      Uploading...
    {:else}
      Change Profile Picture
    {/if}
  </button>
  <input
    bind:this={avatarInputEl}
    type="file"
    accept="image/avif,image/jpeg,image/png,image/webp"
    onchange={handleAvatarUpload}
    style:display="none"
  />

  <div class="dream-container">
    <div class="flex-row">
      <h4>Credits</h4>
      <div class="credits container">
        <span class="flex">
          <h5>
            Monthly:
            <strong>
              {user.credits} /
              {#if user.role_name === 'Guest'}
                10
              {:else if user.role_name === 'Player'}
                100
              {:else if user.role_name === 'Creator'}
                690
              {:else if user.role_name === 'Admin'}
                ∞
              {/if}
            </strong>
          </h5>
          <p class="caption">Included each month. Resets on the 1st.</p>
        </span>
        <span class="flex">
          <h5>
            Bonus: <strong>{user.bonus}</strong>
          </h5>
          <p class="caption">
            Extra credits from referrals or promos. Don’t reset.
          </p>
        </span>
      </div>
    </div>

    <div class="flex-row">
      <h4>Username</h4>
      <div class="container">
        {#if editingUsername}
          <CloseSVG
            onclick={() => {
              editingUsername = false;
              usernameInput = 'player_12345';
            }}
          />
        {/if}
        <input
          bind:value={usernameInput}
          type="text"
          placeholder="Enter your username"
          size={usernameInput.length + 1}
          maxlength="50"
          disabled={!editingUsername}
        />
        {#if editingUsername}
          <SaveSVG
            onclick={async () => {
              if (user?.username === usernameInput) {
                editingUsername = false;
                return;
              }
              await account.changeUsername(usernameInput);
              editingUsername = false;
            }}
            disabled={user?.username === usernameInput}
          />
        {:else}
          <EditSVG bind:editing={editingUsername} />
        {/if}
      </div>
    </div>

    {#if user.email_confirmed}
      {#await account.getReferralCode() then refCode}
        {#if refCode !== null}
          {#if refCode.usage_count >= refCode.max_usage}
            <h4 class="text-glowing">
              🏆 You've unlocked all {refCode.max_usage} referrals 🚀
            </h4>
            <p class="text-glowing">
              Your early support won't go unnoticed. Stay tuned for updates.
            </p>
          {:else}
            <div class="flex-row">
              <h4>Referral code</h4>
              <div class="container">
                <button
                  class="void-btn small-green-tile gap"
                  id={refCode.code}
                  onclick={() => copyRefCode(refCode.code)}
                  aria-label="Copy code {refCode.code}"
                >
                  <h5>Referrals: {refCode.usage_count}</h5>
                  <p>{refCode.code}</p>
                  <CopySVG data={refCode.code} />
                </button>
              </div>
            </div>
          {/if}
        {:else}
          <button
            class="green-btn"
            onclick={() => {
              if (!user?.referred) {
                openModal(
                  referralActivationNotice,
                  'Proceed',
                  () => (window.location.href = '/referral'),
                );
                return;
              }
              account
                .generateReferralCode()
                .then(() => window.location.reload());
            }}
          >
            Get referral code
          </button>
        {/if}
      {/await}
    {/if}

    <div class="flex-row">
      <span class="edit-wrapper flex">
        <h4>Creator Bio</h4>
        <span class="flex-row">
          {#if editingBio}
            <CloseSVG
              onclick={() => {
                editingBio = false;
                bioInput = user?.avatar_bio || '';
              }}
            />
            <SaveSVG
              onclick={async () => {
                if (user?.avatar_bio === bioInput) {
                  editingBio = false;
                  return;
                }
                await account.changeBio(bioInput);
                editingBio = false;
              }}
              disabled={user?.avatar_bio === bioInput}
            />
          {:else}
            <EditSVG bind:editing={editingBio} />
          {/if}
        </span>
      </span>
      <textarea
        id="description"
        class="dream-input dream-textfield"
        placeholder="Introduce yourself to the community..."
        rows="3"
        maxlength="300"
        bind:value={bioInput}
        disabled={!editingBio}
      ></textarea>
    </div>
  </div>

  {#if user.email && user.first_name}
    <Dropdown name="Account">
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

      {#if user.email_confirmed}
        {#if subscribedToNewsletter}
          <button
            class="unsubscribe-btn void-btn"
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
    </Dropdown>
  {/if}

  {#if user.wallets && user.wallets.length >= 1}
    <Dropdown name="Connected Addresses">
      <ul class="flex-row flex-wrap">
        {#each user.wallets.filter((address) => !address.faux) as { id, wallet }, index}
          <button
            class="wallet void-btn"
            class:small-blue-tile={user.main_wallet !== wallet}
            class:small-orange-tile={user.main_wallet === wallet}
            onclick={() => {
              if (wallet === user?.main_wallet) {
                toastStore.show(
                  'This wallet is already set as your main address',
                );
                return;
              }
              openSelectWalletModal(id!);
            }}
          >
            <h4>{index + 1}</h4>
            <p class="pad-8 round-8 transparent-dark-bg soft-white-txt">
              {wallet.slice(0, 6) + '...' + wallet.slice(-4)}
            </p>
            <CloseSVG
              onclick={(event) => openRemoveWalletModal(event, id!)}
              voidBtn={true}
              dark={wallet === user.main_wallet}
            />
          </button>
        {/each}
      </ul>
      {#if user?.email && user?.first_name}
        <WalletConnect linking={true} title={'Add another address'} />
      {/if}
    </Dropdown>
  {:else}
    <WalletConnect linking={true} title={'Connect Web3 Wallet'} />
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
{:else}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  header {
    width: 100%;
    justify-content: flex-end;

    @include mobile-only {
      margin-top: -3.5rem;
    }
  }

  .pfp {
    @include gray-border;

    @include respond-up(tablet) {
      width: 20rem;
    }
  }

  .dream-container {
    div {
      .container {
        justify-content: center;

        &.credits {
          @include white-txt;

          span {
            padding: 0.5rem;
            border-radius: 0.5rem;
            gap: 0.5rem;
            @include gray-border;

            &:first-of-type {
              @include orange(0.15);
            }

            &:last-of-type {
              @include deep-green(0.25);
            }

            p.caption {
              @include white-txt(soft);
              @include font(caption);
            }
          }
        }
      }
    }

    .edit-wrapper {
      flex-flow: row wrap;
      width: 14rem;
      gap: 1rem;

      @include respond-up(small-desktop) {
        flex-direction: column;
        align-items: flex-end;
      }

      h4 {
        width: auto;
      }
    }
  }

  .unsubscribe-btn {
    position: relative;
    text-decoration: none;
    white-space: nowrap; // prevent line breaks
    @include red(0.5, text);

    // Customizable underline variables
    $u-thickness: 2px;
    $u-offset: 0.1em; // distance below text

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: calc(-1 * $u-offset);
      height: $u-thickness;
      background: currentColor;

      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.6s ease-in-out;
      pointer-events: none;
    }

    &:hover::after,
    &:focus-visible::after {
      transform: scaleX(1);
      @include red(1, text);
    }

    &:hover,
    &:active,
    &:focus-visible {
      @include red(1, text);
    }
  }

  .wallet {
    min-width: 14rem;

    h4 {
      width: auto;
    }

    &.small-blue-tile h4 {
      @include dark-blue(1, text);
    }

    &.small-orange-tile h4 {
      @include dark-red(1, text);
    }

    &:hover:not(&:disabled),
    &:active:not(&:disabled),
    &:focus-visible:not(&:disabled) {
      @include bright;
    }
  }
</style>
