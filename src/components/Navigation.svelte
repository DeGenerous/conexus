<script lang="ts">
  // import { CoNexusApp } from '@lib/view';
  import { authenticated } from '@stores/account.svelte';
  import { prevStory, nextStory } from '@stores/navigation.svelte';
  import { story } from '@stores/conexus.svelte';

  import BackArrow from '@components/icons/BackArrow.svelte';
  import Profile from '@components/Profile.svelte';
  import ConexusLogo from '@components/utils/ConexusLogo.svelte';
  import Background from '@components/utils/Background.svelte';

  let {
    header = '',
    storyName,
    subheading = '',
    activeTab = 'Home',
    arrow = null,
  }: {
    header: string;
    storyName: string;
    subheading: string;
    activeTab: string;
    arrow: Nullable<string>;
  } = $props();

  const admin = $derived.by<boolean>(() => {
    if ($authenticated?.user) return $authenticated.user.role === 'admin';
    else return false;
  });

  // let app: CoNexusApp = new CoNexusApp();

  let sections: string[] = ['Community Picks', 'Collabs', 'Dischordian Saga'];

  const activeSectionIndex = sections.indexOf(activeTab);
  const prevSectionIndex =
    activeSectionIndex == 0 ? sections.length - 1 : activeSectionIndex - 1;

  // $effect(async () => {
  //   sections = await app
  //     .getSections()
  //     .then((data) => data.map(({ id, name }) => name));
  // });

  const prevSectionLink = (): Nullable<string> => {
    if (!sections.includes(activeTab)) return null;
    return `/sections/${sections[prevSectionIndex]}`;
  };

  const nextSectionLink = (): Nullable<string> => {
    if (!sections.includes(activeTab)) return null;
    return `/sections/${sections[(activeSectionIndex + 1) % sections.length]}`;
  };
</script>

{#if $story === null && storyName !== 'Maintenance'}
  <header
    class="flex-row pad-inline blur transition semi-transparent-dark-bg shad-behind dark-glowing-opaque"
  >
    {#if arrow}
      <BackArrow href={arrow} />
    {:else}
      <a
        class="top-left-icon flex fade-in"
        href="https://degenerousdao.com/"
        target="_blank"
        aria-label="DeGenerous"
      >
        <img src="/logo.avif" alt="Logo" />
      </a>
    {/if}

    {#if header === 'CoNexus'}<ConexusLogo />{/if}

    <h1 class:sr-only={header === 'CoNexus'}>{header}</h1>

    <Profile />
  </header>

  {#if subheading}
    <p class="mobile-text-wrapper subheading pad-inline text-shad">
      {@html subheading}
    </p>
  {/if}

  <nav
    class="flex-row blur transition semi-transparent-dark-bg shad-behind dark-glowing-opaque"
  >
    <!-- PREVIOUS SECTION -->
    <a
      class="fade-in"
      class:inactive={(!sections.includes(activeTab) && !storyName) ||
        (storyName && !prevStory.link)}
      href={storyName ? prevStory.link : prevSectionLink()}
      target="_self"
      draggable="false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        fill="white"
      >
        <polygon
          points="-75 0 -10 -65 -10 65"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect x="-30" y="-25" width="100" height="50" rx="5" />
      </svg>
      <p>
        {#if sections.includes(activeTab) && !storyName}
          {sections[prevSectionIndex]}
        {:else if storyName}
          {prevStory.name}
        {/if}
      </p>
    </a>

    <!-- Dashboard -->
    {#if admin}
      <a
        class="fade-in"
        class:active={activeTab === 'Dashboard'}
        href="/dashboard"
        target="_self"
        draggable="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-100 -100 200 200"
          fill="none"
          stroke="white"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="-60" y="-60" width="45" height="67.5" />
          <rect x="-60" y="30" width="45" height="30" />
          <rect x="7.5" y="-60" width="52.5" height="30" />
          <rect x="7.5" y="-7.5" width="52.5" height="67.5" />
        </svg>
        <p>Dashboard</p>
      </a>
    {/if}

    <!-- HOME -->
    <a
      class="fade-in"
      class:active={activeTab === 'Home'}
      href="/"
      target="_self"
      draggable="false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        fill="white"
        stroke="white"
        stroke-width="15"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="
              M -65 -17.5 L -65 70 L 65 70 L 65 -17.5
              M -80 -10 L 0 -75 L 80 -10
            "
          fill="none"
        />
        <rect x="-15" y="15" width="30" height="50" />
        <rect x="60" y="-57.5" width="5" height="30" />
      </svg>
      <p>Home</p>
    </a>

    <!-- DREAM -->
    {#if admin}
      <a
        class="fade-in"
        class:active={activeTab === 'Dream'}
        href="/dashboard/dream"
        target="_self"
        draggable="false"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          fill="white"
        >
          <g
            transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"
          >
            <path
              d="M740.4,3768.7C87,3543.9-114.7,2648.9,362.2,2102.6c157.6-180.7,413.9-289.9,676.5-289.9c153.4,0,399.2,44.1,472.7,81.9c44.1,25.2,44.1,8.4-29.4,329.9l-10.5,46.2l-124-37.8c-292-92.5-519-69.3-680.7,65.1c-353,292.1-298.3,886.6,98.7,1096.7c117.7,60.9,344.6,63,464.3,4.2c205.9-100.8,413.9-405.5,523.2-766.9c134.5-449.6,615.6-2426.7,819.4-3361.7c199.6-922.4,327.8-1691.3,327.8-1970.8c0-323.6-256.3-535.8-607.2-502.2c-378.2,33.6-632.4,432.8-519,819.4c65.1,222.7,264.7,407.6,464.3,428.6c52.5,6.3,94.5,16.8,94.5,25.2c0,25.2-79.8,340.4-86.1,348.8c-6.3,4.2-50.4,0-98.7-12.6c-296.2-65.1-567.3-321.5-676.5-636.6c-153.4-447.5,16.8-985.4,386.6-1220.7c231.1-145,56.7-136.6,2706.1-136.6c2115.8,0,2401.5,4.2,2470.8,33.6c96.7,39.9,184.9,121.9,235.3,220.6c52.5,100.9,92.5,336.2,77.7,458c-16.8,134.5-416,1878.3-434.9,1899.3c-8.4,10.5-52.5-8.4-96.6-37.8c-46.2-31.5-126.1-79.8-180.7-107.2c-56.7-29.4-96.6-60.9-90.3-77.7c4.2-12.6,94.6-399.2,199.6-855.1c163.9-703.8,191.2-848.8,182.8-956c-8.4-86.1-23.1-132.4-48.3-151.3c-29.4-21-401.3-27.3-1851-27.3c-998,0-1813.2,6.3-1813.2,16.8c0,8.4,18.9,65.1,42,126.1c23.1,60.9,48.3,166,54.6,231.1c48.3,453.8-298.4,2187.2-947.6,4748.4c-224.8,880.3-304.7,1126.1-441.2,1340.5c-39.9,63-73.5,119.8-73.5,124c0,6.3,771.1,10.5,1712.3,10.5h1712.4l79.8-73.5c159.7-142.9,252.1-376.1,371.9-945.5c75.7-355.1,380.3-1691.3,401.3-1756.5c6.3-25.2,54.6,12.6,178.6,140.8l170.2,174.4l-182.8,815.2c-264.7,1178.7-277.3,1235.4-338.3,1388.8c-117.7,296.2-302.6,527.4-497.9,613.5c-86.1,39.9-163.9,42-2346.9,39.9C977.8,3806.5,845.5,3804.5,740.4,3768.7z"
            />

            <path
              d="M9583.7,3104.8C9071.1,2859,7953.3,1968.1,7005.7,1050c-907.6-876.1-1296.3-1441.3-1206-1743.9l25.2-84l-302.6-302.6c-163.9-163.9-294.1-300.4-287.8-300.4c6.3,0,81.9,23.1,166,52.5c140.8,48.3,174.4,71.4,350.9,243.7c149.2,147.1,203.8,189.1,231.1,176.5c205.9-81.9,485.3,29.4,916.1,371.9C7161.2-326.2,7825.1,323,8222.2,762.1l294.2,325.7l-166,14.7c-422.3,39.9-443.3,42-378.2,60.9c33.6,8.4,212.2,46.2,399.2,84l338.3,65.1l147.1,180.7c218.5,266.8,214.3,256.3,121.9,231.1c-540-151.3-748-199.6-703.8-163.9c63,52.5,470.6,294.1,855.1,508.5l315.2,174.4l140.8,210.1c237.4,350.9,353,617.7,302.5,699.6C9861,3199.4,9741.3,3180.4,9583.7,3104.8z"
            />

            <path
              d="M5398.4,2726.6c-18.9-18.9-533.7-153.4-642.9-168.1c-107.1-14.7-111.3-12.6-111.3,37.8c0,65.1-60.9,119.8-138.7,119.8c-33.6,0-229-60.9-434.9-136.6c-205.9-75.6-413.9-142.9-464.3-149.2l-92.4-12.6l10.5,94.6c14.7,121.9-39.9,182.8-155.5,182.8c-98.7,0-359.3-107.2-594.6-243.7c-159.7-92.4-178.6-109.2-178.6-163.9c0-121.9,50.4-117.7,321.5,25.2c136.6,71.4,287.8,142.9,336.2,159.7l88.2,31.5v-90.3c0-241.6,174.4-245.8,787.9-16.8c302.5,111.3,336.2,119.8,342.5,86.1c12.6-65.1,107.2-124,201.7-124c172.3,2.1,785.8,163.9,859.3,226.9c71.4,63,29.4,151.3-69.3,151.3C5432.1,2737.1,5402.6,2732.9,5398.4,2726.6z"
            />

            <path
              d="M5474.1,1440.8c-126.1-60.9-237.4-111.4-245.8-111.4c-8.4,0-8.4,31.5-2.1,69.3c8.4,50.4,0,77.7-33.6,107.1c-63,56.7-149.2,25.2-416-145c-220.6-142.9-256.3-187-216.4-262.6c35.7-65.1,86.1-52.5,262.6,69.3c124,81.9,166,100.8,174.4,79.8c6.3-16.8,33.6-54.6,60.9-81.9c71.5-71.4,166-52.5,472.7,94.5c247.9,117.7,285.7,153.4,258.4,235.3C5768.2,1564.8,5709.4,1556.3,5474.1,1440.8z"
            />

            <path
              d="M3396.1,1360.9c-96.6-33.6-275.2-153.4-357.2-239.5c-42-44.1-56.7-77.7-50.4-119.8c10.5-90.3,79.8-90.3,189.1-2.1c142.9,115.6,264.7,187,287.8,172.3c12.6-6.3,23.1-39.9,23.1-71.4c0-79.8,73.5-170.2,136.6-170.2c81.9,0,676.5,254.2,708.1,302.5c29.4,44.1,16.8,115.6-25.2,138.7c-35.7,18.9-79.8,6.3-247.9-69.3c-245.8-113.5-361.4-161.8-382.4-161.8c-10.5,0-23.1,37.8-31.5,84c-8.4,52.5-33.6,98.8-67.2,126.1C3515.9,1398.8,3505.4,1400.8,3396.1,1360.9z"
            />

            <path
              d="M4753.4,5.8c-222.7-81.9-441.2-153.4-487.4-159.7l-81.9-12.6l18.9,65.1c44.1,155.5-58.8,247.9-233.2,210.1c-109.2-25.2-392.9-155.5-567.3-260.5c-105.1-65.1-124-86.2-124-136.6c0-39.9,14.7-69.3,42-84c35.7-18.9,69.3-6.3,193.3,65.1c147.1,86.2,361.4,189.1,453.8,216.4c42,14.7,46.2,8.4,46.2-71.4c0-63,12.6-98.8,52.5-136.6c94.5-96.7,239.5-71.4,790,136.6c151.3,58.8,277.3,105.1,281.5,105.1c2.1,0,16.8-27.3,31.5-63c33.6-79.8,126.1-107.2,283.6-86.2c63,8.4,117.7,21,121.9,25.2c4.2,4.2,33.6,54.6,67.2,111.4l58.8,103l-71.4-14.7c-39.9-8.4-119.8-21-180.7-27.3c-105-10.5-109.2-10.5-123.9,44.1c-14.7,58.8-82,117.7-134.5,117.7C5173.6,150.7,4976.1,85.6,4753.4,5.8z"
            />

            <path
              d="M4097.9-1273.8c-96.7-29.4-184.9-84-313.1-191.2c-130.3-107.2-157.6-172.3-102.9-226.9c39.9-39.9,79.8-29.4,172.3,44.1c119.8,98.8,250,182.8,277.3,182.8c12.6,0,29.4-39.9,35.7-88.3c14.7-111.3,79.8-172.3,172.3-157.6c56.7,8.4,468.5,180.7,527.4,220.6c12.6,8.4,29.4,60.9,33.6,115.6c14.7,121.9,35.7,124-292.1-25.2c-130.3-58.8-243.7-107.1-254.2-107.1c-10.5,0-25.2,35.7-31.5,79.8C4299.6-1290.6,4219.7-1236,4097.9-1273.8z"
            />
          </g>
        </svg>
        <p>Dream</p>
      </a>
    {/if}

    <!-- NEXT SECTION -->
    <a
      class="fade-in"
      class:inactive={(!sections.includes(activeTab) && !storyName) ||
        (storyName && !nextStory.link)}
      href={storyName ? nextStory.link : nextSectionLink()}
      target="_self"
      draggable="false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-100 -100 200 200"
        fill="white"
        style:transform="rotate(180deg)"
      >
        <polygon
          points="-75 0 -10 -65 -10 65"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <rect x="-30" y="-25" width="100" height="50" rx="5" />
      </svg>
      <p>
        {#if sections.includes(activeTab) && !storyName}
          {sections[(activeSectionIndex + 1) % sections.length]}
        {:else if storyName}
          {nextStory.name}
        {/if}
      </p>
    </a>
  </nav>
{/if}

<Background />

<style lang="scss">
  @use '/src/styles/mixins' as *;

  /* MOBILE Styling */

  header {
    min-height: 4rem;
    position: fixed;
    top: 0;
    width: 100vw;
    justify-content: space-between;
    gap: 1rem;
    z-index: 100;

    @include respond-up(small-desktop) {
      position: static;
      width: auto;
      justify-content: center;
      min-height: unset;
      background-color: transparent !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none;
      box-shadow: none;
    }

    h1 {
      text-transform: capitalize;
      @include text-shadow;
    }
  }

  .subheading {
    margin: 2rem auto;
    @include text-shadow;

    @include respond-up(small-desktop) {
      width: clamp(20rem, 95%, 80rem);
      margin-block: 1rem 2rem;
    }
  }

  nav {
    position: fixed;
    bottom: 0;
    width: 100vw;
    justify-content: space-between;
    gap: 0;
    z-index: 100;

    a {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      opacity: 0.75;
      fill: $white;
      stroke: $white;
      @include white-txt;

      &:first-of-type {
        padding-left: 0.5rem;
      }

      &:last-of-type {
        padding-right: 0.5rem;
      }

      svg {
        width: 2rem;
      }

      &.active {
        opacity: 1;
        @include cyan(1, text);

        svg {
          fill: $cyan;
          stroke: $cyan;
        }
      }

      &.inactive {
        opacity: 0.2;
      }

      p {
        white-space: nowrap;
        max-width: 5rem;
        text-overflow: ellipsis;
        overflow-x: hidden;
        text-transform: uppercase;
        font-size: 0.5rem;

        @include respond-up(tablet) {
          max-width: 7rem;
          text-transform: none;
        }
      }
    }

    /* PC Styling */

    @include respond-up(small-desktop) {
      display: flex;
      position: fixed;
      top: 0;
      bottom: unset;
      left: 50%;
      right: 50%;
      transform: translateX(-50%);
      justify-content: space-around;
      gap: 0;
      width: clamp(30rem, 80%, 80rem);
      margin-inline: auto;
      border-bottom-left-radius: 10rem 5rem;
      border-bottom-right-radius: 10rem 5rem;
      box-shadow: $shadow-plus-inset-glow;

      @starting-style {
        transform: translate(-50%, -100%);
      }

      a {
        width: 100%;
        flex-flow: row;
        padding: 0.5rem 1rem;
        gap: 0.5rem;
        opacity: 1;
        @include light-blue(1, text);

        &:first-of-type {
          border-bottom-left-radius: inherit;
          padding-left: 2rem;
        }

        &:last-of-type {
          border-bottom-right-radius: inherit;
          padding-right: 2rem;
          flex-direction: row-reverse;
        }

        &:hover:not(&.inactive),
        &:active:not(&.inactive),
        &:focus:not(&.inactive) {
          @include cyan(0.1);
          @include cyan(1, text);
          @include bright;

          svg {
            fill: $cyan;
            stroke: $cyan;
          }
        }

        &.active {
          background-image: radial-gradient(
            ellipse at center top,
            rgba(51, 226, 230, 0.1),
            rgba(51, 226, 230, 0)
          );
        }

        &.inactive {
          cursor: not-allowed;
        }

        svg {
          height: 1rem;
          width: auto;
          fill: $light-blue;
          stroke: $light-blue;
        }

        p {
          color: inherit;
          @include font(small);

          // Fallback if no support
          opacity: 1;

          @starting-style {
            opacity: 0;
          }
        }
      }
    }
  }
</style>
