interface Story {
  id?: number,
  title: string,
  description: string,
  storyLink: string,
  primaryThumbnail: string,
  secondaryThumbnail?: string,
  descriptionImage: string,
  genre?: string[]
}

interface Subsection {
  name: string,
  story: Story[]
}

interface Section {
  section: string
  subsection: Subsection[]
}


const stories: Section[] = [
  {
    section: 'Community Picks',
    subsection: [
      {
        name: '',
        story: [
          {
            id: 1,
            title: 'Trojan War',
            description: `
              Play as Achilles to shape the destiny of the Greeks and Trojans while fighting to claim justice for your fallen comrade Patroclus, and avenge the slight against your honor when the beautiful Helen is stolen.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'Action', 'History', 'Drama', 'War'
            ]
          },
          {
            id: 2,
            title: 'History',
            description: `
              History genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'History'
            ]
          },
          {
            id: 3,
            title: 'Action Romance',
            description: `
              Action + Romance genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'Action', 'Romance'
            ]
          },
          {
            id: 4,
            title: 'Drama Romance',
            description: `
              Drama + Romance genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'Drama', 'Romance'
            ]
          },
          {
            id: 5,
            title: 'Thriller',
            description: `
              Thriller genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'Thriller'
            ]
          },
          {
            id: 6,
            title: 'History Sport',
            description: `
              History + Sport genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'History', 'Sport'
            ]
          },
          {
            id: 7,
            title: 'Action Biopic Crime',
            description: `
              Action + Biopic + Crime genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'Action', 'Biopic', 'Crime'
            ]
          },
          {
            id: 8,
            title: 'War Psychological Fantasy Horror',
            description: `
              War + Psychological + Fantasy + Horror genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'War', 'Psychological', 'Fantasy', 'Horror'
            ]
          },
          {
            id: 9,
            title: 'Comedy Horror Thriller',
            description: `
              Comedy + Horror genre
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/CommunityPicks/TrojanWar.avif',
            descriptionImage: '/descriptionPicture/CommunityPicks/TrojanWar.avif',
            genre: [
              'Comedy', 'Horror', 'Thriller'
            ]
          },
        ]
      }
    ]
  },
  {
    section: 'The Dischordian Saga',
    subsection: [
      {
        name: 'FALL OF REALITY (prequel)',
        story: [
          {
            title: 'Escape',
            description: `
              Play as a prisoner going through experiments in a guarded prison and try to escape the planet by defeating or fleeing from The Warden.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Escape1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Escape2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Escape.avif'
          },
          {
            title: 'Arena',
            description: `
              Try to escape the prison planet by winning in a series of challenges which may include the gladiator's arena filled with powerful creatures.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Arena1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Arena2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Arena.avif'
          },
          {
            title: 'Inception Ark',
            description: `
              Having escaped from the Prison Planet in a spaceship known as an Inception Ark, a galactic adventure of exploration awaits.  Play as the captain of a spaceship seeking a new  home, allied against the AI overlords, and ways to defeat the Architect.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/InceptionArk1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/InceptionArk2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/InceptionArk.avif'
          }
        ]
      },
      {
        name: 'CLASSES',
        story: [
          {
            title: 'Assassin',
            description: `
              Play as Agent Zero, a highly trained assassin working for the forces of humanity, on a mission to infiltrate a base and assassinate an AI target vital to the war effort.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Assassin1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Assassin2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Assassin.avif'
          },
          {
            title: 'Soldier',
            description: `
              Play add the Iron Lion - the greatest general humanity has ever known.  Control armies, make tactical decisions, and lead the fight for humanity’s freedom.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Soldier1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Soldier2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Soldier.avif'
          },
          {
            title: 'Spy',
            description: `
              Play as a double agent known as Eyes of the Watcher, choose between the Insurgency and the Architect's Watcher, and steal highly classified information from the other side.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Spy1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Spy2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Spy.avif'
          },
          {
            title: 'Engineer',
            description: `
              Play as the Engineer, on a mission to fix the universe with inventive solutions, as you are visiting planets in danger from a variety of apocalyptic threats.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Engineer1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Engineer2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Engineer.avif'
          },
          {
            title: 'Oracle',
            description: `
              Play as the Oracle, on a mission to spread the seeds of rebellion against the machine overlords and convince the people of a new world to join the Resistance.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Oracle1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Oracle2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Oracle.avif'
          },
          {
            title: 'Ne-Yon',
            description: `
              Be a part of the rise of the Ne-Yons, a mysterious race of intergalactic demi-gods, and play a key part in the war between the Architect and humanity by deciding your allies, enemies, and using your higher powers.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/NeYon1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/NeYon2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/NeYon.avif'
          }
        ]
      },
      {
        name: 'DISCHORDIAN SAGA',
        story: [
          {
            title: 'The Terminus Swarm',
            description: `
              Play as a Potential, an engineered being stranded on a rogue biomass planet teeming with fungal forests and corrosive spores. Armed with biomechanical weapons, you must survive relentless waves of the Terminus Swarm, grotesque insectoid monsters, until you inevitably succumb to the planet's horrors—will you face your demise bravely or fall unexpectedly?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/TheTerminusSwarm1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/TheTerminusSwarm2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/TheTerminusSwarm.avif'
          },
          {
            title: 'Awaken the Clone',
            description: `
              Play as a mind-controlled clone, awakened with a xenomorph helmet and a slave collar, tasked by the malevolent AI Archon known as the Collector to conquer the verdant planet of Thaloria. Navigate through fierce battles against the resolute Thalorian defenders, led by the Hierophant and the ethereal Oracle, while wrestling with the possibility of rebellion or redemption—will you remain a pawn or break free from the Collector's grasp?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/AwakenTheClone1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/AwakenTheClone2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/AwakenTheClone.avif'
          },
          {
            title: 'The Host',
            description: `
              Play as the Host, a Potential transformed into a living extension of the Thought Virus, as you navigate through the multiverse to spread the infection. Journeying through various worlds—science fiction, fantasy, western, or surrealistic—you must confront heroes, armies, scientists, magicians, and politicians, balancing your dark mission against the slim chance of rebellion and redemption amidst a backdrop of horror and suspense—will you spread the Thought Virus or find a way to free your mind?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/TheHost1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/TheHost2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/TheHost.avif'
          }
        ]
      },
      {
        name: 'VISIONS',
        story: [
          {
            title: 'Ayylmao',
            description: `
              Play as a grey alien, part of the Ayylmao species, working as an entry-level assistant for the secretive Illuminayyti cabal that controls human history. Given a chance to prove yourself, you must complete missions like replacing a celebrity, hypnotizing teens through YouTube, or building a time machine to trick ancient Egyptians, all while facing human scientists, Truther media, the US Military, and rival Anunnaki aliens—will you succeed and earn your promotion or succumb to the challenges and fail your mission?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/Ayylmao1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/Ayylmao2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/Ayylmao.avif'
          },
          {
            title: 'The Mascoteers',
            description: `
              Play as the Student, a brilliant middle school newcomer in the town of Celebration, invited to join the exclusive afterschool club, the Mascoteers. To prove your worth and become the ninth member, you must complete a mission such as solving a school mystery, helping save an AI child from bullies, or building a time machine, all while facing challenges like authoritarian teachers, ghosts, and a rival adventure group—will you impress the Mascoteers and join their ranks, or fail and face the consequences?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/TheMascoteers1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/TheMascoteers2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/TheMascoteers.avif'
          },
          {
            title: 'The Detective',
            description: `
              Play as a renowned detective navigating the neon-lit corridors of a towering cityscape, where your mission is to unravel the darkest mysteries threatening the AI Empire's fragile balance of order. Armed with your wits and high-tech gadgets, you must confront serial killers, mobsters, corrupt corporations, and the elusive assassin Agent Zero, in a solitary quest for truth and justice—will you prevail or succumb to the dangers lurking in the cybernetic metropolis?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/TheDetective1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/TheDetective2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/TheDetective.avif'
          },
          {
            title: 'Halloween: The Collector',
            description: `
              Play as one of the last human survivors on a zombie-ravaged planet, hunted relentlessly by a nearly indestructible AI Overlord known as the Collector, who seeks to harvest your DNA. Navigate through hordes of zombies, doomsday cultists, serial killers, cannibals, and psychopaths in your desperate quest to find the hidden Sanctuary - will you survive?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/HalloweenTheCollector1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/HalloweenTheCollector2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/HalloweenTheCollector.avif'
          },
          {
            title: 'North Pole Inc.',
            description: `
              Play as a dream engineer from the Planet Christmas, working in the Dreams and Myths division of North Pole Incorporated to spread the concept of Christmas holidays across the universe. Tasked with rescuing Christmas icons like Santa Claus or Rudolph from the evil AI robot, the Collector, you must navigate challenges including AI empire agents, killer clowns from South Pole Inc., robot soldiers, and a sabotaging coworker, Darren—will you save Christmas and earn a promotion, or fall victim to the obstacles and fail your mission?
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/DischordianSaga/NorthPoleInc1.avif',
            secondaryThumbnail: '/titlePicture/DischordianSaga/NorthPoleInc2.avif',
            descriptionImage: '/descriptionPicture/DischordianSaga/NorthPoleInc.avif'
          }
        ]
      }
    ]
  },
  {
    section: 'Collabs',
    subsection: [
      {
        name: '',
        story: [
          {
            title: 'GLMR Apes',
            description: `
              Play as a hyper-intelligent Ape that's been captured by an AI Archon known as The Collector, and try to escape the Dark Zoo, surrounded by the Jailer, and other animals, threats, and allies.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/Collabs/GLMRApes1.avif',
            descriptionImage: '/descriptionPicture/Collabs/GLMRApes.avif'
          },
          {
            title: 'Lazy Lions',
            description: `
              In the heart of the vast azure ocean lies the Enchanted Private Island, a hidden paradise ruled by the majestic Lazy Lions, who possess wisdom and regal grace. This utopia, with its lush landscapes and ancient secrets, faces a dire threat from Glitch, a former lion of the pride who seeks to conquer the island. As Glitch gathers his ruthless generals, the peaceful Lazy Lions must defend their home, not with violence, but by uncovering the island's forgotten mysteries. Embarking on a journey of bravery and discovery, they strive to protect the island's soul and preserve the harmony that defines their enchanted sanctuary.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/Collabs/LazyLions1.avif',
            descriptionImage: '/descriptionPicture/Collabs/LazyLions.avif'
          },
          {
            title: 'Tempest: The era of an Empire',
            description: `
              During the era of the Empire in 3067 AD, in a distant galaxy on the harsh desert planet of Zarathar, an exiled former Space Fleet Admiral, a brilliant scientist, and the rightful heir of Milanos, along with her daughter, must join forces with a rebellious prince to navigate deadly political intrigue and uncover ancient secrets to liberate their desolate planet.
              When a cosmic storm crash-lands a spaceship carrying their enemies, they embark on a mission to defeat the evil Empire, sparking an epic battle for redemption and freedom, to restore peace to the Galactic Empire.
            `,
            storyLink: '',
            primaryThumbnail: '/titlePicture/Collabs/Tempest1.avif',
            descriptionImage: '/descriptionPicture/Collabs/Tempest.avif'
          }
        ]
      }
    ]
  }
]


export default stories;


// Copyright DeGenerous
// Society - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential