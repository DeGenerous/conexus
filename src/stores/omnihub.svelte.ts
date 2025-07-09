import { writable } from 'svelte/store';

export class nftTile {
  id: number;
  name: string;
  image: string;
  level: string;
  attributes: Object[];
  constructor(data: any, i: number) {
    this.id = i;
    this.name = data[i].name;
    this.image = data[i].image;
    this.level = data[i].attributes[2].value;
    this.attributes = data[i].attributes;
  }
}

export interface NFT extends nftTile {}

export const potentials = writable<Array<NFT>>([]);
export const potentialsPower = writable<number>(0);
export const userRank = writable<Nullable<string>>(null);

export const selectedPotential = writable<Nullable<NFT>>(null);

export const episodes = writable<StoryNode[][]>([]);
export const loadingStatus = writable<Nullable<string>>(null);
