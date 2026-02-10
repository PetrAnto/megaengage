// MegaETH Mainnet Contract Addresses
// Updated for Mainnet - February 2025
// ⚠️ UPDATE THESE WITH ACTUAL DEPLOYED CONTRACT ADDRESSES

export const CONTRACT_ADDRESSES = {
  // Core Protocol Contracts
  // TODO: Replace with actual mainnet deployed addresses
  
  // Engagement/Rewards Contract
  EngagementRewards: '0x0000000000000000000000000000000000000000', // UPDATE ME
  
  // Token Contracts
  RewardToken: '0x0000000000000000000000000000000000000000', // UPDATE ME
  
  // NFT Contracts (if applicable)
  EngagementNFT: '0x0000000000000000000000000000000000000000', // UPDATE ME
  
  // Staking Contract
  Staking: '0x0000000000000000000000000000000000000000', // UPDATE ME
  
  // Multi-sig/Treasury
  Treasury: '0x0000000000000000000000000000000000000000', // UPDATE ME
  
} as const;

// Contract ABIs
export const CONTRACT_ABIS = {
  EngagementRewards: [
    'function claimReward() external',
    'function getPendingReward(address) external view returns (uint256)',
    'function stake(uint256 amount) external',
    'function unstake(uint256 amount) external',
    'event RewardClaimed(address indexed user, uint256 amount)',
  ],
  
  RewardToken: [
    'function balanceOf(address) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function transfer(address to, uint256 amount) external returns (bool)',
  ],
  
  EngagementNFT: [
    'function mint() external payable',
    'function tokenURI(uint256) external view returns (string)',
    'function balanceOf(address) external view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  ],
  
  Staking: [
    'function stake(uint256 amount) external',
    'function unstake(uint256 amount) external',
    'function getStakedBalance(address) external view returns (uint256)',
    'function getReward() external',
  'function earned(address) external view returns (uint256)',
  'event Staked(address indexed user, uint256 amount)',
    'event Unstaked(address indexed user, uint256 amount)',
  ],
} as const;

// Deprecated testnet addresses (for reference only)
export const TESTNET_ADDRESSES = {
  EngagementRewards: '0x1234567890abcdef1234567890abcdef12345678',
  RewardToken: '0xabcdef1234567890abcdef1234567890abcdef12',
} as const;

export default CONTRACT_ADDRESSES;
