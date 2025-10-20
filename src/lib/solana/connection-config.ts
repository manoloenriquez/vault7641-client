import { ConnectionConfig } from '@solana/web3.js'

/**
 * Global Solana Connection Configuration
 *
 * This configuration is used across the entire application to ensure
 * consistent behavior for all Solana connections.
 */
export const SOLANA_CONNECTION_CONFIG: ConnectionConfig = {
  commitment: 'confirmed',
  confirmTransactionInitialTimeout: 60000, // 60 seconds
  wsEndpoint: undefined, // Will use default WebSocket endpoint based on RPC URL
}

/**
 * Get the RPC URL from environment or use default
 */
export function getSolanaRpcUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    'https://spring-fragrant-violet.solana-mainnet.quiknode.pro/79d544575c48d9b2a6a8f91ecabf7f981a9ee730'
  )
}

/**
 * UMI Configuration
 *
 * Configuration options for Metaplex UMI instances
 */
export const UMI_CONFIG = {
  commitment: 'confirmed' as const,
}
