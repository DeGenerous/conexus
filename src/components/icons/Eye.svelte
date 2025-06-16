<script lang="ts">
  import passwordVisible from '@stores/password-visibility.svelte';

  let { visibility }: { visibility: Password } = $props();

  let visible = $state<boolean>(false);

  const updateVisibility = () => {
    switch (visibility) {
      case 'login': {
        passwordVisible.login = !passwordVisible.login;
        visible = passwordVisible.login;
        break;
      }
      case 'signup': {
        passwordVisible.signup = !passwordVisible.signup;
        visible = passwordVisible.signup;
        break;
      }
      case 'edit': {
        passwordVisible.edit = !passwordVisible.edit;
        visible = passwordVisible.edit;
        break;
      }
      case 'reset': {
        passwordVisible.reset = !passwordVisible.reset;
        visible = passwordVisible.reset;
        break;
      }
    }
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<button
  class="void-btn flex"
  class:visible
  type="button"
  onclick={updateVisibility}
  aria-label="Show password"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-100 -100 200 200"
    fill="none"
    stroke-width="15"
    stroke-linejoin="round"
    stroke-linecap="round"
    opacity="0.75"
  >
    <defs>
      <mask id="eye-svg-top-mask">
        <rect
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
</button>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  button {
    width: 2rem;
    fill: none;
    stroke: $light-blue;

    &:hover,
    &:active,
    &:focus {
      @include scale;
    }

    &.visible {
      stroke: $cyan;
    }
  }
</style>
