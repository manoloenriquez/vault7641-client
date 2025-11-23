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
 * Get the Irys/Arweave uploader address based on network
 * Optional - can be used to explicitly set the Irys endpoint
 * 
 * NOTE: The Irys uploader auto-detects the network from your RPC endpoint,
 * so you typically don't need to specify the address manually.
 */
export function getIrysAddress(): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK
  
  // Use mainnet Irys node for mainnet-beta, devnet for everything else
  if (network === 'mainnet-beta') {
    return 'https://node1.irys.xyz'
  }
  
  return 'https://devnet.irys.xyz'
}

/**
 * Get the NFT Collection Address
 *
 * This is the collection address for Vault 7641 NFTs
 */
export function getCollectionAddress(): string | undefined {
  return process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS
}

/**
 * Get the Irys uploader address based on the network
 *
 * Determines whether to use devnet or mainnet Irys based on the RPC endpoint
 */
export function getIrysUploaderAddress(): string {
  const rpcUrl = getSolanaRpcUrl().toLowerCase()
  // Check if we're on devnet
  if (rpcUrl.includes('devnet') || rpcUrl.includes('testnet')) {
    return 'https://devnet.irys.xyz'
  }
  // Default to mainnet
  return 'https://node1.irys.xyz'
}
