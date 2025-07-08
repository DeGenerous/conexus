export const ranks = [
  { rank: 'Supreme Multiverse Emperor', value: 25 },
  { rank: 'Intergalactic Commander', value: 20 },
  { rank: 'Stellar Sergeant', value: 15 },
  { rank: 'Starship Captain', value: 10 },
  { rank: 'Deep Space Major', value: 8 },
  { rank: 'Celestial Colonel', value: 5 },
  { rank: 'Astro Lieutenant', value: 4 },
  { rank: 'Galactic Surveyor', value: 3 },
  { rank: 'Astral Adventurer', value: 2 },
  { rank: 'Cosmic Pioneer', value: 1 },
];

function getRankByPotentials(potentials: number): Nullable<string> {
  if (potentials < 1) return null;
  return ranks
    .filter((r) => potentials >= r.value)
    .sort((a, b) => b.value - a.value)[0].rank;
}

export default getRankByPotentials;
