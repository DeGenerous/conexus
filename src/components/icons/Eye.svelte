<script lang="ts">
  import passwordVisible from '@stores/password-visibility';

  type Password = 'login' | 'signup' | 'edit' | 'reset';

  export let visibility: Password;
  let visible = false;

  const updateVisibility = () => {
    passwordVisible.update((password) => {
      switch (visibility) {
        case 'login': {
          password.login = !password.login;
          visible = password.login;
          break;
        }
        case 'signup': {
          password.signup = !password.signup;
          visible = password.signup;
          break;
        }
        case 'edit': {
          password.edit = !password.edit;
          visible = password.edit;
          break;
        }
        case 'reset': {
          password.reset = !password.reset;
          visible = password.reset;
          break;
        }
      }
      return password;
    });
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-100 -100 200 200"
  class="eye-svg"
  fill="none"
  stroke="rgb(51, 226, 230)"
  stroke-width="15"
  stroke-linejoin="round"
  stroke-linecap="round"
  opacity="0.75"
  on:click={updateVisibility}
  role="button"
  tabindex="0"
  aria-label="Show password"
>
  <defs>
    <mask id="eye-svg-top-mask">
      <rect
        class="eye-svg-top"
        x="-100"
        y="-100"
        width="200"
        height="200"
        fill="white"
        style="transform: {visible ? 'none' : 'translateX(-200px)'}"
      />
    </mask>
    <mask id="eye-svg-bottom-mask">
      <rect
        class="eye-svg-bottom"
        x="100"
        y="-100"
        width="200"
        height="200"
        fill="white"
        style="transform: {visible ? 'none' : 'translateX(-200px)'}"
      />
    </mask>
    <mask id="eye-svg-crossed-out-mask">
      <g stroke="white">
        <circle r="20" />
        <path
          d="
            M -80 0
            Q 0 -90 80 0
            Q 0 90 -80 0
            Z
          "
        />
      </g>
      <line x1="55" y1="-75" x2="-95" y2="75" stroke="black" />
    </mask>
  </defs>

  <g mask="url(#eye-svg-top-mask)">
    <circle r="20" />
    <path
      d="
        M -80 0
        Q 0 -90 80 0
        Q 0 90 -80 0
        Z
      "
    />
  </g>

  <g mask="url(#eye-svg-bottom-mask)">
    <g mask="url(#eye-svg-crossed-out-mask)">
      <circle r="20" />
      <path
        d="
          M -80 0
          Q 0 -90 80 0
          Q 0 90 -80 0
          Z
        "
      />
    </g>
    <line x1="75" y1="-75" x2="-75" y2="75" />
  </g>
</svg>
