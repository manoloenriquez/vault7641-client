'use client'

import { useEffect, useRef } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { getNFTWithMetadata } from '@/lib/solana/nft-operations'

/**
 * Hook to automatically prefetch and cache NFTs when wallet connects
 *
 * This hook runs in the background as soon as a wallet is connected,
 * fetching and caching NFT data before the user navigates to any NFT page.
 *
 * Benefits:
 * - NFT pages load instantly from cache
 * - Better perceived performance
 * - Reduced wait time for users
 *
 * @param enabled - Whether prefetching is enabled (default: true)
 */
export function useNFTPrefetch(enabled = true) {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const prefetchedRef = useRef<string | null>(null)
  const prefetchingRef = useRef<boolean>(false)
  const attemptCountRef = useRef<number>(0)

  useEffect(() => {
    // Only prefetch if:
    // 1. Prefetching is enabled
    // 2. Wallet is connected
    // 3. We have a public key
    // 4. We haven't already prefetched for this wallet
    // 5. Not currently prefetching
    if (
      !enabled ||
      !connected ||
      !publicKey ||
      prefetchedRef.current === publicKey.toBase58() ||
      prefetchingRef.current
    ) {
      return
    }

    const prefetchNFTs = async () => {
      prefetchingRef.current = true
      attemptCountRef.current += 1
      const walletAddress = publicKey.toBase58()

      try {
        console.log('🚀 [Prefetch] Starting background NFT fetch for:', walletAddress)
        const startTime = Date.now()

        // Fetch and cache NFTs in the background
        const nfts = await getNFTWithMetadata(connection, publicKey)

        const duration = Date.now() - startTime
        console.log(
          `✅ [Prefetch] ${nfts.length} NFT${nfts.length !== 1 ? 's' : ''} cached in ${duration}ms for:`,
          walletAddress,
        )

        // Mark this wallet as prefetched
        prefetchedRef.current = walletAddress
      } catch (error) {
        console.error('❌ [Prefetch] Error prefetching NFTs:', error)
        // Don't mark as prefetched on error, so it can retry
        // But limit retry attempts to avoid infinite loops
        if (attemptCountRef.current < 3) {
          console.log(`[Prefetch] Will retry... (attempt ${attemptCountRef.current}/3)`)
        }
      } finally {
        prefetchingRef.current = false
      }
    }

    // Start prefetching immediately
    prefetchNFTs()
  }, [connected, publicKey, connection, enabled])

  // Cleanup when wallet disconnects
  useEffect(() => {
    if (!connected) {
      prefetchedRef.current = null
      prefetchingRef.current = false
      attemptCountRef.current = 0
    }
  }, [connected])

  return {
    isPrefetching: prefetchingRef.current,
    prefetchedWallet: prefetchedRef.current,
    isReady: prefetchedRef.current === publicKey?.toBase58(),
  }
}
