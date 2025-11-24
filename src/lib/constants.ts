// Site-wide constants
export const SITE_CONFIG = {
  name: 'Vault 7641',
  description: 'Web3 Education and Community Platform',
  url: 'https://vault7641.com',
} as const

// Social media and external links
export const SOCIAL_LINKS = {
  discord: 'https://discord.gg/vault7641',
  twitter: 'https://twitter.com/vault7641',
  telegram: 'https://t.me/vault7641',
} as const

// API endpoints and configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.vault7641.com',
  timeout: 10000,
} as const

// Wallet and blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  network: 'mainnet-beta' as const,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
} as const

// Feature flags
export const FEATURES = {
  enableMinting: process.env.NEXT_PUBLIC_ENABLE_MINTING === 'true',
  enableStaking: process.env.NEXT_PUBLIC_ENABLE_STAKING === 'true',
  enableMarketplace: process.env.NEXT_PUBLIC_ENABLE_MARKETPLACE === 'true',
} as const

// 🎨 MOCK MODE - Set to true to prevent actual transaction requests (but still shows real NFTs)
// When true, transaction requests will be blocked to prevent on-chain operations
export const USE_MOCK_TRANSACTIONS = false

// Guild configuration
export const GUILD_CONFIG = {
  totalSupply: 7641,
  mintPrice: 0.1, // SOL
  maxPerWallet: 3,
} as const

// UI Constants
export const UI_CONFIG = {
  maxWidth: '1440px',
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
  },
} as const

// Error messages
export const ERROR_MESSAGES = {
  walletNotConnected: 'Please connect your wallet to continue',
  insufficientFunds: 'Insufficient funds for this transaction',
  transactionFailed: 'Transaction failed. Please try again.',
  networkError: 'Network error. Please check your connection.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  walletConnected: 'Wallet connected successfully',
  transactionSuccess: 'Transaction completed successfully',
  profileUpdated: 'Profile updated successfully',
} as const
