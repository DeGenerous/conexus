import { NAV_ROUTES } from './routes';

const blogPages: BlogPage[] = [
  {
    url: 'choose-your-own-adventure-tools',
    title:
      'Top Choose-Your-Own-Adventure Tools to Bring Your Story to Life (2025)',
    description:
      'Looking for the best choose-your-own-adventure tools to build interactive stories in 2025? Explore free and advanced platforms for creating branching narratives, visual novels, and story games — with and without code.',
  },
  {
    url: 'play-story-games-online',
    title:
      'Play Story Games Online: The Best Ways to Experience Interactive Narratives in 2025',
    description:
      'Looking for the best places to play story games online? Explore interactive fiction, choice-based adventures, and AI-powered story platforms you can try instantly in 2025.',
  },
  {
    url: 'create-interactive-fiction',
    title:
      'Create Interactive Fiction: Tools and Tips for Storytellers in 2025',
    description:
      'Want to create interactive fiction? Discover the best tools, platforms, and techniques to start building branching narratives and story games online in 2025 — no coding required.',
  },
  {
    url: 'best-visual-novels',
    title: 'Best Visual Novels to Play in 2025',
    description:
      'Looking for the best visual novels to play in 2025? Explore immersive, choice-driven stories across romance, mystery, fantasy, and more — available online and on all platforms.',
  },
  {
    url: 'ai-stories',
    title: 'Best Platforms to Explore AI Stories in 2025',
    description:
      'Curious about AI-generated stories? Discover the best platforms for reading, playing, or creating AI-powered narratives in 2025 — from interactive adventures to personalized fiction.',
  },
];

export const topTools: BlogPageCard[] = [
  {
    name: 'Twine',
    bestFor: 'Beginners and writers',
    platform: 'Web',
    pricing: 'Free and open-source',
    description:
      'Twine is a beloved classic in the interactive fiction community. It uses a simple visual interface and link-based scripting that allows you to connect passages like web pages. While it’s beginner-friendly, it also supports advanced logic for more dynamic narratives using variables and JavaScript.',
    url: 'https://twinery.org',
  },
  {
    name: 'Ink by Inkle',
    bestFor: 'Writers who like code-lite scripting',
    platform: 'Desktop, Unity',
    pricing: 'Free',
    description:
      'Ink is a scripting language designed for writing interactive dialogue and story logic, used in titles like 80 Days and Heaven’s Vault. It’s great for developers and writers who want more control over narrative structure while keeping syntax clean and readable.',
    url: 'https://www.inklestudios.com/ink',
  },
  {
    name: 'RenPy',
    bestFor: 'Visual novel developers',
    platform: 'Desktop',
    pricing: 'Free and open-source',
    description:
      'RenPy is a visual novel engine that combines Python scripting with easy asset management for text, characters, backgrounds, and animations. It’s ideal for visual storytelling with branching dialogue paths and multimedia elements, though it requires more setup and scripting knowledge.',
    url: 'https://www.renpy.org/',
  },
  {
    name: 'CoNexus',
    bestFor: 'Creating and playing interactive story games online',
    platform: 'Web, optionally downloadable (PWA)',
    pricing: 'Free',
    description:
      'CoNexus is a web-based platform that blends choose-your-own-adventure storytelling with AI-generated content, visuals, and voice narration. It allows creators to design branching stories without code, and lets users customize tone, pacing, language, and visual style. Unlike traditional tools, CoNexus stories are replayable and reactive, with each choice reshaping the outcome. CoNexus can also be installed as a progressive web app (PWA), giving users the option to download it like a native app. It’s designed for both casual storytellers and creators building immersive, modular story worlds.',
    url: NAV_ROUTES.CONEXUS,
  },
  {
    name: 'StoryLoom',
    bestFor: 'Mobile-first creators',
    platform: 'Web',
    pricing: 'Free with paid features',
    description:
      "StoryLoom is a sleek, no-code platform that lets users publish short branching stories with simple formatting, character art, and visual backgrounds. It's user-friendly and great for creators looking to publish episodic story content quickly.",
    url: 'https://www.storyloom.com',
  },
  {
    name: 'ChoiceScript',
    bestFor: 'Writers comfortable with scripting',
    platform: 'Desktop',
    pricing: 'Free and open-source',
    description:
      'Developed by Choice of Games, ChoiceScript lets you create text-based games with stats and conditional logic. It’s powerful for traditional interactive fiction creators who want full control over player variables and outcomes.',
    url: 'https://www.choiceofgames.com/make-your-own-games/choicescript-intro/',
  },
];

export const onlineGames: BlogPageCard[] = [
  {
    name: 'CoNexus',
    bestFor: 'Interactive, AI-powered story games with infinite replayability',
    platform: 'Web, optionally downloadable (PWA)',
    pricing: 'Free',
    description:
      'CoNexus is a next-generation platform for interactive storytelling. It offers a library of story games across genres like fantasy, dystopia, romance, sci-fi, and more — all designed to adapt in real time based on your decisions. Each choice you make leads to different outcomes, with no two playthroughs ever the same. CoNexus stories are enhanced by visuals, narration, and music, and the platform allows for full customization of tone, pacing, and language. New stories are added regularly, and players can even become creators using the built-in no-code tools.',
    url: NAV_ROUTES.CONEXUS,
  },
  {
    name: 'Choice of Games',
    bestFor: 'Text-based branching narratives',
    platform: 'Web, iOS, Android',
    pricing: 'Free and paid titles',
    description:
      'Choice of Games offers a wide range of interactive novels where your decisions affect the outcome. These games are entirely text-based and cover genres from superhero epics to political intrigue. The stories feature character stats and branching paths that give every choice weight and consequence.',
    url: 'https://www.choiceofgames.com',
  },
  {
    name: 'Episode',
    bestFor: 'Casual mobile storytelling with visuals',
    platform: 'iOS, Android',
    pricing: 'Free with in-app purchases',
    description:
      'Episode is a popular storytelling platform with a visual, mobile-first design. Users play through romantic dramas, thrillers, and high-school stories, often with animated characters and dialogue. The app also allows players to create their own stories using a simplified scripting language.',
    url: 'https://www.episodeinteractive.com',
  },
  {
    name: 'StoryLoom',
    bestFor: 'Short, visual, choice-based stories',
    platform: 'Web',
    pricing: 'Free with paid features',
    description:
      "StoryLoom offers short story games that you can play quickly in your browser. Designed for mobile and web users, it features branching narratives with visual elements and character portraits. It's ideal for users looking for bite-sized storytelling sessions.",
    url: 'https://www.storyloom.com',
  },
  {
    name: 'Reigns',
    bestFor: 'Minimalist choice-driven gameplay',
    platform: 'Web, Steam, iOS, Android',
    pricing: 'Paid',
    description:
      'Reigns is a card-based story game where you rule a kingdom and make binary choices that impact politics, religion, economy, and military. While more game-like than some platforms, its branching narrative structure makes it an engaging option for fans of interactive storytelling.',
    url: 'https://www.devolverdigital.com/games/view/reigns',
  },
];

export const interactiveFiction: BlogPageCard[] = [
  {
    name: 'CoNexus',
    bestFor: 'Creating dynamic, AI-enhanced interactive stories with no code',
    platform: 'Web, optionally downloadable (PWA)',
    pricing: 'Free',
    description:
      'CoNexus is a platform designed for creating and playing branching story games with high customizability and instant publishing. It supports visual, audio, and narrative customization — allowing creators to build deeply immersive stories that adapt to player decisions. You can control story pacing, tone, language, and even visual style, all without technical barriers. CoNexus also enables story remixing and collaborative worldbuilding, making it ideal for both solo creators and communities.',
    url: NAV_ROUTES.CONEXUS,
  },
  {
    name: 'Twine',
    bestFor: 'Beginners looking for a simple, visual structure',
    platform: 'Web',
    pricing: 'Free',
    description:
      'Twine uses a drag-and-drop interface to let you create stories with connected passages and branching options. It’s ideal for writers who want to focus on narrative without worrying about code, while still allowing advanced users to implement logic and variables.',
    url: 'https://twinery.org',
  },
  {
    name: 'Ink by Inkle',
    bestFor: 'Writers comfortable with light scripting',
    platform: 'Desktop, Unity',
    pricing: 'Free',
    description:
      'Ink is a narrative scripting language built by game developers. It’s great for branching dialogue, character interaction, and stat-based narrative logic. If you enjoy writing in plain text with minimal formatting but want structured depth, Ink is a solid choice.',
    url: 'https://www.inklestudios.com/ink',
  },
  {
    name: 'StoryLoom',
    bestFor: 'Fast, visual-first interactive fiction',
    platform: 'Web',
    pricing: 'Free with paid features',
    description:
      'StoryLoom lets creators build short branching stories with a clean, accessible interface. You can add character images, backgrounds, and choice points in minutes, making it a good entry point for mobile-friendly publishing.',
    url: 'https://www.storyloom.com',
  },
];

export const visualNovels: BlogPageCard[] = [
  {
    name: 'CoNexus',
    bestFor:
      'Browser-based visual novels with dynamic branching and personalization',
    platform: 'Web, optionally downloadable (PWA)',
    pricing: 'Free',
    description:
      "While not a traditional visual novel platform, CoNexus lets users experience interactive stories that feel like visual novels — complete with branching narratives, customizable visuals, AI narration, and music. Each story adapts in real time to the player's decisions, offering endless replayability and dynamic presentation. With stories across fantasy, romance, sci-fi, and more, CoNexus is ideal for players who want modern, evolving narratives without downloading anything. It also includes creation tools for building your own visual novel-style story directly in the browser.",
    url: NAV_ROUTES.CONEXUS,
  },
  {
    name: 'Doki Doki Literature Club Plus',
    bestFor: 'Meta horror disguised as a dating sim',
    platform: 'PC, Switch, PlayStation, Xbox',
    pricing: 'Paid',
    description:
      'Doki Doki Literature Club Plus starts as a cheerful school romance story but quickly evolves into a psychological horror experience. Its blend of character-driven storytelling, genre subversion, and fourth-wall-breaking moments has made it one of the most talked-about visual novels in recent years.',
    url: 'https://ddlc.plus',
  },
  {
    name: 'The House in Fata Morgana',
    bestFor: 'Gothic storytelling and emotional depth',
    platform: 'PC, Switch, PS Vita',
    pricing: 'Paid',
    description:
      'This critically acclaimed visual novel weaves an atmospheric tale of tragedy, time, and redemption. With a haunting soundtrack and beautifully detailed art, it delivers a layered, multi-century narrative that’s as emotionally gripping as it is mysterious.',
    url: 'https://store.steampowered.com/app/303310/The_House_in_Fata_Morgana/',
  },
  {
    name: 'Steins;Gate',
    bestFor: 'Time-travel lovers and sci-fi fans',
    platform: 'PC, PlayStation, Switch',
    pricing: 'Paid',
    description:
      'Steins;Gate is a genre-defining visual novel that combines real science with fictional time travel mechanics. With a cast of memorable characters and a plot that twists across multiple timelines, it’s a must-play for sci-fi enthusiasts.',
    url: 'https://www.spike-chunsoft.com/steinsgate/',
  },
  {
    name: '80 Days',
    bestFor: 'Travel-based, literary adventure',
    platform: 'PC, mobile, Switch',
    pricing: 'Paid',
    description:
      'Inspired by the classic Jules Verne novel, 80 Days reimagines the global journey with steampunk aesthetics, branching choices, and replayable routes. It’s text-heavy but beautifully illustrated, offering a mix of narrative depth and player freedom.',
    url: 'https://store.steampowered.com/app/381780/80_Days/',
  },
  {
    name: 'Visual Novel Reader (VNDS)',
    bestFor: 'Playing classic fan-translated VNs',
    platform: 'Android',
    pricing: 'Free',
    description:
      "VNDS is an open-source visual novel engine that allows users to play translated Japanese visual novels from older systems. While not polished like modern commercial platforms, it's a great option for retro and niche enthusiasts.",
    url: 'https://github.com/joel16/VNDS-Interpreter',
  },
];

export const aiStories: BlogPageCard[] = [
  {
    name: 'CoNexus',
    bestFor:
      'Structured, replayable AI story games with visual, narrative, and social depth',
    platform: 'Web, optionally downloadable (PWA)',
    pricing: 'Free',
    description:
      'CoNexus is one of the only platforms offering fully structured, interactive AI stories that react to your choices and evolve over time. Rather than a static AI output, each story on CoNexus plays like a dynamic experience — complete with branching logic, visuals, music, narration, and full customization of pacing, tone, and language. Stories can be played, remixed, or created from scratch without any coding, and the platform supports genres ranging from high fantasy to psychological thriller. With social features, community remixing, and support for text-to-novel and text-to-film on the horizon, CoNexus is setting the standard for what AI storytelling can be.',
    url: NAV_ROUTES.CONEXUS,
  },
  {
    name: 'Sudowrite',
    bestFor: 'Writers using AI to assist with traditional fiction',
    platform: 'Web',
    pricing: 'Paid',
    description:
      'Sudowrite is popular among authors looking to expand on their own work. It provides tools for idea generation, character development, and scene expansion. While it’s useful for drafting and brainstorming, it isn’t built to deliver structured interactivity or user-driven narratives. The storytelling stays linear, and the AI functions mostly as a writing assistant.',
    url: 'https://www.sudowrite.com',
  },
  {
    name: 'NovelAI',
    bestFor: 'AI-driven solo writing and anime-style art',
    platform: 'Web',
    pricing: 'Paid with free trial',
    description:
      'NovelAI allows users to generate fiction within their own world settings. It features customizable lore and image generation, though the stories tend to lack consistent structure or long-term coherence. It’s more of a sandbox for individual exploration than a tool for building robust or replayable experiences.',
    url: 'https://novelai.net',
  },
  {
    name: 'ChatGPT',
    bestFor: 'Conversational storytelling and idea prototyping',
    platform: 'Web, mobile',
    pricing: 'Free and paid plans',
    description:
      'ChatGPT can be adapted for story creation through prompts, worldbuilding, or character dialogue. However, it lacks memory and narrative structure in longer outputs, making it more suitable for quick idea generation or roleplaying than for building consistent, shareable stories with replay value.',
    url: 'https://chat.openai.com',
  },
  {
    name: 'AI Dungeon',
    bestFor: 'Open-ended text adventures with minimal constraints',
    platform: 'Web, mobile',
    pricing: 'Free with premium features',
    description:
      'AI Dungeon delivers spontaneous, often chaotic storytelling in a choose-your-own-adventure style. It offers flexibility and fun, but coherence and replayability are limited. Without narrative structure or tools for refinement, stories can quickly become disjointed or repetitive.',
    url: 'https://play.aidungeon.io',
  },
];

export default blogPages;
