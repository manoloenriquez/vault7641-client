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
    'https://mainnet.helius-rpc.com/?api-key=ae5a7e40-416d-443e-b2f4-efe2e4cd8ba3'
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

/**
 * Get the NFT Collection Address
 *
 * This is the collection address for Vault 7641 NFTs
 */
export function getCollectionAddress(): string | undefined {
  return process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS
}
