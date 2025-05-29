<script lang="ts">
  import { onMount } from 'svelte';

  import WalletConnect from '@components/web3/WalletConnect.svelte';
  import { Account } from '@lib/account';
  import { authenticated, referralCodes, accountError } from '@stores/account';
  import {
    showModal,
    showProfile,
    secondButton,
    secondButtonClass,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';
  import passwordVisible from '@stores/password-visibility';
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

  import ProfileSVG from '@components/icons/Profile.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import CopySVG from '@components/icons/Copy.svelte';
  import StarSVG from '@components/icons/Star.svelte';
  import DiscordBtn from '@components/icons/Discord.svelte';

  let dialog: HTMLDialogElement;

  $: if (dialog && $showProfile) {
    dialog.classList.remove('dialog-fade-out');
    dialog.showModal();
  } else if (dialog) {
    dialog.classList.add('dialog-fade-out');
    setTimeout(() => dialog.close(), 300);
    if (!isLogged) {
      signUp = false;
      signInWithEmail = false;
    } else {
      editingPassword = false;
    }
  }

  const handleBackArrow = () => {
    if (signUp) {
      signUp = false;
      return;
    }
    if (signInWithEmail) {
      signInWithEmail = false;
      return;
    }
    $showProfile = false;
  };

  // Sign-in
  let user: Nullable<User>;
  let isLogged: boolean;

  let signUp: boolean;
  let signInWithEmail: boolean;
  let loginMail: string = '';
  let loginPassword: string = '';

  let subStatus: SubscriptionStatus | null = null;

  let account: Account = new Account();

  onMount(async () => {
    await account.me();
  });

  authenticated.subscribe((value) => {
    user = value.user;
    isLogged = value.loggedIn;
  });

  $: if (isLogged && account && user && user.email_confirmed) {
    account.getReferralCodes();
    checkSubscription();
  }

  // Change password
  let editingPassword: boolean = false;
  let editOldPassword: string = '';
  let editPassword: string = '';
  let editPasswordConfirm: string = '';

  const saveChangedPassword = async () => {
    $accountError = null as AccountError;
    await account.changePassword({
      old_password: editOldPassword,
      new_password: editPassword,
    });
    if (!$accountError || !$accountError.changePassword)
      editingPassword = false;
  };

  // Sign-up form
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

  $: if (referralCode.length === 16) validateReferralCode();
  $: if (referralCode.length < 16) referralCodeValid = false;
  async function validateReferralCode() {
    const referralObject: ReferralCode | null =
      await account.validateReferralCode(referralCode);
    if (referralObject) {
      referralCodeValid = true;
    } else {
      referralCodeValid = false;
    }
  }

  const referralSignup = async (event: Event) => {
    event.preventDefault();
    await account
      .signup({
        user: {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email: email.trim(),
          password,
          referred: referralCodeValid,
          role: 'user',
        },
        referral_code: referralCode,
        newsletter: newsletterSignup,
      })
      .then((res) => {
        if (res !== null) location.reload();
      });
  };

  // Utility functions
  const walletSelectConfirm = (address: string) => {
    $secondButton = 'Select';
    $secondButtonClass = 'green-button';
    $handleSecondButton = () => {
      handleWalletSelect(address);
      $showModal = false;
    };
    $modalContent =
      '<h4>Are you sure you want to select this address as your main one?</h4>';
    $showModal = true;
  };

  const handleWalletSelect = async (address: string) => {
    await account.selectMainWallet(address);
    if ($accountError && $accountError.selectMainWallet) return;
    // reload the page to update the user object
    location.reload();
  };

  const copyRefCode = (refCode: string) => {
    let codeBtn = document.getElementById(refCode) as HTMLButtonElement;
    navigator.clipboard.writeText(refCode);
    codeBtn.classList.add('copied');
    setTimeout(() => codeBtn.classList.remove('copied'), 300);
  };

  // SVG Icons
  let copySvgFocus: Nullable<string> = null;

  // Newsletter
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

<ProfileSVG onClick={() => ($showProfile = true)} />

<!-- svelte-ignore
a11y-click-events-have-key-events
a11y-no-noninteractive-element-interactions
a11y-no-static-element-interactions
a11y_no_noninteractive_element_to_interactive_role-->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={() => ($showProfile = false)}
  on:click|self={() => ($showProfile = false)}
>
  <div on:click|stopPropagation>
    <header class="flex">
      {#if isLogged}
        <DoorSVG
          state="outside"
          text="Sign out"
          onClick={() => account.signout()}
        />
      {:else}
        <QuitSVG onClick={handleBackArrow} />
      {/if}
      <CloseSVG onClick={() => ($showProfile = false)} />
    </header>

    <!-- USER PROFILE -->
    {#if isLogged && user}
      <section class="profile-window flex">
        <hr />

        {#if user.available}
          <p>
            Credits remaining this month:
            <strong>
              {user.available.bonus}
            </strong>
          </p>
        {:else}
          <p class="validation">Error fetching credits...</p>
        {/if}

        <hr />

        {#if user?.email && user?.first_name}
          <div class="flex">
            <div class="input-container">
              <label for="mail">Email</label>
              <input id="mail" type="email" value={user.email} disabled />
            </div>
            {#if !user.email_confirmed && !user.is_oauth}
              <p class="validation">
                Please check your inbox and confirm email.
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
                  type={$passwordVisible.edit ? 'text' : 'password'}
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
                  type={$passwordVisible.edit ? 'text' : 'password'}
                  placeholder="Provide new password"
                  bind:value={editPassword}
                />
                <EyeSVG visibility="edit" />
              </div>
              <input
                class:red-border={!regexpPasswordValidation.test(
                  editPassword,
                ) || editPassword !== editPasswordConfirm}
                type={$passwordVisible.edit ? 'text' : 'password'}
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
                    on:click={() => (editingPassword = false)}
                  >
                    Cancel
                  </button>
                  <button
                    class="green-btn"
                    on:click={saveChangedPassword}
                    disabled={!editPassword ||
                      !regexpPasswordValidation.test(editPassword) ||
                      editPassword !== editPasswordConfirm}
                  >
                    Save
                  </button>
                {:else}
                  <button on:click={() => (editingPassword = true)}>
                    Change password
                  </button>
                {/if}
              </div>
            {/if}
          </div>

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
                      class="wallet void-btn flex-row pad-8 round-8 blue-bg dark-txt"
                      on:click={() => {
                        if (wallet.wallet != user!.main_wallet)
                          walletSelectConfirm(wallet.wallet);
                      }}
                      disabled={wallet.wallet == user.main_wallet}
                    >
                      <h4>{index + 1}</h4>
                      <p
                        class="pad-8 round-8 dark-transparent-bg white-soft-txt"
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

        {#if user?.email && user?.first_name && user?.email_confirmed}
          <hr />

          {#if $referralCodes != null}
            {#if $referralCodes.filter((code) => code.is_used).length == 10}
              <h4 class="text-glowing">You've unlocked all 10 referrals!</h4>
              <p class="text-glowing">
                Your early support won't go unnoticed. Stay tuned for updates.
              </p>
            {:else}
              {#key $referralCodes}
                <h4>Your referral codes</h4>
                <ul class="referral-codes flex-row">
                  {#each $referralCodes as code}
                    <button
                      class="ref-code void-btn flex-row pad-8 round-8 dark-txt"
                      class:used-code={code.is_used}
                      id={code.code}
                      on:click={() => copyRefCode(code.code)}
                      on:pointerover={() => (copySvgFocus = code.code)}
                      on:focus={() => (copySvgFocus = code.code)}
                      on:pointerout={() => (copySvgFocus = null)}
                      on:blur={() => (copySvgFocus = null)}
                      aria-label="Copy code {code.code}"
                    >
                      <p
                        class="pad-8 round-8 white-soft-txt dark-transparent-bg"
                      >
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
              on:click={() => {
                if (!user?.referred) {
                  window.open('/referral', '_self');
                } else
                  account
                    .generateReferralCode()
                    .then(() => window.location.reload());
              }}
            >
              Get referral codes
            </button>

            {#if $accountError && $accountError.generateReferralCode}
              <p class="validation">{$accountError.generateReferralCode}</p>
            {/if}
          {/if}
        {/if}

        {#if user.email_confirmed}
          {#if subStatus}
            <hr />

            {#if subStatus.is_active}
              <h4>Newsletter Subscription</h4>

              {#if subStatus.subscribed_at}
                <h5
                  class="subscription pad-8 round-8 gray-transparent-bg dark-txt shad"
                >
                  Active since: {dateToString(subStatus.subscribed_at.Time)}
                </h5>
              {/if}
              <button
                class="unsubscribe-button void-btn min-size-btn"
                on:click={() => {
                  account
                    .unsubscribeNewsletter()
                    .then(() => checkSubscription());
                }}
              >
                Unsubscribe
              </button>
            {:else}
              <div class="newsletter-subscription">
                <h4>Subscribe to Newsletter:</h4>
                <button
                  class="green-btn"
                  on:click={() => {
                    account
                      .subscribeNewsletter()
                      .then(() => checkSubscription());
                  }}
                >
                  Subscribe
                </button>
              </div>
            {/if}
          {/if}

          {#if $accountError && $accountError.subscribeNewsletter}
            <p class="validation">{$accountError.subscribeNewsletter}</p>
          {/if}
          {#if $accountError && $accountError.unsubscribeNewsletter}
            <p class="validation">{$accountError.unsubscribeNewsletter}</p>
          {/if}
          {#if $accountError && $accountError.subscriptionStatus}
            <p class="validation">{$accountError.subscriptionStatus}</p>
          {/if}
        {/if}

        <hr />

        <h4>Report bugs or ask for help</h4>
        <div class="flex-row">
          <a href="mailto:support@degenerousdao.com">Support</a>
          <span style:color="#bebebe">|</span>
          <a href="https://discord.gg/349FgMSUK8">Discord</a>
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
                  required
                />
              </div>
              <div class="input-container">
                <label for="user-password">Password</label>
                <input
                  bind:value={loginPassword}
                  type={$passwordVisible.login ? 'text' : 'password'}
                  id="user-password"
                  placeholder="Enter your password"
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
                onClick={() =>
                  account.signin({
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
                  account.googleSignin();
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
                type={$passwordVisible.signup ? 'text' : 'password'}
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
              type={$passwordVisible.signup ? 'text' : 'password'}
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
                    href="https://docs.google.com/document/d/1fEemq6HVM_h8ZTbc_Fl_k3RvlPdjYd70TI1iloT5gXA/edit?usp=sharing"
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
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
        @include box-shadow;

        h4 {
          color: inherit;
        }

        p {
          width: 100%;
          @include box-shadow(soft, inset);
        }

        &:hover:not(&:disabled),
        &:active:not(&:disabled),
        &:focus:not(&:disabled) {
          @include scale-up(soft);
          @include bright;
        }

        &:disabled {
          cursor: not-allowed;
          fill: $cyan;
          box-shadow: $shadow-plus-inset-glow;
          @include cyan(1, text);
          @include blue(1, bg, bright);

          p {
            color: $cyan;
          }
        }

        @include respond-up(tablet) {
          width: auto;
        }
      }
    }

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
