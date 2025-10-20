'use client'

import { useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

/**
 * Hook to automatically prefetch and cache NFTs when wallet connects
 *
 * This hook runs in the background as soon as a wallet is connected,
 * fetching NFT data via the API endpoint before the user navigates to any NFT page.
 *
 * Benefits:
 * - NFT pages load instantly from cached API response
 * - Better perceived performance
 * - Reduced wait time for users
 * - Uses existing API endpoint (no duplicate logic)
 *
 * @param enabled - Whether prefetching is enabled (default: true)
 */
export function useNFTPrefetch(enabled = true) {
  const { publicKey, connected } = useWallet()
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

        // Fetch NFTs using the API endpoint (uses DAS API + collection filtering)
        const response = await fetch(`/api/nfts/${walletAddress}`)

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const nfts = data.data || []

        const duration = Date.now() - startTime
        console.log(
          `✅ [Prefetch] SUCCESS! ${nfts.length} NFT${nfts.length !== 1 ? 's' : ''} fetched in ${duration}ms for:`,
          walletAddress,
        )
        console.log(
          `✅ [Prefetch] NFTs:`,
          nfts.map((n: { name: string }) => n.name),
        )

        // Mark this wallet as prefetched
        prefetchedRef.current = walletAddress
      } catch (error) {
        console.error('❌ [Prefetch] Error prefetching NFTs:', error)
        // Don't mark as prefetched on error, so it can retry
        // But limit retry attempts to avoid infinite loops
        if (attemptCountRef.current < 3) {
          console.log(`⚠️ [Prefetch] Will retry... (attempt ${attemptCountRef.current}/3)`)
        }
      } finally {
        prefetchingRef.current = false
      }
    }

    // Start prefetching immediately
    prefetchNFTs()
  }, [connected, publicKey, enabled])

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
