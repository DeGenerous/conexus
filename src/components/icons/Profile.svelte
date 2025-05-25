<script lang="ts">
  export let onClick = () => {};

  let profileSvgFocus: boolean = false;
</script>

<button
  class="top-right-icon void-btn flex fade-in"
  aria-label="Profile"
  on:click={onClick}
  on:pointerover={() => (profileSvgFocus = true)}
  on:pointerout={() => (profileSvgFocus = false)}
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
    <defs>
      <mask id="profile-svg-mask">
        <circle r="95" fill="white" />
        <g fill="black" transform={profileSvgFocus ? 'scale(1.1)' : ''}>
          <circle cy="-25" r="30" />
          <path
            d="
            M -55 55
            Q -60 20 -25 15
            L 25 15
            Q 60 20 55 55
            Z
          "
          />
        </g>
      </mask>
    </defs>
    <circle r="95" mask="url(#profile-svg-mask)" />
  </svg>
</button>

<style lang="scss">
  @use "/src/styles/mixins" as *;

  button {
    fill: $light-blue;

    &:hover,
    &:active,
    &:focus {
      fill: $cyan;
    }
  }
</style>
