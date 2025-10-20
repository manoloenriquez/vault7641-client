import { PublicKey } from '@solana/web3.js'

/**
 * NFT Cache Configuration
 */
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds
const MAX_CACHE_SIZE = 100 // Maximum number of wallet addresses to cache

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  walletAddress: string
}

/**
 * In-memory cache for NFT data
 */
class NFTCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, CacheEntry<any>>
  private accessOrder: string[] // Track access order for LRU eviction

  constructor() {
    this.cache = new Map()
    this.accessOrder = []
  }

  /**
   * Get cached data for a wallet address
   */
  get<T>(walletAddress: PublicKey | string): T | null {
    const key = this.getKey(walletAddress)
    const entry = this.cache.get(key)

    if (!entry) {
      console.log('[NFT Cache] MISS:', key)
      return null
    }

    // Check if cache entry has expired
    const now = Date.now()
    const age = now - entry.timestamp
    if (age > CACHE_TTL) {
      console.log('[NFT Cache] EXPIRED:', key, `(${Math.round(age / 1000)}s old)`)
      this.cache.delete(key)
      this.removeFromAccessOrder(key)
      return null
    }

    // Update access order for LRU
    this.updateAccessOrder(key)

    console.log('[NFT Cache] HIT:', key, `(${Math.round(age / 1000)}s old)`)
    return entry.data as T
  }

  /**
   * Set cached data for a wallet address
   */
  set<T>(walletAddress: PublicKey | string, data: T): void {
    const key = this.getKey(walletAddress)

    // Evict oldest entry if cache is full
    if (this.cache.size >= MAX_CACHE_SIZE && !this.cache.has(key)) {
      this.evictOldest()
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      walletAddress: key,
    }

    this.cache.set(key, entry)
    this.updateAccessOrder(key)

    console.log('[NFT Cache] SET:', key, `(${Array.isArray(data) ? data.length : 1} items)`)
  }

  /**
   * Invalidate cache for a specific wallet address
   */
  invalidate(walletAddress: PublicKey | string): void {
    const key = this.getKey(walletAddress)
    const deleted = this.cache.delete(key)
    this.removeFromAccessOrder(key)

    if (deleted) {
      console.log('[NFT Cache] INVALIDATED:', key)
    }
  }

  /**
   * Clear all cached data
   */
  clear(): void {
    const size = this.cache.size
    this.cache.clear()
    this.accessOrder = []
    console.log('[NFT Cache] CLEARED:', size, 'entries')
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.values())

    return {
      size: this.cache.size,
      maxSize: MAX_CACHE_SIZE,
      ttl: CACHE_TTL,
      entries: entries.map((entry) => ({
        wallet: entry.walletAddress,
        age: Math.round((now - entry.timestamp) / 1000),
        itemCount: Array.isArray(entry.data) ? entry.data.length : 1,
      })),
    }
  }

  /**
   * Convert wallet address to cache key
   */
  private getKey(walletAddress: PublicKey | string): string {
    return typeof walletAddress === 'string' ? walletAddress : walletAddress.toBase58()
  }

  /**
   * Update access order for LRU cache
   */
  private updateAccessOrder(key: string): void {
    // Remove from current position
    this.removeFromAccessOrder(key)
    // Add to end (most recently used)
    this.accessOrder.push(key)
  }

  /**
   * Remove key from access order array
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index !== -1) {
      this.accessOrder.splice(index, 1)
    }
  }

  /**
   * Evict the least recently used entry
   */
  private evictOldest(): void {
    if (this.accessOrder.length === 0) return

    const oldestKey = this.accessOrder[0]
    this.cache.delete(oldestKey)
    this.removeFromAccessOrder(oldestKey)

    console.log('[NFT Cache] EVICTED (LRU):', oldestKey)
  }
}

/**
 * Global NFT cache instance
 */
export const nftCache = new NFTCache()

/**
 * Hook to manually invalidate cache (useful after NFT updates)
 */
export function invalidateNFTCache(walletAddress: PublicKey | string) {
  nftCache.invalidate(walletAddress)
}

/**
 * Hook to clear all cached NFT data
 */
export function clearNFTCache() {
  nftCache.clear()
}

/**
 * Get cache statistics for debugging
 */
export function getNFTCacheStats() {
  return nftCache.getStats()
}
