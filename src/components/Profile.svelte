<script lang="ts">
  import { onMount } from 'svelte';

  import WalletConnect from '@components/web3/WalletConnect.svelte';
  import Authentication from '@lib/authentication';
  import { getCurrentUser } from '@utils/route-guard';
  import { accountError, approvedTester } from '@stores/account.svelte';
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
  import { NAV_ROUTES } from '@constants/routes';

  import ProfileSVG from '@components/icons/Profile.svelte';
  import DoorSVG from '@components/icons/Door.svelte';
  import EyeSVG from '@components/icons/Eye.svelte';
  import QuitSVG from '@components/icons/Quit.svelte';
  import CloseSVG from '@components/icons/Close.svelte';
  import DiscordBtn from '@components/icons/Discord.svelte';
  import LoadingSVG from '@components/icons/Loading.svelte';

  let { activeTab = 'Dashboard' }: { activeTab: string } = $props();

  const authentication: Authentication = new Authentication();
  const REFERRAL_CODE_DEBOUNCE_MS = 500;

  let dialog = $state<HTMLDialogElement | null>(null);

  const resetAuthViewState = () => {
    signUp = false;
    signInWithEmail = false;
  };

  $effect(() => {
    if (!dialog) return;
    if ($showProfile) {
      dialog.classList.remove('dialog-fade-out');
      dialog.showModal();
    } else {
      dialog.classList.add('dialog-fade-out');
      setTimeout(() => dialog?.close(), 300);
      resetAuthViewState();
    }
  });

  $effect(() => {
    if (!$approvedTester && $showProfile) {
      dialog?.close();
    }
  });

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
    const user = await getCurrentUser();
    if (!user) searchForReferralCodeInURL();
  });

  // NON-SIGNED WINDOWS

  let signUp = $state<boolean>(false); // go to SIGN UP window if TRUE
  let signInWithEmail = $state<boolean>(false); // go to SIGN IN WITH EMAIL window if TRUE
  let loginMail = $state<string>('');
  let loginPassword = $state<string>('');
  let isSignInLoading = $state<boolean>(false);

  // SIGN UP FORM WINDOW

  let referralCode = $state<string>('');
  let referralCodeValid = $state<boolean>(false);
  let first_name = $state<string>('');
  let last_name = $state<string>('');
  let password = $state<string>('');
  let confirmPassword = $state<string>('');
  let email = $state<string>('');
  let isSignupLoading = $state<boolean>(false);

  const mandatoryFields = $derived<boolean>(
    regexpEmail.test(email) &&
      first_name.trim().length > 0 &&
      last_name.trim().length > 0 &&
      regexpPasswordValidation.test(password) &&
      password === confirmPassword,
  );

  let termsAccepted = $state<boolean>(false);
  let newsletterSignup = $state<boolean>(false);
  let referralValidationHandle: ReturnType<typeof setTimeout> | undefined;

  const isFormValid = $derived<boolean>(
    mandatoryFields && termsAccepted && referralCodeValid,
  );

  $effect(() => {
    if (referralCode.length >= 3 && referralCode.length <= 20) {
      void validateReferralCode();
    } else if (referralCode.length < 3) {
      referralCodeValid = false;
    }
  });

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

  const referralSignup = async (event?: Event) => {
    event?.preventDefault();
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
      if (signUp && isFormValid && !isSignupLoading) {
        event.preventDefault();
        void referralSignup();
      } else if (
        !signUp &&
        signInWithEmail &&
        loginMail &&
        loginPassword &&
        !isSignInLoading
      ) {
        event.preventDefault();
        void handleEmailSignin();
      }
    }
  };

  const closeOnBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      $showProfile = false;
    }
  };

  const stopPropagation = (event: Event) => {
    event.stopPropagation();
  };
</script>

<svelte:window onkeypress={handleEnterKey} />

<ProfileSVG {activeTab} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  class="blur"
  bind:this={dialog}
  onclose={() => ($showProfile = false)}
  onclick={closeOnBackdropClick}
  aria-label="Profile"
  aria-modal="true"
>
  <div onclick={stopPropagation} role="dialog" tabindex="-1">
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
                name="signin-email"
                aria-label="Sign in email"
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
                name="signin-password"
                aria-label="Sign in password"
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
              onclick={(event) => {
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
              onclick={() => {
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
              onclick={() => {
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
            onclick={() => {
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
              name="signup-email"
              aria-label="Sign up email"
              autocomplete="email"
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
              name="signup-password"
              aria-label="Create password"
              autocomplete="new-password"
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
            name="signup-password-confirm"
            aria-label="Confirm password"
            autocomplete="new-password"
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
              name="first-name"
              aria-label="First name"
              autocomplete="given-name"
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
              name="last-name"
              aria-label="Last name"
              autocomplete="family-name"
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
              name="referral-code"
              aria-label="Referral code"
              autocomplete="off"
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
                name="terms"
                aria-label="Accept terms of service"
                onchange={(event: any) => {
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
                name="newsletter"
                aria-label="Subscribe to newsletter"
                onchange={(event: any) => {
                  newsletterSignup = event.target?.checked;
                }}
              />
              <label for="newsletter">
                I'd like to receive news twice a month.
              </label>
            </span>
          </div>
          <button
            onclick={referralSignup}
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
