import { get } from 'svelte/store';

import { getCurrentUser } from './route-guard';
import {
  GetCache,
  SetCache,
  POTENTIALS_CACHE_KEY,
  POTENTIALS_CACHE_TTL,
} from '@constants/cache';
import {
  type NFT,
  nftTile,
  potentials,
  potentialsPower,
  userRank,
} from '@stores/omnihub.svelte';
import getRankByPotentials from '@constants/ranks';

const getNftNumbers = async (wallet: string) => {
  const json = await fetch(`https://api.degenerousdao.com/nft/owner/${wallet}`);
  const data = await json.json();
  const nftNumbers = data.ownedNfts?.map((nft: any) => +nft.tokenId);
  return nftNumbers;
};

const getUserNFTs = async () => {
  const user = await getCurrentUser();
  const { wallets } = user!;
  const allWallets = wallets
    ?.filter((wallet) => !wallet.faux)
    .map(({ wallet }) => wallet);

  const nftNumbers: number[] = (
    await Promise.all(allWallets!.map((wallet) => getNftNumbers(wallet)))
  )
    .filter((numbers) => numbers.length)
    .flat()
    .sort();

  return nftNumbers;
};

const getNFTs = async () => {
  let NFTs: NFT[] = [];
  let totalPower: number = 0;

  const cachedPotentials = GetCache(POTENTIALS_CACHE_KEY) as NFT[];
  if (cachedPotentials) {
    NFTs = cachedPotentials;
    cachedPotentials.map((nft) => {
      totalPower += Number(nft.level);
    });
  } else {
    const metadata: any = [];
    const nftNumbers: number[] = await getUserNFTs();

    for (let i in nftNumbers) {
      const response = await fetch(
        `https://api.degenerousdao.com/nft/data/${nftNumbers[i]}`,
      );
      metadata[i] = await response.json();
      const potential = new nftTile(metadata, Number(i));
      NFTs.push(potential);
      totalPower += Number(potential.level);
    }

    SetCache(POTENTIALS_CACHE_KEY, NFTs, POTENTIALS_CACHE_TTL);
  }

  potentials.set(NFTs);
  potentialsPower.set(totalPower);
  console.log(get(potentials));

  userRank.set(getRankByPotentials(NFTs.length));
};

export default getNFTs;
