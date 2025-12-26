import { NAV_ROUTES } from './routes';

// FAQ content rendered on the /learn onboarding pages
const frequentlyAskedQuestions: {
  question: string;
  answer: string;
}[] = [
  {
    question: 'How do I start?',
    answer: `
      <p>
        You can start by visiting <a href=${NAV_ROUTES.CONEXUS}>conexus.ink</a> and choosing one of three sign-in options:
      </p>
      <ul class="default-ul" flex>
        <li>
          <b>Web3 Wallet</b> – Fastest login, no referral code needed. But this option has limited functionality for now.
        </li>
        <li>
          <b>Google Account</b> – Instant sign-in (requires referral code).
        </li>
        <li>
          <b>Email Sign-Up</b> – Slightly more setup, but gives you the most control and access. Also requires a referral code.
        </li>
      </ul>
      <p>👉 <b>Need a referral code?</b> Join our <a href=${NAV_ROUTES.DISCORD}>Discord</a> and check the <code>#ref-codes</code> channel to get one instantly.</p>
    `,
  },
  {
    question: 'How do referral codes work?',
    answer: `
      <p>
        Once you create a Web2 CoNexus account, go to your profile and click <b>“Get Referral Codes.”</b> You’ll receive <b>10 custom codes</b> you can share with friends to onboard them directly.
      </p>
      <p>
        Every referral helps grow the multiverse — and yes, <b>you can earn rewards</b> for sharing.
        To be eligible for <b>crypto-based rewards</b>, make sure to <b>connect a Web3 wallet to your Web2 account</b>.
      </p>
    `,
  },
  {
    question: 'Do I need a crypto wallet?',
    answer: `
      <p>
        No — but having one unlocks more.
      </p>
      <p>
        You can create a CoNexus account with just an email or Google login, but if you also connect a crypto wallet, you’ll be eligible for <b>Web3-specific rewards</b>, including future governance and creator tools.
      </p>
    `,
  },
  {
    question: 'Is CoNexus free?',
    answer: `
      <p>
        Yes — creating an account and playing stories is free.
      </p>
      <p>
        <b>Our features</b> include access to a growing library of stories, referral codes, early customization tools, and creator functionality. Future monetization options will empower creators to earn without paywalls for players.
      </p>
    `,
  },
  {
    question: 'What is DGRS LABS?',
    answer: `
      <p>
        <a href="${NAV_ROUTES.WEBSITE}" target="_blank">DGRS LABS</a> is a collective building media technology for the next generation of creators. We're focused on reimagining storytelling as something <b>interactive, social, and creator-owned</b>, starting with our core platform: <b>CoNexus</b>.
      </p>
    `,
  },
  {
    question: 'What is CoNexus?',
    answer: `
      <p>
        CoNexus is a platform where anyone can create, customize, and play <b>interactive story games</b> — powered by AI, shaped by user choices, and infinitely replayable.
      </p>
      <p>
        It’s the first expression of our broader goal: building a <b>text-to-story engine</b> that will soon support text-to-novel, text-to-film, and beyond.
      </p>
    `,
  },
  {
    question: 'How is CoNexus different from other storytelling tools?',
    answer: `
      <p>
        CoNexus isn’t just a tool — it’s a <b>social storytelling platform</b>.
      </p>
      <p>
        Every story is dynamic, customizable, and remixable — with branching outcomes, multimedia experiences, and the ability to evolve alongside communities.
      </p>
    `,
  },
  {
    question: 'What does “text-to-story” mean?',
    answer: `
      <p>
        Text2Story is our foundation — a system that turns simple written input into <b>interactive, personalized, and multi-format narratives.</b>
      </p>
      <p>
        Right now, that means <b>text-to-CYOA</b> (choose your own adventure). With v2, it will include <b>text-to-novel, text-to-film</b>, and beyond.
      </p>
    `,
  },
  {
    question: 'What can I do on CoNexus today?',
    answer: `
      <ul class="default-ul" flex>
        <li>
          Play dynamic, choice-driven stories across 18+ genres
        </li>
        <li>
          Remix stories by adjusting visuals, tone, narration, language, and length
        </li>
        <li>
          Create and publish your own interactive narratives
        </li>
        <li>
          Use and share referral codes to onboard new users and earn rewards
        </li>
      </ul>
    `,
  },
  {
    question: 'What’s coming next?',
    answer: `
      <h5>🌀 v1.5</h5>
      <ul class="default-ul" flex>
        <li>
          DREAM creative studio, curation, and self-publishing tools
        </li>
        <li>
          Community sharing and discovery
        </li>
      </ul>
      <h5>🛠️ v2</h5>
      <ul class="default-ul" flex>
        <li>
          Text-to-novel, text-to-film, and modular narrative formats
        </li>
        <li>
          Creator IP tools and revshare
        </li>
        <li>
          Hyper-personalized stories
        </li>
        <li>
          Social pages for creators, communities, and fandoms
        </li>
      </ul>
    `,
  },
];

export default frequentlyAskedQuestions;
