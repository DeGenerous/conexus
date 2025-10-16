import contract from '@lib/contract';
import {
  GetCache,
  SetCache,
  SELECTED_POTENTIAL_KEY,
  DS_VOTING_HISTORY_KEY,
} from '@constants/cache';
import {
  type NFT,
  episodes,
  totalEpisodes,
  loadingStatus,
} from '@stores/omnihub.svelte';

// Pull both v1/v2 saga episodes from chain, enrich with vote info, and cache them in the Omnihub stores
const fetchEpisodes = async (nftNumber: number): Promise<StoryNode[][]> => {
  loadingStatus.set('Loading Season 1 Episode 1...');
  episodes.set([]);

  // Season 1 episodes (legacy contract)
  const s1Nodes: StoryNode[] = [];
  const s1Count = await (await contract('v1')).getStoryNodesCount();
  for (let i = 0; i < s1Count; i++) {
    loadingStatus.set(`Loading Season 1 Episode ${i + 1}...`);
    // console.log('Fetching Episode ' + (i + 1).toString());
    let ipfs_uri = await (await contract('v1')).storyNodeMetadata(i);
    if (ipfs_uri === 'ipfs://QmYutAynNJwoE88LxthGdA2iH8n2CGJygz8ZkoA1WACsNg') {
      ipfs_uri = 'ipfs://QmP2c7vULMkbaChCkUiQ6PDsHLBt3WcSEYax4SSvugbZb1';
    }
    const slicedURI = ipfs_uri.match('ipfs://') ? ipfs_uri.slice(7) : ipfs_uri;
    try {
      // console.log('ipfs URI: https://gateway.pinata.cloud/ipfs/' + slicedURI);
      const json = await fetch(
        `https://gateway.pinata.cloud/ipfs/${slicedURI}`,
      );
      s1Nodes.push(await json.json());
    } catch (error) {
      console.error(error);
      // console.log('ipfs URI: https://ipfs.io/ipfs/' + slicedURI);
      const json = await fetch(`https://ipfs.io/ipfs/${slicedURI}`);
      s1Nodes.push(await json.json());
    }
    const { endTimestamp } = await (await contract('v1')).storyNodes(i);
    s1Nodes[s1Nodes.length - 1].endTimestamp = Number(endTimestamp);
    s1Nodes[s1Nodes.length - 1].ended =
      Number(endTimestamp) * 1000 < new Date().getTime();
    s1Nodes[s1Nodes.length - 1].title = s1Nodes[s1Nodes.length - 1].title
      ?.replace('The Dischordian Saga: ', '')
      .split(' - Episode ')[0];
    s1Nodes[s1Nodes.length - 1].votes_options.map((opt: { option: string }) => {
      if (opt.option[2] == ' ') opt.option = opt.option.slice(2);
    });
    s1Nodes[s1Nodes.length - 1].season = 1;
    s1Nodes[s1Nodes.length - 1].episode = s1Nodes.length;
    const vote = await getVote(1, s1Nodes.length - 1, nftNumber);
    if (vote > 0) s1Nodes[s1Nodes.length - 1].vote = vote;
  }

  // Season 2 episodes (current contract)
  const s2Nodes: StoryNode[] = [];
  const s2Count = await (await contract()).getStoryNodesCount();
  for (let i = 0; i < s2Count; i++) {
    loadingStatus.set(`Loading Season 2 Episode ${i + 1}...`);
    // console.log('Fetching Episode ' + (i + 1).toString());
    let ipfs_uri = await (await contract()).storyNodeMetadata(i);
    const slicedURI = ipfs_uri.match('ipfs://') ? ipfs_uri.slice(7) : ipfs_uri;
    try {
      // console.log('ipfs URI: https://gateway.pinata.cloud/ipfs/' + slicedURI);
      const json = await fetch(
        `https://gateway.pinata.cloud/ipfs/${slicedURI}`,
      );
      s2Nodes.push(await json.json());
    } catch (error) {
      console.error(error);
      // console.log('ipfs URI: https://ipfs.io/ipfs/' + slicedURI);
      const json = await fetch(`https://ipfs.io/ipfs/${slicedURI}`);
      s2Nodes.push(await json.json());
    }
    const { endTimestamp } = await (await contract()).storyNodes(i);
    s2Nodes[s2Nodes.length - 1].endTimestamp = Number(endTimestamp);
    s2Nodes[s2Nodes.length - 1].ended =
      Number(endTimestamp) * 1000 < new Date().getTime();
    s2Nodes[s2Nodes.length - 1].votes_options.map((opt: { option: string }) => {
      if (opt.option[2] == ' ') opt.option = opt.option.slice(2);
    });
    s2Nodes[s2Nodes.length - 1].episode = s2Nodes.length;
    const vote = await getVote(2, s2Nodes.length - 1, nftNumber);
    if (vote > 0) s2Nodes[s2Nodes.length - 1].vote = vote;
  }

  const nodes: StoryNode[][] = [s1Nodes, s2Nodes];
  totalEpisodes.set(s1Count + s2Count);
  return nodes;
};

const getVote = async (
  season: number = 1,
  episode: number = 1,
  nft: number,
) => {
  const contractVersion = season === 1 ? 'v1' : 'v2';
  const vote = await (
    await contract(contractVersion)
  ).getVoteOptionId(episode, nft);
  return Number(vote);
};

export const getVotingHistory = async () => {
  const cachedVotes = GetCache<StoryNode[][]>(
    DS_VOTING_HISTORY_KEY(
      String(GetCache<NFT>(SELECTED_POTENTIAL_KEY)?.token_id),
    ),
  );
  if (cachedVotes) {
    episodes.set(cachedVotes);
    totalEpisodes.set(30);
    return;
  }

  try {
    const cachedPotential = GetCache<NFT>(SELECTED_POTENTIAL_KEY);
    let nftNumber: number = Number(cachedPotential?.token_id);
    await fetchEpisodes(nftNumber)
      .then((votes) =>
        votes.map((season) => season.filter((episode) => episode.vote)),
      )
      .then((filteredVotes) => {
        // Assign global memory index
        const flatEpisodes = filteredVotes.flat();
        flatEpisodes.map((episode, index) => {
          episode.memory = index + 1;
        });

        // Re-group episodes back into the same season structure
        let offset = 0;
        const memories = filteredVotes.map((season) => {
          const updatedSeason = season.map(() => flatEpisodes[offset++]);
          return updatedSeason;
        });

        // console.log(memories);
        episodes.set(memories);
        SetCache(
          DS_VOTING_HISTORY_KEY(String(nftNumber)),
          memories,
          1000 * 60 * 60 * 24 * 30, // 30 days
        );
      });
    loadingStatus.set(null);
  } catch (error) {
    loadingStatus.set('Failed to check voting history, please try again...');
    throw new Error('Failed to fetch votes');
  }
};
