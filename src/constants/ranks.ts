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

function getRankByPotentials(potentials: number): Nullable<string> {
  if (potentials < 1) return null;
  return ranks
    .filter((r) => potentials >= r.value)
    .sort((a, b) => b.value - a.value)[0].name;
}

export default getRankByPotentials;
