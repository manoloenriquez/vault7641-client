'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, Sparkles, ChevronRight, CheckCircle, Coins, RefreshCcw, Wallet, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useGuildSelection } from '@/hooks/use-guild-selection'
import { GUILDS, getGuildById } from '@/lib/guild-constants'

// Helper function to convert IPFS URLs to gateway URLs
const convertIPFSUrl = (url: string): string => {
  if (!url) return '/Logo_Full_nobg.png'

  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Handle ipfs:// protocol
  if (url.startsWith('ipfs://')) {
    const ipfsHash = url.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }

  // Handle IPFS hash without protocol
  if (url.startsWith('Qm') || url.startsWith('baf')) {
    return `https://ipfs.io/ipfs/${url}`
  }

  // If it's a relative path, return as is
  if (url.startsWith('/')) {
    return url
  }

  // Default fallback
  return url
}

// Types
interface NFTData {
  id: string
  name: string
  image: string
  metadata: {
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }
  mintAddress: string
  assignedGuild?: string
  isRevealed: boolean
}

const TOKEN_ID_KEYS = ['token id', 'token_id', 'token', 'id']

const deriveTokenId = (nft: NFTData, index: number): number => {
  const candidateFromAttr = nft.metadata.attributes.find((attr) =>
    TOKEN_ID_KEYS.includes(attr.trait_type?.toLowerCase() ?? ''),
  )

  const rawCandidates = [
    candidateFromAttr?.value,
    nft.id?.match(/\d+/)?.[0],
    nft.mintAddress?.match(/\d+/)?.[0],
    `${index + 1}`,
  ]

  for (const raw of rawCandidates) {
    if (!raw) continue
    const parsed = Number.parseInt(String(raw), 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return index + 1
}

const extractGender = (attributes: NFTData['metadata']['attributes']): string | null => {
  const match = attributes.find((attr) => attr.trait_type?.toLowerCase() === 'gender')
  return typeof match?.value === 'string' ? match.value : null
}

export function GuildSelectionFeature() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { isConnected } = useGuildSelection()

  const [nfts, setNFTs] = useState<NFTData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const hasNFTs = nfts.length > 0
  const revealedCount = nfts.filter((nft) => nft.isRevealed).length
  const unrevealedCount = nfts.filter((nft) => !nft.isRevealed).length
  const revealPercent = hasNFTs ? Math.round((revealedCount / nfts.length) * 100) : 0
  const walletAddress = publicKey?.toBase58() ?? ''
  const walletDisplay = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : '—'

  const loadUserNFTs = useCallback(async () => {
    if (!publicKey) return

    setIsLoading(true)
    setLoadError(null)
    setImageErrors(new Set()) // Clear previous image errors

    // Always fetch real NFTs from API
    try {
      const walletAddress = publicKey.toBase58()
      console.log('📡 [Guild Selection] Fetching NFTs from API for wallet:', walletAddress)

      // Fetch NFTs from API endpoint (uses DAS API + caching)
      const response = await fetch(`/api/nfts/${walletAddress}`)

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const fetchedNFTs = data.data || []

      console.log('✅ [Guild Selection] NFTs loaded from API:', fetchedNFTs.length)

      // Transform to our NFTData format
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedNFTs: NFTData[] = fetchedNFTs.map((nft: any) => {
        const imageUrl = nft.image || '/Logo_Full_nobg.png'
        return {
          id: nft.id || nft.mintAddress,
          name: nft.name || 'Unknown NFT',
          image: convertIPFSUrl(imageUrl),
          metadata: {
            attributes: nft.metadata?.attributes || [],
          },
          mintAddress: nft.mintAddress || nft.id,
          assignedGuild: nft.assignedGuild,
          isRevealed: nft.isRevealed || false,
        }
      })

      console.log(
        '✅ [Guild Selection] Transformed NFTs:',
        transformedNFTs.map((n) => ({ name: n.name, revealed: n.isRevealed, guild: n.assignedGuild })),
      )

      const allNFTs = [...transformedNFTs]
      setNFTs(allNFTs)

      if (transformedNFTs.length === 0) {
        // toast.info('Showing mock NFTs for screenshot purposes')
      } else {
        toast.success(`Loaded ${transformedNFTs.length} NFT${transformedNFTs.length > 1 ? 's' : ''}`)
      }
    } catch (error) {
      console.error('❌ [Guild Selection] Error loading NFTs:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setLoadError(errorMessage)
      // toast.error('Failed to load your NFTs - showing mock NFTs')
    } finally {
      setIsLoading(false)
    }
  }, [publicKey])

  const handleRefresh = () => {
    if (isLoading) return
    loadUserNFTs()
  }

  const handleImageError = useCallback((nftId: string) => {
    setImageErrors((prev) => {
      const newSet = new Set(prev)
      newSet.add(nftId)
      return newSet
    })
  }, [])

  // Load user's NFTs
  useEffect(() => {
    if (publicKey) {
      loadUserNFTs()
    } else {
      // Show mock NFTs even when wallet isn't connected (for screenshots)
      setNFTs([])
    }
  }, [publicKey, loadUserNFTs])

  const handleNFTSelect = (nft: NFTData) => {
    if (nft.isRevealed) {
      toast.info('This NFT is already revealed and assigned to a guild')
      return
    }
    // Redirect to reveal page
    router.push(`/reveal/${nft.id}`)
  }

  const showSkeletons = isLoading && !hasNFTs
  const gridClasses = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'

  // Require wallet connection
  if (!isConnected) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
              <Coins className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Guild Selection</h1>
            <p className="text-xl text-zinc-400 mb-8">
              Connect your wallet to view and assign guilds to your Vault NFTs
            </p>
            <WalletMultiButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 mx-auto h-[520px] w-[880px] bg-purple-600/20 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-3xl p-8 md:p-10 shadow-[0_0_60px_rgba(98,0,255,0.15)]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
                <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-purple-300/70 mb-2">Vault 7641</p>
                      <h1 className="text-4xl md:text-6xl font-bold text-white">Guild Selection</h1>
                    </div>
                    <Badge className="bg-white/5 border border-white/20 text-white px-4 py-2 text-sm justify-center">
                      <Wallet className="w-4 h-4 mr-2" />
                      {walletDisplay}
                    </Badge>
                  </div>
                  <p className="text-lg text-zinc-400 max-w-3xl md:max-w-full mx-auto md:mx-0">
                    Assign each Vault NFT to the guild that aligns with your goals. Unlock targeted tracks, gated
                    channels, and experts built for builders, traders, farmers, gamers, and pathfinders.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
                      <Coins className="w-4 h-4 text-amber-400" />
                      Total NFTs
                    </div>
                    <p className="text-3xl font-bold text-white">{nfts.length}</p>
                    <p className="text-sm text-zinc-500">Active in wallet</p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Revealed
                    </div>
                    <p className="text-3xl font-bold text-white">{revealedCount}</p>
                    <p className="text-sm text-zinc-500">{revealPercent}% assigned</p>
                  </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      Unrevealed
                    </div>
                    <p className="text-3xl font-bold text-white">{unrevealedCount}</p>
                    <p className="text-sm text-zinc-500">Ready to unlock perks</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {hasNFTs && (
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-sm text-zinc-400">
                        <span>Reveal progress</span>
                        <span>
                          {revealedCount}/{nfts.length}
                        </span>
                      </div>
                      <Progress value={revealPercent} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Button
                      variant="outline"
                      className="gap-2 text-sm border-zinc-700 text-zinc-200 hover:bg-white/5"
                      onClick={handleRefresh}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Refreshing
                        </>
                      ) : (
                        <>
                          <RefreshCcw className="w-4 h-4" />
                          Refresh NFTs
                        </>
                      )}
                    </Button>
                    <Button asChild className="gap-2 bg-purple-600 hover:bg-purple-500 text-sm">
                      <a href="https://launchmynft.io/sol/21270">
                        <ShieldCheck className="w-4 h-4" />
                        Mint another
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && hasNFTs && (
            <div className="flex items-center justify-center gap-3 text-sm text-purple-200 bg-purple-500/5 border border-purple-500/20 rounded-2xl py-3 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Syncing latest NFT data...</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {showSkeletons && (
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                Loading your Vault NFTs
              </div>
              <div className={`${gridClasses} mb-12`}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="h-80 rounded-2xl border border-zinc-800 bg-zinc-950/60 animate-pulse flex flex-col overflow-hidden"
                  >
                    <div className="h-48 bg-zinc-900" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-zinc-900 rounded w-3/4" />
                      <div className="h-3 bg-zinc-900 rounded w-1/2" />
                      <div className="h-3 bg-zinc-900 rounded w-full" />
                      <div className="h-3 bg-zinc-900 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NFTs Grid */}
          {hasNFTs && (
            <div className={`${gridClasses} mb-12 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
              {nfts.map((nft, index) => {
                const assignedGuild = nft.assignedGuild ? getGuildById(nft.assignedGuild) : null
                const imageSrc = convertIPFSUrl(nft.image)
                const _tokenId = deriveTokenId(nft, index)
                const _gender = extractGender(nft.metadata.attributes)

                return (
                  <Card
                    key={nft.id}
                    className={`relative overflow-hidden bg-zinc-950/70 border border-zinc-900 transition-all duration-300 cursor-pointer group ${
                      nft.isRevealed ? 'opacity-80' : 'hover:scale-[1.02]'
                    }`}
                    onClick={() => handleNFTSelect(nft)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-0 relative">
                      <div className="relative">
                        {imageErrors.has(nft.id) ? (
                          <div className="w-full h-64 bg-zinc-900 flex items-center justify-center rounded-t-2xl">
                            <Coins className="w-16 h-16 text-zinc-600" />
                          </div>
                        ) : nft.image?.startsWith('/') ? (
                          <Image
                            src={nft.image}
                            alt={nft.name}
                            width={300}
                            height={300}
                            className="w-full h-64 object-cover rounded-t-2xl"
                          />
                        ) : (
                          <img
                            src={imageSrc}
                            alt={nft.name}
                            className="w-full h-64 object-cover rounded-t-2xl"
                            onError={() => handleImageError(nft.id)}
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" />

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                          {nft.isRevealed ? (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Revealed
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Unrevealed
                            </Badge>
                          )}
                        </div>

                        {/* Guild Assignment */}
                        {assignedGuild && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className={`bg-gradient-to-r ${assignedGuild.gradient} p-[1px] rounded-xl`}>
                              <div className="bg-zinc-950/90 rounded-[0.7rem] px-3 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${assignedGuild.color}`} />
                                  <span className="text-white text-sm font-medium">{assignedGuild.name}</span>
                                </div>
                                <span className="text-xs text-white/70">Assigned</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-white text-lg leading-tight">{nft.name}</h3>
                          <Badge variant="outline" className="border-zinc-800 text-zinc-300">
                            #{nft.id.slice(-4)}
                          </Badge>
                        </div>

                        {nft.metadata.attributes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-zinc-900 text-zinc-200">
                                {attr.value}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-500">No metadata traits</p>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="text-zinc-500">{nft.isRevealed ? 'Guild assigned' : 'Awaiting reveal'}</div>
                          <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                            <span>{nft.isRevealed ? 'View details' : 'Reveal now'}</span>
                            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Error State */}
          {!isLoading && loadError && (
            <div className="text-center py-12 bg-red-950/30 border border-red-500/20 rounded-3xl px-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Failed to Load NFTs</h3>
              <p className="text-zinc-300 mb-6">
                {loadError || 'An unexpected error occurred while fetching your NFTs.'}
              </p>
              <Button onClick={() => loadUserNFTs()} variant="outline" className="gap-2 border-red-500/30 text-red-200">
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !loadError && !hasNFTs && (
            <div className="text-center py-16 border border-dashed border-zinc-700/60 rounded-3xl bg-zinc-950/60">
              <div className="w-16 h-16 bg-zinc-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-700/50">
                <Coins className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Vault NFTs yet</h3>
              <p className="text-zinc-400 mb-6 max-w-lg mx-auto">
                Mint your first Vault NFT to unlock guild assignments, skill cohorts, and community perks tailored to
                your path.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="outline" className="w-full sm:w-auto" onClick={handleRefresh}>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Check again
                </Button>
                <Button asChild className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500">
                  <a href="https://launchmynft.io/sol/21270">Go to mint</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
