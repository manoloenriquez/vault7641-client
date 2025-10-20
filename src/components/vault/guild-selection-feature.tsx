'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, Sparkles, ChevronRight, CheckCircle, Coins } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useGuildSelection } from '@/hooks/use-guild-selection'
import { getNFTWithMetadata } from '@/lib/solana/nft-operations'

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

interface Guild {
  id: string
  name: string
  description: string
  gradient: string
  color: string
  benefits: string[]
}

// Guild data
const guilds: Guild[] = [
  {
    id: 'builder',
    name: 'Builder Guild',
    description:
      'For Web3 engineers, designers, data researchers, automators, founders, product designers, anyone who builds & ships.',
    gradient: 'from-yellow-300 via-yellow-500 to-yellow-800',
    color: 'bg-yellow-500',
    benefits: [
      'Forum board',
      'Build Logs',
      'Code/Design Reviews',
      'RFC (Request for Comments) lane',
      'Advanced learning resources',
      'Direct mentor & expert chats + AMAs',
    ],
  },
  {
    id: 'trader',
    name: 'Trader Guild',
    description:
      'For new and experienced traders & investors who want structured, real market insights, clear setups & opportunities.',
    gradient: 'from-orange-400 via-orange-600 to-red-700',
    color: 'bg-orange-500',
    benefits: [
      'Exclusive Market Insights & Signals',
      'Actionable Trade Setups',
      'Market Watch & News',
      'On-Chain Data & Reports',
      'Community Coaching & Feedback',
    ],
  },
  {
    id: 'farmer',
    name: 'Farmer Guild',
    description: 'For DeFi participants, airdrop hunters, points farmers, and yield strategists.',
    gradient: 'from-lime-600 via-green-900 to-green-600',
    color: 'bg-green-500',
    benefits: ['Alerts & Routes', 'Walkthroughs', 'Points Meta', 'Risk Desk', 'Cohorts', 'Advanced resources'],
  },
  {
    id: 'gamer',
    name: 'Gamer Guild',
    description: 'For P2E gamers, NFT collectors, flippers, and enjoyers of game economies.',
    gradient: 'from-fuchsia-600 via-violet-900 to-fuchsia-900',
    color: 'bg-fuchsia-500',
    benefits: [
      'Mints Today & Exclusive Alpha',
      'Game Nights & Playtests',
      'Flip Desk',
      'Economy Watch',
      'Creator Corner',
      'Advanced resources',
    ],
  },
  {
    id: 'pathfinder',
    name: 'Pathfinder Guild',
    description:
      'For Marketers, CMs, devs, analysts, designers, students, unemployed, and professionals who want Web3 careers.',
    gradient: 'from-cyan-600 via-teal-400 to-cyan-500',
    color: 'bg-cyan-500',
    benefits: [
      'Curated Job Board',
      'Bounties & Paid Tasks',
      'Application Sprints',
      'Résumé/CV & Portfolio Reviews',
      'Mock Interviews',
      'Referral Network',
    ],
  },
]

// Mock NFT data - Replace with actual API call
const mockNFTs: NFTData[] = [
  {
    id: '1',
    name: 'Vault Pass #1234',
    image: '/Logo_Full_nobg.png',
    metadata: {
      attributes: [
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Background', value: 'Dark' },
      ],
    },
    mintAddress: 'mint1234567890',
    isRevealed: false,
  },
  {
    id: '2',
    name: 'Vault Pass #5678',
    image: '/Logo_Full_nobg.png',
    metadata: {
      attributes: [
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Background', value: 'Blue' },
      ],
    },
    mintAddress: 'mint0987654321',
    assignedGuild: 'trader',
    isRevealed: true,
  },
  {
    id: '3',
    name: 'Vault Pass #9012',
    image: '/Logo_Full_nobg.png',
    metadata: {
      attributes: [
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Background', value: 'Gold' },
      ],
    },
    mintAddress: 'mint1122334455',
    isRevealed: false,
  },
]

export function GuildSelectionFeature() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const { isConnected } = useGuildSelection()

  const [nfts, setNFTs] = useState<NFTData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadUserNFTs = useCallback(async () => {
    if (!publicKey) return

    setIsLoading(true)
    try {
      console.log('Loading NFTs for wallet:', publicKey.toBase58())

      // Fetch NFTs from Solana blockchain with full metadata
      const nftsWithMetadata = await getNFTWithMetadata(connection, publicKey)

      console.log('NFTs with metadata loaded:', nftsWithMetadata.length)

      // Transform to our NFTData format
      const transformedNFTs: NFTData[] = nftsWithMetadata.map((nft, index) => {
        const metadata = nft.metadata || {}

        // Convert UMI PublicKey to string (it has a string representation)
        const mintAddress = String(nft.mint)

        return {
          id: mintAddress,
          name: nft.name || `NFT #${index + 1}`,
          image: metadata.image || metadata.image_uri || '/Logo_Full_nobg.png',
          metadata: {
            attributes: metadata.attributes || [],
          },
          mintAddress: mintAddress,
          isRevealed: false, // Check if already assigned to a guild
        }
      })

      console.log(
        'Transformed NFTs:',
        transformedNFTs.map((n) => ({ name: n.name, image: n.image })),
      )
      setNFTs(transformedNFTs)

      if (transformedNFTs.length === 0) {
        toast.info('No NFTs found in your wallet')
      } else {
        toast.success(`Loaded ${transformedNFTs.length} NFT${transformedNFTs.length > 1 ? 's' : ''}`)
      }
    } catch (error) {
      console.error('Error loading NFTs:', error)
      toast.error('Failed to load your NFTs')
      // Fallback to mock data for demo purposes
      setNFTs(mockNFTs)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, connection])

  // Load user's NFTs
  useEffect(() => {
    if (publicKey) {
      loadUserNFTs()
    } else {
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

  const getGuildById = (guildId: string) => {
    return guilds.find((guild) => guild.id === guildId)
  }

  const unrevealedCount = nfts.filter((nft) => !nft.isRevealed).length
  const revealedCount = nfts.filter((nft) => nft.isRevealed).length

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
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-cyan-500 !text-white !font-semibold !text-lg !px-8 !py-4 !rounded-md hover:!from-purple-600 hover:!to-cyan-600 !transition-all" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
              <Sparkles className="w-10 h-10 text-purple-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Guild Selection</h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
              Choose a guild for each of your Vault NFTs. Each NFT can be assigned to a different guild, unlocking
              unique benefits and access.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="px-4 py-2 text-lg">
                <Coins className="w-4 h-4 mr-2" />
                {nfts.length} Total NFTs
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-green-500/30 text-green-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                {revealedCount} Revealed
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-orange-500/30 text-orange-400">
                <Sparkles className="w-4 h-4 mr-2" />
                {unrevealedCount} Unrevealed
              </Badge>
            </div>

            {unrevealedCount > 0 && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-zinc-400 mb-2">
                  <span>Reveal Progress</span>
                  <span>
                    {revealedCount}/{nfts.length}
                  </span>
                </div>
                <Progress value={(revealedCount / nfts.length) * 100} className="h-2" />
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
              <p className="text-zinc-400">Loading your NFTs...</p>
            </div>
          )}

          {/* NFTs Grid */}
          {!isLoading && nfts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {nfts.map((nft) => {
                const assignedGuild = nft.assignedGuild ? getGuildById(nft.assignedGuild) : null

                return (
                  <Card
                    key={nft.id}
                    className={`bg-zinc-950/50 border-zinc-800 hover:border-purple-500/50 transition-all cursor-pointer group ${
                      nft.isRevealed ? 'opacity-75' : 'hover:scale-105'
                    }`}
                    onClick={() => handleNFTSelect(nft)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src={nft.image}
                          alt={nft.name}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover rounded-t-lg"
                        />

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          {nft.isRevealed ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Revealed
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Unrevealed
                            </Badge>
                          )}
                        </div>

                        {/* Guild Assignment */}
                        {assignedGuild && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className={`bg-gradient-to-r ${assignedGuild.gradient} p-[1px] rounded-lg`}>
                              <div className="bg-zinc-900 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${assignedGuild.color}`} />
                                  <span className="text-white text-sm font-medium">{assignedGuild.name}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-white mb-2">{nft.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {nft.metadata.attributes.slice(0, 2).map((attr, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {attr.value}
                            </Badge>
                          ))}
                        </div>

                        {!nft.isRevealed && (
                          <div className="flex items-center text-sm text-purple-400 group-hover:text-purple-300">
                            <span>Click to reveal</span>
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && nfts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
              <p className="text-zinc-400 mb-6">You don&apos;t have any Vault NFTs in your wallet yet.</p>
              <Button variant="outline" asChild>
                <a href="/mint">Go to Mint</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
