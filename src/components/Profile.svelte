<!-- LEGACY SVELTE 3/4 SYNTAX -->
<script lang="ts">
  import { onMount } from 'svelte';

  import WalletConnect from '@components/web3/WalletConnect.svelte';
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
  import { getCurrentUser } from '@utils/route-guard';
  import { SetCache, TERMS_KEY } from '@constants/cache';
  import { NAV_ROUTES } from '@constants/routes';

  import ProfileSVG from '@components/icons/Profile.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import DiscordBtn from '@components/icons/Discord.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  export let activeTab: string = 'Dashboard';

  const authentication: Authentication = new Authentication();

  let user: Nullable<User> = null;

  let dialog: HTMLDialogElement;

  $: if (dialog && $showProfile) {
    dialog.classList.remove('dialog-fade-out');
    dialog.showModal();
  } else if (dialog) {
    dialog.classList.add('dialog-fade-out'); // animation before close
    setTimeout(() => dialog.close(), 300);
    // Back to the LOGIN OPTIONS
    signUp = false;
    signInWithEmail = false;
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

  const openSignupWindow = () => {
    $showProfile = true;
    signUp = true;
  };

  const searchForReferralCodeInURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      referralCode = refCode;
      setTimeout(() => openSignupWindow(), 300);
    }
  };

  onMount(async () => {
    user = await getCurrentUser();

    if (!user) searchForReferralCodeInURL();
  });

  // NON-SIGNED WINDOWS

  let signUp: boolean; // go to SIGN UP window if TRUE
  let signInWithEmail: boolean; // go to SIGN IN WITH EMAIL window if TRUE
  let loginMail: string = '';
  let loginPassword: string = '';
  let isSignInLoading: boolean = false;

  // SIGN UP FORM WINDOW

  let referralCode: string = '';
  let referralCodeValid: boolean = false;
  let first_name: string = '';
  let last_name: string = '';
  let password: string = '';
  let confirmPassword: string = '';
  let email: string = '';
  let isSignupLoading: boolean = false;

  $: mandatoryFields =
    regexpEmail.test(email) &&
    first_name.trim() &&
    last_name.trim() &&
    regexpPasswordValidation.test(password) &&
    password == confirmPassword;

  let termsAccepted: boolean = false;
  let newsletterSignup: boolean = false;
  const REFERRAL_CODE_DEBOUNCE_MS = 500;
  let referralValidationHandle: ReturnType<typeof setTimeout> | undefined;

  $: isFormValid = mandatoryFields && termsAccepted && referralCodeValid;

  // Validate referral code when length is between 3 and 20 characters
  $: if (referralCode.length >= 3 && referralCode.length <= 20)
    validateReferralCode();
  $: if (referralCode.length < 3) referralCodeValid = false;

  async function validateReferralCode() {
    if (referralValidationHandle) {
      clearTimeout(referralValidationHandle);
    }

    referralValidationHandle = setTimeout(async () => {
      referralValidationHandle = undefined;

      const currentCode = referralCode;
      if (currentCode.length < 3 || currentCode.length > 20) return;

      try {
        referralCodeValid = false;
        const validated =
          await authentication.validateReferralCode(currentCode);

        if (referralCode !== currentCode) return;

        referralCodeValid = validated;
      } catch (error) {
        console.error('Failed to validate referral code:', error);
        if (referralCode !== currentCode) return;

        referralCodeValid = false;
      }
    }, REFERRAL_CODE_DEBOUNCE_MS);
  }

  // Sign up user with Email and Referral Code
  const referralSignup = async (event?: Event) => {
    event?.preventDefault(); // prevent page reload by form
    if (isSignupLoading || !isFormValid) return;

    isSignupLoading = true;

    try {
      await authentication.signup({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim(),
        password,
        referred: referralCodeValid,
        referral_code: referralCode,
        newsletter: newsletterSignup,
      });
      SetCache(TERMS_KEY, termsAccepted); // temp for terms modal
    } finally {
      isSignupLoading = false;
    }
  };

  const handleEmailSignin = async (event?: Event) => {
    event?.preventDefault();
    if (isSignInLoading || !(loginMail && loginPassword)) return;

    isSignInLoading = true;

    try {
      await authentication.signin({
        email: loginMail,
        password: loginPassword,
      });
    } finally {
      isSignInLoading = false;
    }
  };

  const handleEnterKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (signUp && isFormValid && !isSignupLoading) {
        void referralSignup();
      } else if (
        !signUp &&
        signInWithEmail &&
        loginMail &&
        loginPassword &&
        !isSignInLoading
      ) {
        void handleEmailSignin();
      }
    }
  };
</script>

<svelte:window on:keydown={handleEnterKey} />

<ProfileSVG {activeTab} {user} />

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
>
  <div on:click|stopPropagation>
    <header class="flex">
      <QuitSVG onclick={handleBackArrow} />
      <CloseSVG onclick={() => ($showProfile = false)} />
    </header>

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
              text={isSignInLoading ? 'Signing in...' : 'Sign in'}
              disabled={!(loginMail && loginPassword) || isSignInLoading}
              onclick={handleEmailSignin}
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
              minlength="3"
              maxlength="20"
              bind:value={referralCode}
              required
            />
          </div>

          {#if referralCode.length >= 3 && referralCode.length <= 20}
            {#if referralCodeValid}
              <p class="validation green-txt">Referral code is valid</p>
            {:else}
              <p class="validation">Referral code is invalid</p>
            {/if}
          {:else if referralCode}
            <p class="validation">Code should contain 3-20 characters</p>
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
                  href={NAV_ROUTES.TERMS}
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
          <button
            on:click={referralSignup}
            disabled={!isFormValid || isSignupLoading}
          >
            {#if isSignupLoading}
              <LoadingSVG />
              Creating account...
            {:else}
              Create account
            {/if}
          </button>
        </form>

        <hr />

        <h5>Don't have a ref code?</h5>
        <DiscordBtn text="Find yours on Discord" />
      {/if}
    </section>
  </div>
</dialog>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  header {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
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
