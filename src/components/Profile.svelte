<script lang="ts">
  import { onMount } from 'svelte';

  import Account, { Roles } from '@lib/auth';
  import {
    authenticated,
    referralCodes,
    web3loginError,
    availables,
  } from '@stores/account';
  import {
    showModal,
    showProfile,
    secondButton,
    handleSecondButton,
    modalContent,
  } from '@stores/modal';
  import { isAvailable } from '@utils/validation';

  import WalletConnect from './WalletConnect.svelte';

  Account.me();
  Account.logged_in();

  onMount(async () => {
    Account.cookie();
  });

  let dialog: HTMLDialogElement;

  $: if (dialog && $showProfile) {
    dialog.showModal();
  } else if (dialog) {
    dialog.close();
    if (!isLogged) {
      signUp = false;
      signInWithEmail = false;
      invalidCredentials = false;
      $web3loginError = false;
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

  let isLogged: boolean;
  let signUp: boolean;
  let signInWithEmail: boolean;

  let user: any;
  let available: any;
  let loginMail: string = '';
  let loginPassword: string = '';
  let invalidCredentials: boolean = false;

  const handleSignIn = async (event: Event) => {
    event.preventDefault();
    try {
      await Account.signin({
        email: loginMail,
        password: loginPassword,
      });
      setTimeout(() => {
        if (!isLogged) invalidCredentials = true;
      });
    } catch (error) {
      invalidCredentials = true;
    }
  };

  let activeWalletStyling = `
    color: rgba(51, 226, 230, 0.75);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
    background-color: rgb(45, 90, 216);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25), 0 0 0.5vw rgba(51, 226, 230, 0.5);
  `;

  const walletSelectConfirm = (address: string) => {
    $secondButton = 'Select';
    $handleSecondButton = () => {
      handleWalletSelect(address);
      $showModal = false;
    };
    $modalContent =
      '<h2>Are you sure you want to select this address as a main one?</h2>';
    $showModal = true;
  };

  const handleWalletSelect = async (address: string) => {
    try {
      await Account.setMainWallet(address);
      // reload the page to update the user object
      location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  authenticated.subscribe((value) => {
    user = value.user;
    isLogged = value.loggedIn;
  });

  availables.subscribe((value) => {
    available = value;
  });

  $: if (isLogged) {
    Account.referraLCodes();
  }

  function copyRefCode(event: any) {
    navigator.clipboard.writeText(event.target.id);
  }

  let editingPassword: boolean = false;
  let editPassword: string = '';
  let editPasswordConfirm: string = '';
  let editPasswordVisible: boolean = false;
  let passwordVisible: boolean = false;
  $: editPasswordMatch = editPassword === editPasswordConfirm;

  const saveChangedPassword = () => {
    editingPassword = false;
    console.log(`save: ${editPassword}`);
    // SAVE USER PASSWORD
  };

  // Form state variables
  let referralCode = '';
  let referralCodeValid = false;
  let first_name = '';
  let last_name = '';
  let password = '';
  let confirmPassword = '';
  let email = '';

  // Form validation variables
  $: mandatoryFields = email && first_name && last_name && password;
  $: passwordsMatch =
    password && confirmPassword ? password == confirmPassword : true;
  let termsAccepted: boolean = false;

  $: isFormValid =
    mandatoryFields &&
    password.length >= 8 &&
    passwordsMatch &&
    termsAccepted &&
    referralCodeValid;

  $: if (referralCode.length === 16) validateReferralCode();
  async function validateReferralCode() {
    const referralObject: ReferralCode | null =
      await Account.validateReferralCode(referralCode);
    if (referralObject) {
      referralCodeValid = true;
    } else {
      referralCodeValid = false;
    }
  }

  const referralSignup = async (event: Event) => {
    event.preventDefault();
    await Account.signupReferral({
      user: {
        first_name,
        last_name,
        email,
        password,
        referred: referralCodeValid,
        role: Roles.USER,
      },
      referral_code: referralCode,
    });
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<span
  class="profile-icon"
  role="button"
  tabindex="0"
  on:click={() => ($showProfile = true)}
></span>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  class="blur"
  bind:this={dialog}
  on:close={() => ($showProfile = false)}
  on:click|self={() => ($showProfile = false)}
>
  <!-- svelte-ignore a11y-no-static-element-interactions a11y_no_noninteractive_element_to_interactive_role -->
  <div on:click|stopPropagation>
    <header>
      {#if isLogged}
        <button
          class="login-button"
          on:click={() => {
            Account.signout();
          }}
        >
          <img src="/icons/sign-out.png" alt="Sign-out" />
          <p>Sign out</p>
        </button>
      {:else}
        <button class="back-arrow" on:click|stopPropagation={handleBackArrow}>
          <img src="/icons/quit-fullscreen.png" alt="Back" />
        </button>
      {/if}
      <button
        class="close-button"
        on:click|stopPropagation={() => ($showProfile = false)}
      >
        <img src="/icons/close.png" alt="Close" />
      </button>
    </header>

    <!-- USER PROFILE -->
    {#if isLogged}
      <section class="profile-window">
        <hr />

        {#if isAvailable(available)}
          <div class="story-games-container">
            <h3>
              You have used
              <strong>{available.used} / {available.available} weekly</strong>
              stories
            </h3>

            {#if available.bonus > 0}
              <h3>
                You have
                <strong>{available.bonus} bonus</strong>
                stories
              </h3>
            {/if}
          </div>
        {:else}
          <div class="error-message">
            <p><strong>Error:</strong> {available.message}</p>
          </div>
        {/if}

        <hr />

        {#if user.email && user.first_name}
          <div class="user-profile-info">
            <div class="input-container">
              <label for="mail">Email</label>
              <input
                class="user-input"
                type="email"
                value={user.email}
                disabled
              />
            </div>
            <div class="input-container">
              <label for="first-name">First name</label>
              <input
                class="user-input"
                type="text"
                value={user.first_name}
                disabled={true}
              />
            </div>
            <div class="input-container">
              <label for="last-name">Last name</label>
              <input
                class="user-input"
                type="text"
                value={user.last_name}
                disabled={true}
              />
            </div>

            {#if editingPassword}
              <div class="input-container">
                <label for="password">New password</label>
                <div class="password-container">
                  <input
                    class="user-input highlighted-input"
                    type={editPasswordVisible ? 'text' : 'password'}
                    placeholder="Provide new password"
                    bind:value={editPassword}
                    style={editPassword
                      ? ''
                      : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
                  />
                  <button
                    aria-label="Show password"
                    class="password-visibility-button non-hover-btn"
                    on:pointerdown={() => (editPasswordVisible = true)}
                    on:pointerup={() => (editPasswordVisible = false)}
                    on:pointerleave={() => (editPasswordVisible = false)}
                  ></button>
                </div>
              </div>
              <div class="input-container">
                <label for="password-confirmation">Confirm new password</label>
                <input
                  class="user-input highlighted-input"
                  type={editPasswordVisible ? 'text' : 'password'}
                  placeholder="Provide new password again"
                  bind:value={editPasswordConfirm}
                  style={editPassword === editPasswordConfirm
                    ? ''
                    : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
                />
              </div>
              {#if !editPassword}
                <p class="validation">Please enter new password</p>
              {:else if !editPasswordConfirm}
                <p class="validation">Please confirm new password</p>
              {:else if editPasswordConfirm && !editPasswordMatch}
                <p class="validation">Passwords do not match!</p>
              {/if}
            {/if}

            <div class="edit-buttons">
              {#if editingPassword}
                <button on:click={() => (editingPassword = false)}>
                  Cancel
                </button>
                <button
                  on:click={saveChangedPassword}
                  disabled={!editPassword || !editPasswordMatch}
                >
                  Save
                </button>
              {:else}
                <button on:click={() => (editingPassword = true)}>
                  Change password
                </button>
              {/if}
            </div>
          </div>

          <hr />
        {/if}

        {#key user}
          <div class="wallet-connect">
            {#if !user.faux}
              {#if user.wallets && user.wallets.length >= 1}
                <div class="wallets-container">
                  <h2>Connected Addresses:</h2>
                  <ul>
                    {#each user.wallets.filter((address) => !address.faux) as wallet, index}
                      <li
                        class="wallet"
                        style={wallet.wallet == user.main_wallet
                          ? activeWalletStyling
                          : ''}
                      >
                        <p>{index + 1}</p>
                        <span
                          style={wallet.wallet == user.main_wallet
                            ? 'color: rgb(51, 226, 230);'
                            : ''}
                          >{wallet.wallet.slice(0, 6) +
                            '...' +
                            wallet.wallet.slice(-4)}</span
                        >
                        <p
                          class="select-wallet"
                          role="button"
                          tabindex="0"
                          on:click={() => {
                            if (wallet.wallet != user.main_wallet)
                              walletSelectConfirm(wallet.wallet);
                          }}
                        >
                          ★
                        </p>
                      </li>
                    {/each}
                  </ul>
                  <div class="buttons-container">
                    <WalletConnect
                      linking={true}
                      title={'Add another address'}
                    />
                  </div>
                </div>
              {/if}
            {:else}
              <div class="buttons-container">
                <WalletConnect linking={true} title={'Connect Web3 Wallet'} />
              </div>
            {/if}
          </div>
        {/key}

        {#if user.email && user.first_name}
          <hr />

          <h2>Your referral codes</h2>
          {#if $referralCodes != null}
            {#key $referralCodes}
              <div class="referral-codes">
                {#each $referralCodes as code}
                  <div class="ref-code-container">
                    <input
                      class="ref-code"
                      id={code.code}
                      class:active-code={!code.is_used}
                      value={code.code}
                      disabled
                    />
                    {#if !code.is_used}
                      <button
                        aria-label="Copy code"
                        id={code.code}
                        class="copy-button non-hover-btn"
                        on:click={copyRefCode}
                      ></button>
                    {/if}
                  </div>
                {/each}
              </div>
            {/key}
            <h2>
              Your referrals: {$referralCodes.filter((code) => code.is_used)
                .length}
            </h2>
          {:else}
            <button on:click={Account.generateReferralCode}>
              Get referral codes
            </button>
          {/if}
        {/if}
      </section>
    {:else}
      <section class="sign-container">
        <h1>{signUp ? 'Sign up' : 'Sign in'}</h1>
        <hr />

        {#if !signUp}
          <!-- SIGN-IN window -->
          {#if signInWithEmail}
            <form class="login-form">
              <div class="input-container">
                <label for="user-mail">Email</label>
                <input
                  bind:value={loginMail}
                  class="user-input"
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
                  class="user-input"
                  type="password"
                  id="user-password"
                  placeholder="Enter your password"
                  minlength="8"
                  required
                />
              </div>
              {#if invalidCredentials}
                <p class="validation">Invalid credentials!</p>
              {/if}
              <button
                class="sign-button"
                on:click={handleSignIn}
                disabled={!(loginMail && loginPassword)}
              >
                Sign in
              </button>
              <a href="/">Forgot password?</a>
              <!-- svelte-ignore a11y_missing_attribute -->
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
            <div class="buttons-container">
              <button
                on:click={() => {
                  Account.google_login();
                }}
              >
                <img class="sign-icon" src="/icons/google.png" alt="Google" />
                <p class="sign-lable">with Google</p>
              </button>
              <button
                on:click={() => {
                  signInWithEmail = true;
                }}
              >
                <img class="sign-icon" src="/icons/email.png" alt="Google" />
                <p class="sign-lable">with email</p>
              </button>
              <WalletConnect title={'with Web3 wallet'} />
            </div>
            {#if $web3loginError}
              <p class="validation">
                This wallet is not linked to any account!
              </p>
            {/if}
            <hr />
            <h3>Don't have an account yet?</h3>
            <div class="buttons-container">
              <button
                on:click={() => {
                  signUp = true;
                }}
              >
                <img class="sign-icon" src="/icons/email.png" alt="Google" />
                <p class="sign-lable">Sign up with email</p>
              </button>
            </div>
          {/if}
        {:else}
          <!-- SIGN-UP window -->

          <form class="signup-form">
            <div class="input-container">
              <label for="new-user-mail">Mail</label>
              <input
                class="user-input"
                type="email"
                id="new-user-mail"
                placeholder="Enter email"
                bind:value={email}
                required
                style={email
                  ? ''
                  : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
              />
            </div>

            <div class="input-container">
              <label for="new-user-password">Password</label>
              <div class="password-container">
                <input
                  class="user-input"
                  id="new-user-password"
                  placeholder="Enter password"
                  minlength="8"
                  type={passwordVisible ? 'text' : 'password'}
                  bind:value={password}
                  required
                  style={password && password.length >= 8
                    ? ''
                    : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
                />
                <button
                  aria-label="Show password"
                  class="password-visibility-button non-hover-btn"
                  on:click|preventDefault
                  on:pointerdown={() => (passwordVisible = true)}
                  on:pointerup={() => (passwordVisible = false)}
                  on:pointerleave={() => (passwordVisible = false)}
                ></button>
              </div>
              <input
                class="user-input"
                id="confirm-new-user-password"
                placeholder="Confirm password"
                bind:value={confirmPassword}
                required
                type={passwordVisible ? 'text' : 'password'}
                style={password &&
                password.length >= 8 &&
                confirmPassword &&
                passwordsMatch
                  ? ''
                  : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
              />
            </div>

            <!-- svelte-ignore block_empty -->
            {#if !password}{:else if password.length < 8}
              <p class="validation">
                Password should contain at least 8 characters!
              </p>
            {:else if !passwordsMatch}
              <p class="validation">Passwords do not match!</p>
            {/if}

            <div class="input-container">
              <label for="user-first-name">First name</label>
              <input
                class="user-input"
                type="text"
                id="user-first-name"
                placeholder="Enter First name"
                bind:value={first_name}
                style={first_name
                  ? ''
                  : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
              />
            </div>
            <div class="input-container">
              <label for="user-last-name">Last name</label>
              <input
                class="user-input"
                type="text"
                id="user-last-name"
                placeholder="Enter Last name (optional)"
                bind:value={last_name}
                style={last_name
                  ? ''
                  : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
              />
            </div>
            <div class="input-container">
              <label for="user-ref-code">Referral code</label>
              <input
                class="user-input"
                type="text"
                id="user-ref-code"
                placeholder="A11A7528D9C82915"
                minlength="16"
                maxlength="16"
                bind:value={referralCode}
                required
                style={referralCodeValid
                  ? ''
                  : 'border: 0.1vw solid rgba(255, 50, 50, 0.75);'}
              />
            </div>

            {#if !mandatoryFields}
              <p class="validation">Fill all required fields</p>
            {/if}

            {#if referralCode.length === 16}
              {#await Account.validateReferralCode(referralCode)}
                <p class="validation">Checking referral code...</p>
              {:then referralObject}
                {#if referralObject}
                  <p class="validation green">Referral code is valid</p>
                {:else}
                  <p class="validation">Referral code is invalid</p>
                {/if}
              {:catch}
                <p class="validation">Some error occured...</p>
              {/await}
            {:else if referralCode}
              <p class="validation">Code should contain 16 characters</p>
            {:else}
              <p class="validation">Enter referral code</p>
            {/if}

            {#if password && !confirmPassword}
              <p class="validation">Please confirm your password</p>
            {/if}

            <div class="agreements-container">
              <div class="agreement">
                <input
                  type="checkbox"
                  id="terms"
                  on:change={(event: any) => {
                    termsAccepted = event.target?.checked;
                  }}
                />
                <label
                  for="terms"
                  class="terms"
                  style={termsAccepted ? '' : 'color: rgba(255, 50, 50, 0.75);'}
                >
                  * I have read and agree to the <a
                    href="https://docs.google.com/document/d/1fEemq6HVM_h8ZTbc_Fl_k3RvlPdjYd70TI1iloT5gXA/edit?usp=sharing"
                    target="_blank"
                    style={termsAccepted
                      ? ''
                      : 'color: rgba(255, 50, 50, 0.9);'}
                  >
                    Terms of Service</a
                  >.
                </label>
              </div>
              <div class="agreement">
                <input type="checkbox" id="newsletter" />
                <label for="newsletter" class="newsletter">
                  I'd like to receive news twice a month.
                </label>
              </div>
            </div>
            <button
              class="sign-button"
              on:click={referralSignup}
              disabled={isFormValid ? false : true}>Create account</button
            >
          </form>
        {/if}
      </section>
    {/if}
  </div>
</dialog>

<style>
  dialog {
    width: 65vw;
    height: 90%;
    background-color: rgba(1, 0, 32, 0.75);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.5);
    border-radius: 1.5vw;
    overflow-x: hidden;
  }

  dialog::-webkit-scrollbar {
    width: 0.5vw;
  }

  dialog::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }

  dialog::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(51, 226, 230, 0.5),
      rgba(0, 0, 0, 0)
    );
    border-radius: 0.5vw;
    cursor: pointer;
  }

  dialog::-webkit-scrollbar-thumb:hover,
  dialog::-webkit-scrollbar-thumb:active {
    background: rgba(51, 226, 230, 0.5);
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.75);
  }

  dialog[open] {
    animation: zoom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  dialog[open]::backdrop {
    animation: fade 0.25s ease-out;
  }

  dialog > div {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    padding: 1vw;
  }

  /* Reset button styling for icons */

  .password-visibility-button,
  .copy-button {
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0);
    opacity: 0.75;
  }

  /* Control buttons */

  header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .back-arrow,
  .close-button,
  .login-button {
    padding: 0.5vw;
  }

  .back-arrow img,
  .close-button img,
  .login-button img {
    width: 3vw;
    padding: 0.25vw;
    opacity: 0.9;
    height: auto;
    cursor: pointer;
  }

  .login-button p {
    color: #dedede;
    cursor: inherit;
  }

  .back-arrow img {
    opacity: 0.75;
  }

  /* SIGN-IN window */

  .sign-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1.5vw;
  }

  /* SIGNIN with EMAIL */

  .login-form,
  .signup-form {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5vw;
  }

  .login-form a {
    color: rgba(51, 226, 230, 0.65);
  }

  .login-form a:hover,
  .login-form a:active {
    color: rgb(51, 226, 230);
  }

  .input-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5vw;
  }

  .agreements-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
    width: 100%;
  }

  .agreement {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    padding: 1vw;
    gap: 1vw;
  }

  .agreement label {
    cursor: pointer;
  }

  #terms,
  #newsletter {
    -webkit-transform: scale(2);
    transform: scale(2);
    flex: 1;
    accent-color: rgba(51, 226, 230, 0.75);
    cursor: pointer;
  }

  .terms > a {
    color: rgba(255, 255, 255, 0.65);
  }

  /* USER PROFILE window */

  .profile-window {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1.5vw;
    padding-block: 1vw;
  }

  .user-profile-info {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 1vw;
  }

  .password-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 4vw;
    margin-bottom: 1vw;
  }

  .highlighted-input {
    border: 0.1vw solid rgba(51, 226, 230, 0.9);
  }

  .password-visibility-button {
    margin-left: 1vw;
    width: 3vw;
    height: 3vw;
    background-image: url('/icons/invisibleicon.png');
    background-size: contain;
    background-repeat: no-repeat;
  }

  .password-visibility-button:active {
    background-image: url('/icons/visibleicon.png');
  }

  .edit-buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    gap: 1vw;
  }

  /* Story games number */

  .story-games-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    gap: 1.5vw;
  }

  .story-games-container h3 {
    color: rgba(51, 226, 230, 0.65);
  }

  .story-games-container strong {
    color: rgba(51, 226, 230, 0.9);
  }

  /* Web3 wallet section */

  .wallet-connect {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
  }

  .wallets-container {
    min-width: 65vw;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 2vw;
  }

  ul {
    max-width: 55vw;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 1vw;
  }

  .wallet {
    min-width: 22.5vw;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 1vw;
    padding: 0.5vw 1vw;
    font-size: 2vw;
    background-color: rgb(36, 65, 189);
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
    border-radius: 1vw;
    cursor: default;
    color: #010020;
  }

  .wallet span {
    text-align: center;
    padding: 1vw 2vw;
    font-size: 1.5vw;
    color: rgba(255, 255, 255, 0.6);
    background-color: rgba(1, 0, 32, 0.5);
    box-shadow: inset 0 0 0.5vw #010020;
    border-radius: 1vw;
  }

  .select-wallet {
    cursor: pointer;
    text-shadow: none;
    color: inherit;
  }

  .select-wallet:hover,
  .select-wallet:active {
    text-shadow: 0 0 0.5vw rgba(1, 0, 32, 0.5);
    transform: scale(1.1);
  }

  /* Referral codes container */

  .referral-codes {
    width: 90%;
    padding: 1vw 2vw;
    margin-inline: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    justify-content: center;
    gap: 1vw;
    box-shadow: inset 0 0 0.5vw rgba(51, 226, 230, 0.25);
    border-radius: 1vw;
    background-color: rgba(51, 226, 230, 0.1);
  }

  .ref-code-container {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 0.5vw rgba(51, 226, 230, 0.25);
    border-radius: 1vw;
    padding: 1vw;
  }

  .ref-code {
    font-size: 1.5vw;
    line-height: 1.5vw;
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
  }

  .ref-code:disabled {
    opacity: 1; /* for iOS */
  }

  .copy-button {
    width: 2vw;
    height: 2vw;
    background-image: url('/icons/copyicon.png');
    background-size: contain;
    background-repeat: no-repeat;
  }

  .copy-button:active {
    background-image: url('/icons/checkmark.png');
  }

  .active-code {
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 0.1vw rgb(51, 226, 230);
  }

  /* Profile icon */

  .profile-icon {
    height: 7vw;
    width: 7vw;
    background-image: url('/icons/profileIcon.avif');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.4;
    z-index: 1;
    cursor: pointer;
    flex: none;
  }

  .profile-icon:hover,
  .profile-icon:active {
    filter: drop-shadow(0 0 0.5vw rgba(51, 226, 230, 0.5));
    opacity: 0.75;
  }

  @media only screen and (max-width: 600px) {
    dialog {
      width: 100vw;
      height: 100%;
      border-radius: 1em;
      overflow-y: scroll;
    }

    dialog > div {
      padding: 1em;
    }

    .back-arrow,
    .close-button,
    .login-button {
      padding: 0.35em;
    }

    .back-arrow img,
    .close-button img,
    .login-button img {
      width: 1.25em;
    }

    .login-button img {
      padding: 0;
    }

    .login-button p {
      display: none;
    }

    .sign-container {
      gap: 1em;
    }

    .login-form,
    .signup-form {
      gap: 1em;
    }

    .input-container {
      gap: 0.25em;
    }

    .agreement {
      gap: 1em;
    }

    #terms,
    #newsletter {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }

    .profile-window {
      gap: 0.5em;
      padding-block: 0.5em;
    }

    .user-profile-info {
      gap: 1em;
    }

    .password-container {
      margin-left: 1.75em;
      margin-bottom: 0.5em;
    }

    .password-visibility-button {
      width: 1em;
      height: 1em;
      margin-left: 0.25em;
    }

    .edit-buttons {
      flex-direction: column;
      gap: 1em;
    }

    .wallet-connect {
      flex-direction: column;
    }

    .wallets-container {
      gap: 1em;
    }

    ul {
      flex-flow: column nowrap;
      gap: 1em;
      max-width: none;
    }

    .wallet {
      min-width: 75vw;
      gap: 0.5em;
      padding: 0.25em 0.5em;
      font-size: 1.2em;
      width: auto;
      border-radius: 0.5em;
    }

    .wallet span {
      width: 100%;
      padding: 0.25em 1em;
      font-size: 1em;
      border-radius: 0.5em;
    }

    .referral-codes {
      grid-template-columns: 100%;
      gap: 0.5em;
      padding: 1em;
      width: 100%;
    }

    .ref-code-container {
      padding: 0.5em 1em;
      border-radius: 0.5em;
    }

    .ref-code {
      font-size: 1em;
      line-height: 1.5em;
      padding: 0.25em 0.5em;
    }

    .copy-button {
      width: 1em;
      height: 1em;
    }

    .profile-icon {
      width: 3em;
      height: 3em;
    }
  }

  @keyframes zoom {
    from {
      transform: scale(1.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
