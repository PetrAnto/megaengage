// MegaETH API Endpoints
// Updated for Mainnet - February 2025

export const API_ENDPOINTS = {
  // Mainnet API
  baseUrl: 'https://api.megaeth.com/v1',
  
  // Blockchain Data
  getBlock: (blockNumber: number | string) => 
    `https://explorer.megaeth.com/api/block/${blockNumber}`,
  
  getAddress: (address: string) => 
    `https://explorer.megaeth.com/api/address/${address}`,
  
  getTransaction: (hash: string) => 
    `https://explorer.megaeth.com/api/tx/${hash}`,
  
  // Engagement/Points API
  getPoints: (address: string) => 
    `https://api.megaeth.com/v1/points/${address}`,
  
  getLeaderboard: () => 
    'https://api.megaeth.com/v1/leaderboard',
  
  // Transaction Status
  getTxStatus: (hash: string) => 
    `https://api.megaeth.com/v1/tx/status/${hash}`,
  
  // Gas Price (real-time on MegaETH)
  getGasPrice: () => 
    'https://api.megaeth.com/v1/gas',
  
  // Network Stats
  getNetworkStats: () => 
    'https://api.megaeth.com/v1/stats',
  
} as const;

// WebSocket endpoints for real-time data
export const WS_ENDPOINTS = {
  // Mainnet WebSocket
  baseUrl: 'wss://api.megaeth.com/ws',
  
  // Subscribe to new blocks
  newBlocks: 'subscribe_newBlocks',
  
  // Subscribe to pending transactions
  pendingTxs: 'subscribe_pendingTransactions',
  
  // Subscribe to address activity
  addressActivity: (address: string) => 
    `subscribe_address_${address}`,
  
} as const;

// Deprecated testnet endpoints (for reference only)
// ⚠️ Faucet not available on mainnet - use real ETH
export const DEPRECATED_ENDPOINTS = {
  testnetApi: 'https://testnet-api.megaeth.com/v1',
  faucet: 'https://faucet.megaeth.com', // Not available on mainnet
  testnetExplorer: 'https://testnet-explorer.megaeth.com',
} as const;

export default API_ENDPOINTS;
