<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import WalletConnect from '@components/web3/WalletConnect.svelte';
  import Account from '@lib/account';
  import Authentication from '@lib/authentication';
  import { accountError } from '@stores/account.svelte';
  import { showProfile } from '@stores/modal.svelte';
  import passwordVisible from '@stores/password-visibility.svelte';
  import {
    regexpEmail,
    regexpPasswordValidation,
    regexpLengthCheck,
    regexpCapitalLetterCheck,
    regexpLowercaseLetterCheck,
    regexpNumberCheck,
    regexpSpecialCharCheck,
    regexpRestrictedCharsCheck,
  } from '@constants/regexp';
  import openModal from '@stores/modal.svelte';
  import { walletSwitchModal } from '@constants/modal';
  import { getCurrentUser } from '@utils/route-guard';
  import { GetCache, SetCache, TERMS_KEY } from '@constants/cache';

  import ProfileSVG from '@components/icons/Profile.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import StarSVG from '@components/icons/Star.svelte';
  import DiscordBtn from '@components/icons/Discord.svelte';
  import SaveSVG from '@components/icons/Checkmark.svelte';

  let dialog: HTMLDialogElement;

  $: if (dialog && $showProfile) {
    dialog.classList.remove('dialog-fade-out');
    dialog.showModal();
  } else if (dialog) {
    dialog.classList.add('dialog-fade-out'); // animation before close
    setTimeout(() => dialog.close(), 300);
    if (!user) {
      // Back to the LOGIN OPTIONS
      signUp = false;
      signInWithEmail = false;
    } else {
      // Ensure that CHANGE PASSWORD is closed
      editingPassword = false;
    }
  }

  const handleBackArrow = () => {
    if (signUp) {
      // Back from SIGN UP window
      signUp = false;
      return;
    }
    if (signInWithEmail) {
      // Back from SIGN IN WITH EMAIL window
      signInWithEmail = false;
      return;
    }
    // Close dialog if already on LOGIN OPTIONS window
    $showProfile = false;
  };

  // SIGNED IN USER PROFILE

  const account: Account = new Account();
  const authentication: Authentication = new Authentication();

  let user: Nullable<User> = null;

  onMount(async () => {
    user = await getCurrentUser();
  });

  // Change password
  let editingPassword: boolean = false;
  let editOldPassword: string = '';
  let editPassword: string = '';
  let editPasswordConfirm: string = '';

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

  // Select wallet address as the main one
  // const handleWalletSelect = async (address: string) => {
  //   await account.selectMainWallet(address);
  //   if ($accountError && $accountError.selectMainWallet) return;
  //   // Reload the page to update the user object
  //   location.reload();
  // };

  // NON-SIGNED WINDOWS

  let signUp: boolean; // go to SIGN UP window if TRUE
  let signInWithEmail: boolean; // go to SIGN IN WITH EMAIL window if TRUE
  let loginMail: string = '';
  let loginPassword: string = '';

  // SIGN UP FORM WINDOW

  let referralCode: string = '';
  let referralCodeValid: boolean = false;
  let first_name: string = '';
  let last_name: string = '';
  let password: string = '';
  let confirmPassword: string = '';
  let email: string = '';

  $: mandatoryFields =
    regexpEmail.test(email) &&
    first_name.trim() &&
    last_name.trim() &&
    regexpPasswordValidation.test(password) &&
    password == confirmPassword;

  let termsAccepted: boolean = false;
  let newsletterSignup: boolean = false;

  $: isFormValid = mandatoryFields && termsAccepted && referralCodeValid;

  // Validate referral code when length is 16 characters
  $: if (referralCode.length === 16) validateReferralCode();
  $: if (referralCode.length < 16) referralCodeValid = false;

  async function validateReferralCode() {
    const currentCode = referralCode;
    if (currentCode.length !== 16) return;

    try {
      referralCodeValid = false;
      const validated = await authentication.validateReferralCode(currentCode);

      if (referralCode !== currentCode) return;

      referralCodeValid = validated;
    } catch (error) {
      console.error('Failed to validate referral code:', error);
      if (referralCode !== currentCode) return;

      referralCodeValid = false;
    }
  }

  // Sign up user with Email and Referral Code
  const referralSignup = async (event: Event) => {
    event.preventDefault(); // prevent page reload by form
    await authentication.signup({
      user: {
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        password,
        referred: referralCodeValid,
      },
      referral_code: referralCode,
      newsletter: newsletterSignup,
    });
    SetCache(TERMS_KEY, termsAccepted); // temp for terms modal
  };
</script>

<ProfileSVG onclick={() => ($showProfile = true)} />

<!-- svelte-ignore
a11y-click-events-have-key-events
a11y-no-static-element-interactions-->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={() => ($showProfile = false)}
  on:click|self={() => ($showProfile = false)}
  aria-label="Profile"
  aria-modal="true"
  role="dialog"
>
  <div on:click|stopPropagation>
    <header class="flex">
      {#if user}
        <DoorSVG
          state="outside"
          text="Sign out"
          onclick={() => authentication.logout()}
        />
      {:else}
        <QuitSVG onclick={handleBackArrow} />
      {/if}
      <CloseSVG onclick={() => ($showProfile = false)} />
    </header>

    <!-- USER PROFILE -->
    {#if user}
      <section class="profile-window flex">
        <hr />

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

        <hr />

        {#if user?.email && user?.first_name}
          <form class="flex">
            <div class="input-container">
              <label for="mail">Email</label>
              <input id="mail" type="email" value={user.email} disabled />
            </div>
            {#if !user.email_confirmed && !user.is_oauth}
              <p class="validation">
                Please check your inbox and confirm email
              </p>
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
                  class:red-border={!regexpPasswordValidation.test(
                    editPassword,
                  )}
                  type={passwordVisible.edit ? 'text' : 'password'}
                  placeholder="Provide new password"
                  bind:value={editPassword}
                />
                <EyeSVG visibility="edit" />
              </div>
              <input
                class:red-border={!regexpPasswordValidation.test(
                  editPassword,
                ) || editPassword !== editPasswordConfirm}
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
                  <p class="validation">
                    Provide at least one lowercase letter
                  </p>
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
                    on:click={() => (editingPassword = false)}
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
                  <button
                    type="button"
                    on:click={() => (editingPassword = true)}
                  >
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
            {#if user && !user.faux}
              {#if user.wallets && user.wallets.length >= 1}
                <h4>Connected Addresses</h4>
                <ul class="flex-row">
                  {#each user.wallets.filter((address) => !address.faux) as wallet, index}
                    <button
                      class="wallet void-btn small-tile"
                      on:click={() => {
                        if (wallet.wallet != user!.main_wallet)
                          openModal(
                            walletSwitchModal,
                            'Select wallet',
                            () => {
                              // handleWalletSelect(wallet.wallet)
                            },
                            'green-btn',
                          );
                      }}
                      disabled={wallet.wallet == user.main_wallet}
                    >
                      <h4>{index + 1}</h4>
                      <p
                        class="pad-8 round-8 transparent-dark-bg soft-white-txt"
                      >
                        {wallet.wallet.slice(0, 6) +
                          '...' +
                          wallet.wallet.slice(-4)}
                      </p>
                      <StarSVG focused={wallet.wallet == user!.main_wallet} />
                    </button>
                  {/each}
                </ul>
                {#if user?.email && user?.first_name}
                  <WalletConnect linking={true} title={'Add another address'} />
                {/if}

                {#if $accountError && $accountError.selectMainWallet}
                  <p class="validation">{$accountError.selectMainWallet}</p>
                {/if}
              {/if}
            {:else}
              <WalletConnect linking={true} title={'Connect Web3 Wallet'} />
            {/if}
          </div>
        {/key}

        <hr />

        <h4>Report bugs or ask for help</h4>
        <div class="flex-row">
          <a href="mailto:support@degenerousdao.com">Support</a>
          <span style:color="#bebebe">|</span>
          <a href="https://dgrslabs.ink/join">Discord</a>
          <span style:color="#bebebe">|</span>
          <a href="/learn/faq">FAQ</a>
        </div>
      </section>
    {:else}
      <section class="sign-container flex">
        <h2>{signUp ? 'Sign up' : 'Sign in'}</h2>
        <hr />

        {#if !signUp}
          <!-- SIGN-IN window -->
          {#if signInWithEmail}
            <form class="flex">
              <div class="input-container">
                <label for="user-mail">Email</label>
                <input
                  bind:value={loginMail}
                  type="email"
                  id="user-mail"
                  placeholder="Enter your email"
                  autocomplete="email"
                  required
                />
              </div>
              <div class="input-container">
                <label for="user-password">Password</label>
                <input
                  bind:value={loginPassword}
                  type={passwordVisible.login ? 'text' : 'password'}
                  id="user-password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  minlength="8"
                  required
                />
                <EyeSVG visibility="login" />
              </div>

              {#if $accountError && $accountError.signin}
                <p class="validation">{$accountError.signin}</p>
              {/if}

              <DoorSVG
                state="inside"
                text="Sign in"
                disabled={!(loginMail && loginPassword)}
                onclick={() =>
                  authentication.signin({
                    email: loginMail,
                    password: loginPassword,
                  })}
              />
              <a href="/reset-password">Forgot password?</a>
              <a
                href="/"
                on:click={(event) => {
                  event.preventDefault();
                  signUp = true;
                }}>Create account</a
              >
            </form>
          {:else}
            <!-- SIGN-IN general window -->
            <div class="sign-options flex">
              <button
                class="sign-button"
                on:click={() => {
                  authentication.googleSignin();
                }}
              >
                <img class="sign-icon" src="/icons/google.png" alt="Google" />
                <p class="sign-lable">with Google</p>
              </button>

              {#if $accountError && $accountError.googleSignin}
                <p class="validation">{$accountError.googleSignin}</p>
              {/if}

              <button
                class="sign-button"
                on:click={() => {
                  signInWithEmail = true;
                }}
              >
                <img src="/icons/email.png" alt="Google" />
                <p>with email</p>
              </button>
              <WalletConnect title={'with Web3 wallet'} />
            </div>
            <hr />
            <h4>Don't have an account yet?</h4>
            <button
              class="sign-button"
              on:click={() => {
                signUp = true;
              }}
            >
              <img src="/icons/email.png" alt="Google" />
              <p>Sign up with email</p>
            </button>
            <p class="transparent-white-txt">It's completely free!</p>
          {/if}
        {:else}
          <!-- SIGN-UP window -->

          <form class="signup-form flex">
            <div class="input-container">
              <label for="new-user-mail">Mail</label>
              <input
                class:red-border={!regexpEmail.test(email)}
                type="email"
                id="new-user-mail"
                placeholder="Enter email"
                bind:value={email}
                required
              />
            </div>

            {#if email && !regexpEmail.test(email)}
              <p class="validation">Please provide a valid email</p>
            {/if}

            <div class="input-container">
              <label for="new-user-password">Password</label>
              <input
                class:red-border={!regexpPasswordValidation.test(password)}
                id="new-user-password"
                placeholder="Enter password"
                minlength="8"
                type={passwordVisible.signup ? 'text' : 'password'}
                bind:value={password}
                required
              />
              <EyeSVG visibility="signup" />
            </div>
            <input
              class:red-border={!regexpPasswordValidation.test(password) ||
                password !== confirmPassword}
              id="confirm-new-user-password"
              placeholder="Confirm password"
              bind:value={confirmPassword}
              required
              type={passwordVisible.signup ? 'text' : 'password'}
            />

            {#if password}
              {#if !regexpRestrictedCharsCheck.test(password)}
                <p class="validation">
                  Password contains a restricted character!
                </p>
              {:else if !regexpLengthCheck.test(password)}
                <p class="validation">
                  Password should contain 8 - 24 characters
                </p>
              {/if}

              {#if !regexpSpecialCharCheck.test(password)}
                <p class="validation">
                  Provide at least one special character: @ $ ! % * # ? & , .
                </p>
              {/if}

              {#if !regexpCapitalLetterCheck.test(password)}
                <p class="validation">Provide at least one capital letter</p>
              {/if}

              {#if !regexpLowercaseLetterCheck.test(password)}
                <p class="validation">Provide at least one lowercase letter</p>
              {/if}

              {#if !regexpNumberCheck.test(password)}
                <p class="validation">Provide at least one number</p>
              {/if}

              {#if confirmPassword && password !== confirmPassword}
                <p class="validation">Passwords do not match!</p>
              {/if}
            {:else}
              <p class="validation">Set a secure password</p>
            {/if}

            <div class="input-container">
              <label for="user-first-name">First name</label>
              <input
                class:red-border={!first_name.trim()}
                type="text"
                id="user-first-name"
                placeholder="Enter First name"
                bind:value={first_name}
              />
            </div>
            <div class="input-container">
              <label for="user-last-name">Last name</label>
              <input
                class:red-border={!last_name.trim()}
                type="text"
                id="user-last-name"
                placeholder="Enter Last name"
                bind:value={last_name}
              />
            </div>
            <div class="input-container">
              <label for="user-ref-code">Referral code</label>
              <input
                class={referralCodeValid ? 'green-border' : 'red-border'}
                type="text"
                id="user-ref-code"
                placeholder="A11A7528D9C82915"
                minlength="16"
                maxlength="16"
                bind:value={referralCode}
                required
              />
            </div>

            {#if referralCode.length === 16}
              {#if referralCodeValid}
                <p class="validation green-txt">Referral code is valid</p>
              {:else}
                <p class="validation">Referral code is invalid</p>
              {/if}
            {:else if referralCode}
              <p class="validation">Code should contain 16 characters</p>
            {:else}
              <p class="validation">Enter your referral code.</p>
            {/if}

            {#if !mandatoryFields}
              <p class="validation">Fill all required fields</p>
            {/if}

            {#if $accountError && $accountError.signup}
              <p class="validation">{$accountError.signup}</p>
            {/if}

            <div class="agreements-container flex">
              <span class="flex-row" class:mandatory={!termsAccepted}>
                <input
                  type="checkbox"
                  id="terms"
                  on:change={(event: any) => {
                    termsAccepted = event.target?.checked;
                  }}
                />
                <label for="terms">
                  * I have read and agree to the <a
                    href="https://dgrslabs.ink/terms-of-service"
                    target="_blank"
                  >
                    Terms of Service</a
                  >.
                </label>
              </span>
              <span class="flex-row">
                <input
                  type="checkbox"
                  id="newsletter"
                  on:change={(event: any) => {
                    newsletterSignup = event.target?.checked;
                  }}
                />
                <label for="newsletter">
                  I'd like to receive news twice a month.
                </label>
              </span>
            </div>
            <button on:click={referralSignup} disabled={!isFormValid}
              >Create account</button
            >
          </form>

          <hr />

          <h5>Don't have a ref code?</h5>
          <DiscordBtn text="Find yours on Discord" />
        {/if}
      </section>
    {/if}
  </div>
</dialog>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  header {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  /* USER PROFILE */
  .profile-window {
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

  /* SIGN-IN window */
  .sign-container {
    width: 100%;

    form {
      margin-top: 1rem;
    }
  }

  /* SIGN-UP window */
  .signup-form {
    .agreements-container {
      span {
        gap: 0.5rem;

        a {
          @include cyan(1, text);
        }

        label {
          color: inherit;
        }

        &.mandatory {
          @include red(0.75, text);

          a {
            @include red(1, text);
          }
        }
      }
    }
  }
</style>
