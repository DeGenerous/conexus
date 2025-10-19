import { ethers, JsonRpcProvider } from 'ethers';

const v1 = '0x1E2f59De3C0D51b596e0E9c80FEAa35A2cFBEe50';
const v2 = '0x8dC749360eA4f408C438C4FC7A272EE1f1250A89';

let CONTRACT_ADDRESS: string = v1;

const abi_v1 = [
  'function batchVote(uint256 storyNodeId, uint256[] memory tokenIds, uint8[] memory optionIds) external',
  'function getStoryNodesCount() external view returns (uint96)',
  'function getVoteOptionId(uint256 storyNodeId, uint256 tokenId) external view returns (uint8)',
  'function singleVote(uint256 storyNodeId, uint256 tokenId, uint8 optionId) external',
  'function storyNodes(uint256) external view returns (uint128 endTimestamp, uint128 optionCount)',
  'function storyNodeMetadata(uint256) external view returns (string memory)',
];

const abi_v2 = [
  'function batchVote(uint256 storyNodeId, uint256[] memory tokenIds, uint8[] memory optionIds) external',
  'function createStoryNode(uint8 optionCount, uint8[] memory optionRestrictions, string memory metadata) external returns (uint256)',
  'function getStoryNodesCount() external view returns (uint256)',
  'function getVoteOptionId(uint256 storyNodeId, uint256 tokenId) external view returns (uint8)',
  'function initialize(address initialOwner) external',
  'function i_potentials() external view returns (address)',
  'function owner() external view returns (address)',
  'function pendingOwner() external view returns (address)',
  'function singleVote(uint256 storyNodeId, uint256 tokenId, uint8 optionId) external',
  'function storyNodes(uint256) external view returns (tuple(uint40 endTimestamp, uint8 optionCount, uint8[] optionRestrictions))',
  'function storyNodeMetadata(uint256) external view returns (string)',
  'function VOTE_DURATION() external view returns (uint48)',
  'function acceptOwnership() external',
  'function renounceOwnership() external',
  'function transferOwnership(address newOwner) external',
];

let abi = abi_v1;

/**
 * Resolve a read-only contract instance for the requested story version.
 * @param version - The on-chain contract version to target.
 * @returns A promise that resolves to an ethers Contract connected to the configured provider.
 */
const contract = async (version: 'v1' | 'v2' = 'v2'): Promise<any> => {
  const provider = new JsonRpcProvider(
    `https://base-mainnet.g.alchemy.com/v2/${import.meta.env.PUBLIC_ALCHEMY_API_KEY}`,
  );

  if (version === 'v1' && CONTRACT_ADDRESS !== v1) {
    CONTRACT_ADDRESS = v1;
    abi = abi_v1;
  } else if (version === 'v2' && CONTRACT_ADDRESS !== v2) {
    CONTRACT_ADDRESS = v2;
    abi = abi_v2;
  }

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  return contract.connect(provider!);
};

export default contract;
