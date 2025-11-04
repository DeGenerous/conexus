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
  import { getCurrentUser, redirectTo } from '@utils/route-guard';
  import { referralActivationNotice } from '@constants/modal';
  import { toastStore } from '@stores/toast.svelte';
  import { blankImage, serveUrl } from '@constants/media';
  import { MEDIA_RULES, validateFiles } from '@utils/file-validation';
  import { toAvif } from '@utils/avif-convert';

  import WalletConnect from '@components/web3/WalletConnect.svelte';
  import Dropdown from '@components/utils/Dropdown.svelte';

  import EyeSVG from '@components/icons/Eye.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';
  import CopySVG from '@components/icons/Copy.svelte';
  import EditSVG from '@components/icons/Edit.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  // SIGNED IN USER PROFILE

  const account: Account = new Account();
  const authentication: Authentication = new Authentication();

  let user = $state<Nullable<User>>(null);
  let roles = $state<TenantRole[]>([]);
  let userRole = $state<Nullable<TenantRole>>(null);
  let subscribedToNewsletter = $state<boolean>(false);

  let editingUsername = $state<boolean>(false);
  let usernameInput = $state<string>('');

  let editingRefCode = $state<boolean>(false);
  let refCodeInput = $state<string>('');

  let editingBio = $state<boolean>(false);
  let bioInput = $state<string>('');
  let avatarUrl = $state<string>('');
  let avatarFileId = $state<string>('');
  let isUploadingAvatar = $state<boolean>(false);
  let avatarInputEl = $state<HTMLInputElement | undefined>();

  const formatMiB = (bytes: number) =>
    `${(bytes / 1_048_576).toFixed(1).replace(/\.0$/, '')} MiB`;

  const checkSubscription = async () => {
    if (!user?.email) return;
    subscribedToNewsletter = await account.subscriptionStatus(user?.email);
  };

  onMount(async () => {
    user = await getCurrentUser(true);
    roles = await account.fetchRoles();

    console.log(user);

    userRole = roles.find((role) => role.name === user?.role_name) || null;

    checkSubscription();

    usernameInput = user?.username || '';
    refCodeInput = user?.referral_code || '';
    bioInput = user?.avatar_bio || '';
    avatarUrl = user?.avatar_url || '';
    avatarFileId = user?.avatar_file_id || '';
  });

  // Username

  const resetUsername = () => {
    editingUsername = false;
    usernameInput = user?.username || '';
  };

  const changeUsername = async () => {
    if (user?.username === usernameInput) {
      editingUsername = false;
      return;
    }
    try {
      await account.changeUsername(usernameInput);
      editingUsername = false;
    } catch (error) {
      resetUsername();
    }
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

  // Referral code

  const copyRefCode = (code: string) => {
    let codeBtn = document.getElementById(code) as HTMLButtonElement;
    navigator.clipboard.writeText(code);
    codeBtn.classList.add('copied'); // animation
    setTimeout(() => codeBtn.classList.remove('copied'), 600);
    toastStore.show('Copied to clipboard: ' + code);
  };

  const resetRefCode = () => {
    editingRefCode = false;
    refCodeInput = user?.referral_code || '';
  };

  const changeRefCode = async () => {
    if (user?.referral_code === refCodeInput) {
      editingRefCode = false;
      return;
    }
    try {
      await account.changeReferralCode(refCodeInput);
      editingRefCode = false;
    } catch (error) {
      resetRefCode();
    }
  };

  // Web3 wallets

  const openSelectWalletModal = (wallet: string) => {
    openModal(
      ensureMessage('select this wallet as the main address for your account'),
      'Select',
      () => selectMainWallet(wallet),
    );
  };

  const selectMainWallet = async (wallet: string) => {
    user =
      (await authentication.selectMainWallet(wallet)) ??
      (await getCurrentUser(true));
  };

  const openRemoveWalletModal = (event: Event, wallet: string) => {
    event.stopPropagation();
    openModal(
      ensureMessage('unlink this wallet from your account'),
      'Unlink',
      () => unlinkWallet(wallet),
    );
  };

  const unlinkWallet = async (wallet: string) => {
    user =
      (await authentication.unlinkWallet(wallet)) ??
      (await getCurrentUser(true));
  };

  // Profile picture upload and conversion to AVIF

  function shouldConvertAvatar(file: File): boolean {
    if (!file.type.startsWith('image/')) return false;
    return file.type !== 'image/avif';
  }

  const triggerAvatarPicker = () => avatarInputEl?.click();

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
            throw new Error(
              `Converted image is larger than ${formatMiB(MEDIA_RULES.description.maxBytes)}`,
            );
          }
          upload = new File([avif], nextFile.name.replace(/\.\w+$/, '.avif'), {
            type: 'image/avif',
          });
        } catch (err) {
          toastStore.show(String(err), 'error');
          return;
        }
      }

      console.log('Uploading media file:', upload);
      await account.changeAvatar(undefined, upload);
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      isUploadingAvatar = false;
      input.value = '';
    }
  };

  // Delete account (not used currently)
  const deleteAccount = async () => {
    openModal(
      ensureMessage(
        'delete your account permanently, without the possibility of recovery',
      ),
      'Delete',
      async () => {
        await Promise.resolve(); // delete account API call
        redirectTo('/');
      },
    );
  };
</script>

{#if user}
  <img
    class="pfp round"
    src={avatarFileId
      ? serveUrl(avatarFileId)
      : avatarUrl
        ? `/api/${encodeURIComponent(avatarUrl)}`
        : blankImage}
    alt="PFP"
  />
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
      <h4>Username</h4>
      <div class="container">
        {#if editingUsername}
          <CloseSVG onclick={resetUsername} />
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
            onclick={changeUsername}
            disabled={user?.username === usernameInput}
          />
        {:else}
          <EditSVG bind:editing={editingUsername} />
        {/if}
      </div>
    </div>

    <div class="flex-row">
      <h4>Credits</h4>
      <div class="credits container">
        <span class="flex">
          <h5>
            Monthly:
            <strong>
              {user.credits}
              {#if userRole !== null && userRole !== undefined}
                / {userRole.monthly_credits === -1
                  ? '∞'
                  : userRole.monthly_credits}
              {/if}
            </strong>
          </h5>
          <p class="caption">
            Included each month. Resets in {user.credit_reset_in} days.
          </p>
        </span>
        <span class="flex">
          <h5>
            Bonus: <strong>{user.bonus}</strong>
          </h5>
          <p class="caption">
            Extra credits from referrals or promos. Never expires.
          </p>
        </span>
      </div>
    </div>

    {#if user.email_confirmed}
      {#await account.getReferralCode() then refCode}
        <div class="flex-row">
          <h4>Referral Code</h4>
          <div class="ref-code-wrapper container">
            {#if refCode !== null}
              {#if refCode.usage_count >= refCode.max_usage}
                <span class="flex">
                  <h5 class="text-glowing">
                    🏆 You've unlocked all {refCode.max_usage} referrals 🚀
                  </h5>
                  <p class="text-glowing">
                    Your early support won't go unnoticed. Stay tuned for
                    updates.
                  </p>
                </span>
              {:else}
                <h5>Referrals: {refCode.usage_count}</h5>
                {#if editingRefCode}
                  <CloseSVG onclick={resetRefCode} />
                {/if}
                <input
                  bind:value={refCodeInput}
                  type="text"
                  placeholder="Enter referral code"
                  size={refCodeInput.length + 1}
                  minlength="3"
                  maxlength="20"
                  disabled={!editingRefCode}
                />
                {#if editingRefCode}
                  <SaveSVG
                    onclick={changeRefCode}
                    disabled={refCode.code === refCodeInput ||
                      refCodeInput.length < 3}
                  />
                {:else}
                  <EditSVG bind:editing={editingRefCode} />
                {/if}
                <button
                  class="void-btn flex"
                  id={refCode.code}
                  onclick={() => copyRefCode(refCode.code)}
                  aria-label="Copy code {refCode.code}"
                >
                  <CopySVG />
                </button>
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
                Generate referral code
              </button>
            {/if}
          </div>
        </div>
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
      {#if user.role_name === 'Admin'}
        <h3 style:color="gold">👑 You are Admin 👑</h3>
      {/if}
      <ul class="user-roles flex-row flex-wrap">
        {#each roles as { name, monthly_credits, play_without_media, play_with_media, create_topic_cost }}
          {#if name !== 'Admin'}
            <li class="flex" class:active={user.role_name === name}>
              <h4>{name}</h4>
              <span class="flex">
                <p class:allowed={play_without_media !== -1}>
                  {play_without_media !== -1 ? '✓' : '☓'}
                  Play text-only stories
                </p>
                <p class:allowed={play_with_media !== -1}>
                  {play_with_media !== -1 ? '✓' : '☓'}
                  Play stories with media
                </p>
                <p class:allowed={create_topic_cost !== -1}>
                  {create_topic_cost !== -1 ? '✓' : '☓'}
                  Create custom stories
                </p>
              </span>
              <h5>Monthly Credits: <strong>{monthly_credits}</strong></h5>
            </li>
          {/if}
        {/each}
      </ul>

      <form class="flex">
        <div class="input-container">
          <label for="mail">Email</label>
          <input id="mail" type="email" value={user.email} disabled />
        </div>
        {#if !user.email_confirmed && !user.is_oauth}
          <p class="validation">Please check your inbox and confirm email</p>
        {/if}
        {#if user.first_name}
          <div class="input-container">
            <label for="first-name">First name</label>
            <input
              id="first-name"
              type="text"
              value={user.first_name}
              disabled={true}
            />
          </div>
        {/if}
        {#if user.last_name}
          <div class="input-container">
            <label for="last-name">Last name</label>
            <input
              id="last-name"
              type="text"
              value={user.last_name}
              disabled={true}
            />
          </div>
        {/if}

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

      {#if user?.created_at}
        <p class="transparent-white-txt">
          Joined {new Date(user.created_at).toLocaleDateString()}
        </p>
      {/if}

      <!-- <button class="red-btn" onclick={deleteAccount}>
        Delete Account
      </button> -->
    </Dropdown>
  {/if}

  {#if user.wallets && user.wallets.filter((address) => !address.faux).length >= 1}
    <Dropdown name="Connected Addresses">
      <ul class="flex-row flex-wrap">
        {#each user.wallets.filter((address) => !address.faux) as { wallet }, index}
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
              openSelectWalletModal(wallet!);
            }}
          >
            <h4>{index + 1}</h4>
            <p class="pad-8 round-8 transparent-dark-bg soft-white-txt">
              {wallet.slice(0, 6) + '...' + wallet.slice(-4)}
            </p>
            <CloseSVG
              onclick={(event) => openRemoveWalletModal(event, wallet!)}
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
{:else}
  <img class="loading-logo" src="/icons/loading.png" alt="Loading" />
{/if}

<style lang="scss">
  @use '/src/styles/mixins' as *;

  .pfp {
    @include gray-border;

    @include respond-up(tablet) {
      width: 20rem;
    }
  }

  .user-roles {
    li {
      padding: 1rem 0.5rem;
      gap: 1rem;
      border-radius: 1rem;
      @include navy(0.75);
      @include gray-border;

      h4 {
        width: auto;
      }

      span {
        align-items: flex-start;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: $transparent-black;
        @include white-txt;
        @include box-shadow(soft, inset);

        p {
          @include red(0.75, text);

          &.allowed {
            @include green(0.9, text);
          }
        }
      }

      &.active {
        @include deep-green(0.75);

        span {
          @include dark-green;
        }
      }
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
