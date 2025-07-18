import { get } from 'svelte/store';

import { getCurrentUser } from './route-guard';
import {
  GetCache,
  SetCache,
  POTENTIALS_KEY,
  TTL_SHORT,
} from '@constants/cache';
import {
  type NFT,
  nftTile,
  potentials,
  potentialsPower,
  userRank,
} from '@stores/omnihub.svelte';
import getRankByPotentials from '@constants/ranks';

const getNftNumbers = async (wallet: string): Promise<number[]> => {
  const json = await fetch(`https://api.degenerousdao.com/nft/owner/${wallet}`);
  const data = await json.json();
  const nftNumbers = data.ownedNfts?.map((nft: any) => +nft.tokenId);
  return nftNumbers;
};

const getUserNFTs = async (): Promise<number[]> => {
  const user = await getCurrentUser();
  const { wallets } = user!;
  const allWallets = wallets
    ?.filter((wallet) => !wallet.faux)
    .map(({ wallet }) => wallet);

  // Prevent further steps if there is no NFTs
  if (!allWallets?.length) return [];

  const nftNumbers: number[] = (
    await Promise.all(allWallets!.map((wallet) => getNftNumbers(wallet)))
  )
    .filter((numbers) => numbers.length)
    .flat();

  return nftNumbers;
};

// Returns TRUE if there is any NFTs detected, - FALSE otherwise
const getNFTs = async (): Promise<boolean> => {
  let NFTs: NFT[] = [];
  let totalPower: number = 0;

  const cachedPotentials = GetCache<NFT[]>(POTENTIALS_KEY);
  if (cachedPotentials) {
    NFTs = cachedPotentials;
    cachedPotentials.map((nft) => {
      totalPower += Number(nft.level);
    });
  } else {
    const metadata: any = [];
    const nftNumbers: number[] = await getUserNFTs();

    // Prevent further steps if there is no NFTs
    if (!nftNumbers.length) return false;

    for (let i = 0; i < nftNumbers.length; i++) {
      const response = await fetch(
        `https://api.degenerousdao.com/nft/data/${nftNumbers[i]}`,
      );
      metadata[i] = await response.json();
      const potential = new nftTile(metadata, i);
      NFTs.push(potential);
      totalPower += Number(potential.level);
    }

    SetCache(POTENTIALS_KEY, NFTs, TTL_SHORT);
  }

  if (NFTs.length) {
    potentials.set(NFTs);
    potentialsPower.set(totalPower);
    userRank.set(getRankByPotentials(NFTs.length));

    // console.log(get(potentials));
    return true;
  }

  return false;
};

export default getNFTs;
