// Collection thats provided by default
export const POTENTIALS_COLLECTION_ID = '00000000-0000-0000-0000-000000000001';

// Ranks for Potentials holders
export const ranks: Attribute[] = [
  { name: 'Supreme Multiverse Emperor', value: 25 },
  { name: 'Intergalactic Commander', value: 20 },
  { name: 'Stellar Sergeant', value: 15 },
  { name: 'Starship Captain', value: 10 },
  { name: 'Deep Space Major', value: 8 },
  { name: 'Celestial Colonel', value: 5 },
  { name: 'Astro Lieutenant', value: 4 },
  { name: 'Galactic Surveyor', value: 3 },
  { name: 'Astral Adventurer', value: 2 },
  { name: 'Cosmic Pioneer', value: 1 },
];

// pick the highest rank whose threshold is satisfied by the supplied potential count
export function getRankByPotentials(potentials: number): Nullable<string> {
  if (potentials < 1) return null;
  return ranks
    .filter((r) => potentials >= r.value)
    .sort((a, b) => b.value - a.value)[0].name;
}

// Base attribute seeds used for Potentials
export const attributes: Attribute[] = [
  {
    name: 'attack',
    value: 1,
  },
  {
    name: 'defense',
    value: 1,
  },
  {
    name: 'intellect',
    value: 1,
  },
  {
    name: 'will',
    value: 1,
  },
  {
    name: 'stealth',
    value: 1,
  },
  {
    name: 'research',
    value: 1,
  },
  {
    name: 'connection',
    value: 1,
  },
];
