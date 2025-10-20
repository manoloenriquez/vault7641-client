'use client'

import { useNFTPrefetch } from '@/hooks/use-nft-prefetch'
import { ReactNode } from 'react'

/**
 * NFT Prefetch Provider
 *
 * This component automatically prefetches and caches NFT data
 * when a wallet connects, improving perceived performance.
 *
 * Place this inside SolanaProvider in the component tree.
 */
export function NFTPrefetchProvider({ children }: { children: ReactNode }) {
  // Start prefetching NFTs when wallet connects
  useNFTPrefetch(true)

  // This component only runs the hook, it doesn't render anything special
  return <>{children}</>
}
