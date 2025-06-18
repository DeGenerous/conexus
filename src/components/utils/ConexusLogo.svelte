<div class="flex">
  <picture class="flex">
    <source srcset="title.avif" type="image/avif" />
    <img src="title.png" alt="CoNexus" draggable="false" />
  </picture>

  <svg
    class="sin-wave waving"
    viewBox="-70 0 840 200"
    xmlns="http://www.w3.org/2000/svg"
    fill="rgb(51,226,230)"
  >
    <path
      d="
        M 0,25
        Q 50,0 100,25
        T 200,25
        T 300,25
        T 400,25
        T 500,25
        T 600,25
        T 700,25

        A 25 45 0 0 1 700,175

        Q 650,200 600,175
        T 500,175
        T 400,175
        T 300,175
        T 200,175
        T 100,175
        T 0,175

        A 25 45 0 0 1 10,25

        Z
    "
    >
      <animate
        attributeName="fill"
        values="
          rgb(51,226,230);
          rgb(160, 120, 255);
          rgb(56,117,250);
        "
        dur="8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>

  <svg
    class="cos-wave waving"
    viewBox="-70 0 840 200"
    xmlns="http://www.w3.org/2000/svg"
    fill="rgb(56,117,250)"
  >
    <path
      d="
        M 0,25
        Q 50,50 100,25
        T 200,25
        T 300,25
        T 400,25
        T 500,25
        T 600,25
        T 700,25

        A 25 50 0 0 1 700,175

        Q 650,150 600,175
        T 500,175
        T 400,175
        T 300,175
        T 200,175
        T 100,175
        T 0,175

        A 25 50 0 0 1 0,25

        Z
    "
    >
      <animate
        attributeName="fill"
        values="
          rgb(56,117,250);
          rgb(36, 65, 189);
          rgb(120,100,190);
          rgb(22, 30, 95);
          rgb(51,226,230);
        "
        dur="8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>

  <svg
    class="small-wave waving"
    viewBox="-30 0 810 200"
    xmlns="http://www.w3.org/2000/svg"
    fill="rgb(120,100,190)"
  >
    <path
      d="
      M 0,25
      Q 25,0 50,25
      T 100,25
      T 150,25
      T 200,25
      T 250,25
      T 300,25
      T 350,25
      T 400,25
      T 450,25
      T 500,25
      T 550,25
      T 600,25
      T 650,25
      T 700,25
      T 750,25

      A 25 80 0 0 1 750,175

      Q 725,200 700,175
      T 650,175
      T 600,175
      T 550,175
      T 500,175
      T 450,175
      T 400,175
      T 350,175
      T 300,175
      T 250,175
      T 200,175
      T 150,175
      T 100,175
      T 50,175
      T 0,175

      A 25 80 0 0 1 0,25

      Z
    "
    >
      <animate
        attributeName="fill"
        values="
          rgb(255, 140, 0);
          rgb(200, 140, 140);
          rgb(255, 60, 64);
          rgb(0, 185, 55);
        "
        dur="8s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
</div>

<style lang="scss">
  @use '/src/styles/mixins' as *;

  div {
    position: relative;
    width: 100%;
    max-width: 15rem;

    @include respond-up(small-desktop) {
      margin: 3rem auto;
      width: clamp(10rem, 40%, 25rem);
      max-width: unset;
    }

    picture {
      gap: 0;
    }

    svg {
      position: absolute;
      stroke: none;
      fill: $cyan;
    }

    .sin-wave {
      width: 120%;
      z-index: -1;
    }

    .cos-wave {
      width: 120%;
      z-index: -2;
      animation-delay: -2s;
      opacity: 0.75;
    }

    .small-wave {
      width: 115%;
      z-index: -3;
      animation-delay: -3s;
      opacity: 0.5;
    }
  }
</style>
