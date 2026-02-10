// MegaETH Network Configuration
// Updated for Mainnet - February 2025

export const NETWORK_CONFIG = {
  // Mainnet Configuration
  chainId: 6342,
  chainName: 'MegaETH Mainnet',
  rpcUrl: 'https://carrot.megaeth.com/rpc',
  wsUrl: 'wss://carrot.megaeth.com/ws',
  explorerUrl: 'https://explorer.megaeth.com',
  
  // Currency
  nativeCurrency: {
    name: 'MegaETH',
    symbol: 'METH',
    decimals: 18,
  },
  
  // Network flags
  isTestnet: false,
  isMainnet: true,
  
  // Block times (MegaETH real-time blocks)
  blockTime: 10, // ms - MegaETH has sub-second block times
  
  // Gas configuration
  gas: {
    maxFeePerGas: '1000000000', // 1 Gwei
    maxPriorityFeePerGas: '100000000', // 0.1 Gwei
    gasLimit: 21000, // Standard transfer
  },
} as const;

// Legacy testnet config (deprecated - for reference only)
export const TESTNET_CONFIG = {
  chainId: 6341,
  chainName: 'MegaETH Testnet',
  rpcUrl: 'https://testnet.megaeth.com/rpc',
  explorerUrl: 'https://testnet-explorer.megaeth.com',
} as const;

// Export default config
export default NETWORK_CONFIG;
