<script lang="ts">
  import Account from "../lib/auth";
  import { CoNexus } from "../lib/conexus";
  import {
    authenticated,
    referralCodes,
    wallet,
    web3LoggedIn,
  } from "../stores/account";
  import { onMount } from "svelte";

  Account.me();
  Account.logged_in();

  onMount(async () => {
    Account.cookie();
  });

  let showModal: boolean;
  let dialog: HTMLDialogElement;

  $: if (dialog && showModal) dialog.showModal();

  let isLogged: boolean;
  let signUp: boolean;

  let user: any;
  let loginMail: HTMLInputElement;
  let loginPassword: HTMLInputElement;

  let signInWithEmail: boolean;
  let signUpRefCodeEntered: boolean;
  let signUpWithEmail: boolean;
  function closeProfileWindow() {
    dialog.close();
    if (!isLogged) {
      signUp = false;
      signInWithEmail = false;
      signUpRefCodeEntered = false;
      signUpWithEmail = false;
    }
  }

  const alternativeSignIn = {
    google: () => {
      console.log("Sign in with Google");
    },
    coinbaseWallet: () => {
      console.log("Sign in with Coinbase Smart Wallet");
    },
    browserWallet: () => {
      console.log("Sign in with browser wallet");
    },
  };
  const alternativeSignUp = {
    google: () => {
      console.log("Sign up with Google");
    },
    coinbaseWallet: () => {
      console.log("Sign up with Coinbase Smart Wallet");
    },
    browserWallet: () => {
      console.log("Sign up with browser wallet");
    },
  };

  authenticated.subscribe((value) => {
    user = value.user;
    isLogged = value.loggedIn;
  });

  $: if (isLogged) {
    Account.referraLCodes();
  }

  let refCodes: any;
  referralCodes.subscribe((codes) => {
    refCodes = codes;
  });

  function copyRefCode(event: any) {
    navigator.clipboard.writeText(event.target.id);
  }

  let walletAddress: string;

  wallet.subscribe((value) => {
    walletAddress = value;
  });

  function connectWallet() {
    Account.log_in();
  }

  let mandatoryCheckbox: HTMLInputElement;
  let createAccountButton: HTMLButtonElement;
  function validate() {
    if (mandatoryCheckbox.checked) {
      createAccountButton.disabled = false;
    } else {
      createAccountButton.disabled = true;
    }
  }

  let firstNameInput: HTMLInputElement;
  let lastNameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let passwordConfirmInput: HTMLInputElement;
  let passwordConfirmLabel: HTMLLabelElement;
  let passwordMatchValidation: HTMLParagraphElement;
  let editUsernameBtn: HTMLButtonElement;
  let editPasswordBtn: HTMLButtonElement;
  let saveChangesBtn: HTMLButtonElement;

  const passwordVisible = () => (passwordInput.type = "text");
  const passwordInvisible = () => (passwordInput.type = "password");

  let isEditing: "username" | "password" | boolean = false;
  function changeUserData(this: any) {
    if (this.className.match("username")) {
      isEditing = "username";
    } else if (this.className.match("password")) {
      isEditing = "password";
    } else if (this.className.match("save")) {
      if (isEditing === "password") {
        if (passwordInput.value != passwordConfirmInput.value) {
          passwordMatchValidation.style.display = "block";
          throw new Error("Passwords do not match!");
        } else {
          passwordMatchValidation.style.display = "none";
        }
      }
      isEditing = false;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<span
  class="profile-icon"
  role="button"
  tabindex="0"
  on:click={() => (showModal = true)}
/>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  class="profile-container blur"
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={closeProfileWindow}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <div class="profile-navigation">
      <button
        class="close-button"
        on:click|stopPropagation={closeProfileWindow}
      >
        ❌
      </button>
      {#if isLogged}
        <button
          class="login-button"
          on:click={() => {
            Account.signout();
          }}>Log out</button
        >
      {/if}
    </div>

    {#if isLogged}
      <!-- USER PROFILE -->
      {#if $web3LoggedIn}
        <hr />
        {#await CoNexus.available()}
          <div class="story-games-container">
            <p class="story-games-number-label">Available story games...</p>
          </div>
        {:then available}
          <div class="story-games-container">
            <p class="story-games-number-label">
              You have used
              <span class="story-games-number"
                >{available.used} / {available.available} weekly</span
              >
              stories
            </p>

            {#if available.bonus > 0}
              <p class="story-games-number-label">
                You have
                <span class="story-games-number">
                  {available.bonus} bonus
                </span>
                lives
              </p>
            {/if}
          </div>
        {/await}
      {/if}

      <hr />

      <div class="user-profile-info">
        <div class="user-properties">
          <label for="mail" class="user-prop">Email</label>
          <input
            class="user-prop-value"
            id="mail"
            type="email"
            value={user.email}
            disabled
          />
          <label for="password" class="user-prop">Password</label>
          <div class="password-container">
            <input
              bind:this={passwordInput}
              class="user-prop-value"
              id="password"
              type="password"
              value={user.password}
              disabled={isEditing === "password" ? false : true}
              style={isEditing === "password"
                ? "border: 0.2vw solid rgba(51, 226, 230, 0.75)"
                : ""}
            />
            <button
              class="password-visibility-button"
              on:mousedown={passwordVisible}
              on:mouseup={passwordInvisible}
              on:touchstart={passwordVisible}
              on:touchend={passwordInvisible}
            />
          </div>
          {#if isEditing === "password"}
            <label
              bind:this={passwordConfirmLabel}
              for="password-confirmation"
              class="user-prop"
              id="password-confirmation-label">Confirm password</label
            >
            <input
              bind:this={passwordConfirmInput}
              class="user-prop-value"
              id="password-confirmation"
              type="password"
            />
          {/if}
          <label for="first-name" class="user-prop">First name</label>
          <input
            bind:this={firstNameInput}
            class="user-prop-value"
            id="first-name"
            type="text"
            value={user.first_name}
            disabled={isEditing === "username" ? false : true}
            style={isEditing === "username"
              ? "border: 0.2vw solid rgba(51, 226, 230, 0.75)"
              : ""}
          />
          <label for="last-name" class="user-prop">Last name</label>
          <input
            bind:this={lastNameInput}
            class="user-prop-value"
            id="last-name"
            type="text"
            value={user.last_name}
            disabled={isEditing === "username" ? false : true}
            style={isEditing === "username"
              ? "border: 0.2vw solid rgba(51, 226, 230, 0.75)"
              : ""}
          />
        </div>
      </div>

      <p bind:this={passwordMatchValidation} class="validation-check">
        Passwords do not match!
      </p>

      <div class="edit-buttons">
        {#if isEditing}
          <button
            bind:this={saveChangesBtn}
            class="save-changes"
            on:click={changeUserData}
          >
            Save
          </button>
        {:else}
          <button
            bind:this={editUsernameBtn}
            class="edit-username"
            on:click={changeUserData}
          >
            Change name
          </button>
          <button
            bind:this={editPasswordBtn}
            class="edit-password"
            on:click={changeUserData}
          >
            Change password
          </button>
        {/if}
      </div>

      <hr />

      <div class="wallet-connect">
        <p class="user-prop">Web3 account:</p>

        <button class="wallet-button" on:click={connectWallet}>
          {#if !$web3LoggedIn}
            Connect Wallet
          {:else if $web3LoggedIn}
            {walletAddress}
          {/if}
        </button>
      </div>

      <hr />

      <div class="google-connect">
        <p class="user-prop">Web2 account:</p>

        <button class="google-button"> Connect Google </button>
      </div>

      <hr />

      <p class="refferal-codes-legend">Your referral codes</p>
      {#if refCodes != null}
        <div class="refferal-codes">
          {#each refCodes as code}
            <div class="ref-code-container">
              <input
                class="ref-code"
                id={code.code}
                class:used={code.is_used}
                class:not-used={!code.is_used}
                value={code.code}
                disabled
              />
              <!-- svelte-ignore a11y-no-noninteractive-element-to-interactive-role -->
              <button
                id={code.code}
                class="copy-button"
                on:click={copyRefCode}
              />
            </div>
          {/each}
        </div>
      {:else}
        <button
          on:click={() => {
            console.log("get codes");
          }}
        >
          Get referral codes
        </button>
      {/if}
    {:else if !isLogged}
      <section class="signin">
        <p class="sign-title">{signUp ? "Sign up" : "Sign in"}</p>

        <hr />

        {#if !signUp}
          <!-- SIGNIN WINDOW -->

          {#if signInWithEmail}
            <form class="login-form">
              <label class="input-label" for="user-mail">Email</label>
              <input
                bind:this={loginMail}
                class="user-input"
                type="email"
                id="user-mail"
                placeholder="Enter your email"
                required
              />
              <label class="input-label" for="user-password">Password</label>
              <input
                bind:this={loginPassword}
                class="user-input"
                type="password"
                id="user-password"
                placeholder="Enter your password"
                minlength="8"
                required
              />
              <p class="validation-check">Invalid credentials!</p>
              <button
                class="submit-button"
                type="submit"
                on:click={() =>
                  Account.signin({
                    email: loginMail.value,
                    password: loginPassword.value,
                  })}>Sign in</button
              >
              <a class="forgot-password" href="/">Forgot password?</a>
            </form>
          {:else}
            <div class="buttons-container">
              <button class="sign-button" on:click={alternativeSignIn.google}>
                <img class="sign-icon" src="/icons/google.png" alt="Google" />
                <p class="sign-lable">with Google</p>
              </button>
              <button
                class="sign-button"
                on:click={() => {
                  signInWithEmail = true;
                }}
              >
                <img class="sign-icon" src="/icons/email.png" alt="Google" />
                <p class="sign-lable">with email</p>
              </button>
              <button
                class="sign-button"
                on:click={alternativeSignIn.coinbaseWallet}
              >
                <img class="sign-icon" src="/icons/coinbase.png" alt="Google" />
                <p class="sign-lable">with Coinbase Smart Wallet</p></button
              >
              <button
                class="sign-button"
                on:click={alternativeSignIn.browserWallet}
              >
                <img
                  class="sign-icon"
                  src="/icons/walletconnect.png"
                  alt="Google"
                />
                <p class="sign-lable">with browser wallet</p></button
              >
            </div>
          {/if}

          <hr />

          <p class="signup-label">Don't have an existing CoNexus account?</p>

          <div class="buttons-container">
            <button
              class="sign-button"
              on:click={() => {
                signUp = true;
              }}
            >
              <p class="sign-lable">Sign Up</p>
            </button>
          </div>
        {:else}
          <!-- SIGNUP WINDOW -->

          {#if signUpWithEmail}
            <form class="signup-form">
              <label class="input-label" for="new-user-mail">Mail</label>
              <input
                class="user-input"
                type="email"
                id="new-user-mail"
                placeholder="Your email"
                required
              />
              <label class="input-label" for="new-user-password">Password</label
              >
              <input
                class="user-input"
                type="password"
                id="new-user-password"
                placeholder="Your password"
                minlength="8"
                required
              />
              <input
                class="user-input"
                type="password"
                id="confirm-new-user-password"
                placeholder="Confirm password"
                required
              />
              <label class="input-label" for="user-first-name">First name</label
              >
              <input
                class="user-input"
                type="text"
                id="user-first-name"
                placeholder="Your First name"
              />
              <label class="input-label" for="user-last-name">Last name</label>
              <input
                class="user-input"
                type="text"
                id="user-last-name"
                placeholder="Your Last name"
              />
              <div class="agreements-container">
                <div class="agreement">
                  <input
                    bind:this={mandatoryCheckbox}
                    type="checkbox"
                    id="terms"
                    on:click={validate}
                  />
                  <label for="terms" class="terms">
                    * I have read and agree to the <a
                      href="https://docs.google.com/document/d/1fEemq6HVM_h8ZTbc_Fl_k3RvlPdjYd70TI1iloT5gXA/edit?usp=sharing"
                      target="_blank"
                    >
                      Terms of Service</a
                    >.
                  </label>
                </div>
                <div class="agreement">
                  <input type="checkbox" id="newsletter" />
                  <label for="newsletter" class="newsletter">
                    I'd like to receive news 1-4 times a month.
                  </label>
                </div>
              </div>
              <p class="validation-check">Fill in all required fields!</p>
              <button
                bind:this={createAccountButton}
                class="submit-button"
                on:click={() => {
                  isLogged = true;
                }}
                disabled>Create account</button
              >
            </form>
          {:else if signUpRefCodeEntered}
            <div class="buttons-container">
              <button class="sign-button" on:click={alternativeSignUp.google}>
                <img class="sign-icon" src="/icons/google.png" alt="Google" />
                <p class="sign-lable">with Google</p>
              </button>
              <button
                class="sign-button"
                on:click={() => {
                  signUpWithEmail = true;
                }}
              >
                <img class="sign-icon" src="/icons/email.png" alt="Google" />
                <p class="sign-lable">with email</p>
              </button>
              <button
                class="sign-button"
                on:click={alternativeSignUp.coinbaseWallet}
              >
                <img class="sign-icon" src="/icons/coinbase.png" alt="Google" />
                <p class="sign-lable">with Coinbase Smart Wallet</p></button
              >
              <button
                class="sign-button"
                on:click={alternativeSignUp.browserWallet}
              >
                <img
                  class="sign-icon"
                  src="/icons/walletconnect.png"
                  alt="Google"
                />
                <p class="sign-lable">with browser wallet</p></button
              >
            </div>
          {:else}
            <form class="ref-code-form">
              <p class="signup-label">Enter your referral code:</p>
              <input
                class="user-input"
                type="text"
                id="refferal-code"
                placeholder="A11A7528D9C82915 "
                minlength="16"
                maxlength="16"
                required
              />
              <p class="signup-label">
                Don't have one yet? Find yours <a
                  href="https://discord.gg/349FgMSUK8">here</a
                >!
              </p>
              <button
                class="submit-button"
                type="submit"
                on:click={() => (signUpRefCodeEntered = true)}>Done</button
              >
            </form>
          {/if}
        {/if}
      </section>
    {/if}
  </div>
</dialog>

<style>
  button {
    padding: 1vw 2vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2vw;
    font-size: 2vw;
    line-height: 3vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
  }

  button:hover,
  button:active {
    color: rgba(51, 226, 230, 1);
    background-color: rgba(51, 226, 230, 0.5);
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.4));
    transform: scale(1.05);
    transition: transform 0.15s ease-in-out;
  }

  button:disabled,
  button:disabled:hover,
  button:disabled:active {
    opacity: 0.5;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.4));
    cursor: not-allowed;
  }

  hr {
    margin: 2vw 0;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
  }

  .validation-check {
    display: none;
    text-align: center;
    font-size: 1.5vw;
    margin-bottom: 2vw;
    margin-top: 1vw;
    color: rgba(255, 50, 50, 0.8);
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

  .password-visibility-button:hover,
  .password-visibility-button:active,
  .copy-button:hover,
  .copy-button:active {
    filter: none;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0);
    opacity: 1;
  }

  /* Profile dialog window */

  .profile-container {
    padding: 1.5vw;
    width: 65vw;
    height: 90%;
    background-color: rgba(1, 0, 32, 0.75);
    border: 0.05vw solid rgba(51, 226, 230, 0.75);
    border-radius: 2.5vw;
    overflow-x: hidden;
  }

  .profile-container::-webkit-scrollbar {
    width: 0.5vw;
  }

  .profile-container::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0);
  }

  .profile-container::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(51, 226, 230, 0.5),
      rgba(0, 0, 0, 0)
    );
    border-radius: 0.5vw;
  }

  .profile-container::backdrop {
    background: rgba(0, 0, 0, 0.75);
  }

  .profile-container[open] {
    animation: zoom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .profile-container[open]::backdrop {
    animation: fade 0.25s ease-out;
  }

  .profile-container > div {
    display: flex;
    flex-flow: column nowrap;
  }

  .profile-navigation {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .close-button {
    padding: 1.5vw;
    font-size: 2vw;
    line-height: 2vw;
  }

  .buttons-container {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    gap: 2vw;
    padding-inline: 10vw;
  }

  .sign-button {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }

  .sign-icon {
    opacity: 0.9;
    height: 2.5vw;
    width: auto;
  }

  .sign-lable {
    font-size: 2vw;
    width: 100%;
  }

  .sign-title {
    text-align: center;
    color: #dedede;
    font-size: 3vw;
  }

  /* SIGNIN with EMAIL */

  .login-form,
  .signup-form,
  .ref-code-form {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
  }

  .input-label {
    font-size: 1.5vw;
    line-height: 1.5vw;
    margin-bottom: 0.5vw;
    color: rgba(255, 255, 255, 0.5);
  }

  .user-input {
    width: 30vw;
    font-size: 2vw;
    line-height: 2.5vw;
    padding: 2vw;
    margin-bottom: 2vw;
    color: rgba(51, 226, 230, 0.75);
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
    background-color: rgba(1, 0, 32, 0.75);
    outline: none;
  }

  .forgot-password {
    color: rgba(51, 226, 230, 0.65);
    font-size: 1.5vw;
    padding-top: 2vw;
  }

  .submit-button {
    min-width: 30vw;
    padding: 1vw 2vw;
    color: rgba(51, 226, 230, 0.75);
    background-color: rgba(51, 226, 230, 0.1);
    cursor: pointer;
  }

  .user-profile-info,
  .wallet-connect,
  .google-connect {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
  }

  .agreements-container {
    display: flex;
    flex-flow: column nowrap;
    width: 85%;
    padding-bottom: 2vw;
  }

  .agreement {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: baseline;
    padding: 1vw;
  }

  #terms,
  #newsletter {
    -webkit-transform: scale(3);
    transform: scale(3);
    flex: 1;
    accent-color: rgba(51, 226, 230, 0.75);
  }

  .terms,
  .newsletter {
    font-size: 1.75vw;
    line-height: 3vw;
    padding-left: 1vw;
    flex: 10;
    color: rgba(255, 255, 255, 0.65);
  }

  .terms > a {
    color: rgba(255, 255, 255, 0.75);
  }

  /* SIGNIN */

  .signup-label {
    text-align: center;
    color: #bebebe;
    font-size: 2vw;
    margin-block: 1vw 3vw;
  }

  .signup-label a {
    color: rgba(255, 255, 255, 0.9);
  }

  #refferal-code {
    text-align: center;
  }

  /* User logged in */

  .user-properties {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  .user-prop {
    font-size: 2vw;
    line-height: 4vw;
    color: rgba(255, 255, 255, 0.5);
  }

  .user-prop-value {
    text-align: center;
    width: 45vw;
    height: 5vw;
    font-size: 2vw;
    line-height: 4vw;
    border: 0.05vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
    outline: none;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(51, 226, 230, 0.05);
    margin-bottom: 1vw;
  }

  .user-prop-value:disabled {
    opacity: 1; /* for iOS */
  }

  .password-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 4vw;
    margin-bottom: 1vw;
  }

  #password {
    margin-bottom: 0;
  }

  #password-confirmation {
    border: 0.2vw solid rgba(51, 226, 230, 0.75);
  }

  .password-visibility-button {
    margin-left: 1vw;
    width: 3vw;
    height: 3vw;
    background-image: url("/icons/invisibleicon.png");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .password-visibility-button:active {
    background-image: url("/icons/visibleicon.png");
  }

  .edit-buttons {
    display: flex;
    justify-content: center;
    margin-inline: auto;
  }

  .edit-username,
  .edit-password,
  .save-changes {
    margin: 2vw 1vw;
    font-size: 1.75vw;
    line-height: 2vw;
  }

  /* Story games number */

  .story-games-container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
  }

  .story-games-number-label {
    margin: 1vw 0;
    color: rgba(51, 226, 230, 0.65);
    font-size: 1.5vw;
  }

  .story-games-number {
    color: rgba(51, 226, 230, 0.9);
    font-size: 1.6vw;
  }

  /* Referral codes container */

  .refferal-codes-legend {
    text-align: center;
    font-size: 2vw;
    line-height: 4vw;
    color: rgba(255, 255, 255, 0.7);
  }

  .refferal-codes {
    width: 90%;
    padding: 2vw;
    margin-inline: auto;
    display: grid;
    grid-template-columns: 50% 50%;
    justify-content: center;
    gap: 1vw;
    border: 0.1vw solid rgba(51, 226, 230, 0.5);
    border-radius: 2.5vw;
    background-color: rgba(51, 226, 230, 0.1);
  }

  .ref-code-container {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.1);
    border: 0.05vw solid rgba(51, 226, 230, 0.25);
    border-radius: 1.5vw;
    padding: 0.5vw 1vw;
  }

  .ref-code {
    text-align: ridht;
    font-size: 1.8vw;
    line-height: 4vw;
    color: rgba(255, 255, 255, 0.5);
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
    background-image: url("/icons/copyicon.png");
    background-size: contain;
    background-repeat: no-repeat;
  }

  .copy-button:active {
    background-image: url("/icons/checkmark.png");
  }

  .used {
    color: rgba(255, 255, 255, 0.35);
    -webkit-text-stroke: 0.05vw rgba(255, 0, 0, 0.35);
  }

  .not-used {
    color: rgba(255, 255, 255, 0.75);
    filter: drop-shadow(0 0 0.1vw rgba(51, 226, 230, 0.9));
  }

  /* Profile icon */

  .profile-icon {
    position: absolute;
    top: 2vw;
    right: 2vw;
    height: 7vw;
    width: 7vw;
    cursor: pointer;
    background-image: url("/icons/profileIcon.avif");
    background-size: contain;
    opacity: 0.4;
    z-index: 1;
  }

  .profile-icon:hover,
  .profile-icon:active {
    filter: drop-shadow(0 0 1vw rgba(51, 226, 230, 0.5));
    opacity: 0.75;
  }

  @media only screen and (max-width: 600px) {
    hr {
      margin: 2em 0;
    }

    button {
      font-size: 1.4em;
      line-height: 1.4em;
      padding: 0.25em 1em;
    }

    .close-button {
      padding: 0.5em;
      font-size: 1.5em;
      line-height: 1em;
    }

    .buttons-container {
      gap: 1em;
      padding-inline: 5vw;
    }

    .sign-icon {
      height: 1em;
    }

    .sign-lable {
      font-size: 0.9em;
      line-height: 1.5em;
    }

    .sign-title {
      text-align: center;
      color: #dedede;
      font-size: 1.5em;
    }

    .signup-label {
      font-size: 1em;
      line-height: 1.5em;
      padding-inline: 5vw;
      margin-bottom: 1em;
    }

    .validation-check {
      font-size: 0.9em;
      margin: 0.5em 0;
    }

    .forgot-password {
      font-size: 0.9em;
      padding-top: 1.5em;
    }

    .profile-container {
      padding: 1em;
      width: 85vw;
      height: 65%;
      border-radius: 1em;
      overflow-y: scroll;
    }

    .input-label {
      font-size: 0.9em;
      line-height: 0.9em;
      padding-bottom: 0.5em;
    }

    .user-input {
      width: 80vw;
      font-size: 1.4em;
      line-height: 1.6em;
      margin-bottom: 1em;
    }

    .agreements-container {
      width: 95%;
      padding-bottom: 1em;
    }

    .terms,
    .newsletter {
      font-size: 1em;
      line-height: 1.5em;
      padding-left: 1em;
    }

    #terms,
    #newsletter {
      -webkit-transform: scale(1.5);
      transform: scale(1.5);
    }

    .submit-button {
      width: 50vw;
    }

    .story-games-number-label {
      margin: 0.5em 0 1em 0;
      font-size: 0.9em;
    }

    .story-games-number {
      font-size: 1em;
    }

    .user-prop,
    .user-prop-value,
    .refferal-codes-legend {
      font-size: 1em;
      line-height: 2.5em;
    }

    .user-prop-value {
      width: 70vw;
      height: 2.5em;
      margin-bottom: 0.5em;
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

    .edit-username,
    .edit-password,
    .save-changes {
      margin: 1em 0.5em;
      font-size: 1em;
      line-height: 2em;
    }

    .refferal-codes {
      grid-template-columns: 100%;
      gap: 0.5em;
      padding: 0.5em;
      width: 95%;
    }

    .ref-code-container {
      padding: 0 1em;
      border-radius: 0.5em;
    }

    .ref-code {
      font-size: 1.2em;
      line-height: 3em;
    }

    .copy-button {
      width: 1em;
      height: 1em;
    }

    .profile-icon {
      width: 3em;
      height: 3em;
      top: 1em;
      right: 0.5em;
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
