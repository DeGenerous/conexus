import { get } from 'svelte/store';

import { getCurrentUser } from './route-guard';
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
  const nftNumbers: number[] = await getUserNFTs();

  const metadata: any = [];
  let NFTs: NFT[] = [];
  let totalPower: number = 0;
  for (let i in nftNumbers) {
    const response = await fetch(
      `https://api.degenerousdao.com/nft/data/${nftNumbers[i]}`,
    );
    metadata[i] = await response.json();
    const potential = new nftTile(metadata, Number(i));
    NFTs.push(potential);
    totalPower += Number(potential.level);
  }
  potentials.set(NFTs);
  potentialsPower.set(totalPower);
  console.log(get(potentials));

  userRank.set(getRankByPotentials(NFTs.length));
};

export default getNFTs;
