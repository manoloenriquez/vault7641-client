'use client'

import { useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { invalidateNFTCache, clearNFTCache, getNFTCacheStats } from '@/lib/solana/nft-operations'

/**
 * React hook for managing NFT cache
 *
 * Provides utilities to:
 * - Invalidate cache for current wallet
 * - Clear all cache
 * - Get cache statistics
 */
export function useNFTCache() {
  const { publicKey } = useWallet()

  /**
   * Invalidate cache for the current connected wallet
   */
  const invalidateCurrentWallet = useCallback(() => {
    if (!publicKey) {
      console.warn('No wallet connected, cannot invalidate cache')
      return false
    }

    invalidateNFTCache(publicKey)
    invalidateNFTCache(`${publicKey.toBase58()}_metadata`)
    console.log('✅ Cache invalidated for current wallet:', publicKey.toBase58())
    return true
  }, [publicKey])

  /**
   * Clear all cached NFT data across all wallets
   */
  const clearAll = useCallback(() => {
    clearNFTCache()
    console.log('✅ All NFT cache cleared')
  }, [])

  /**
   * Get cache statistics
   */
  const getStats = useCallback(() => {
    return getNFTCacheStats()
  }, [])

  return {
    invalidateCurrentWallet,
    clearAll,
    getStats,
  }
}
