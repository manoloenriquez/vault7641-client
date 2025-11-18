'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Sparkles, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useGuildAssignmentUserPaid } from '@/hooks/use-guild-assignment-user-paid'

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
      'Partner perks',
      'Live sessions + recaps',
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
      'Market Outlook Newsletters',
      'Whale Watch',
      'Private Research',
    ],
  },
  {
    id: 'farmer',
    name: 'Farmer Guild',
    description: 'For DeFi participants, airdrop hunters, points farmers, and yield strategists.',
    gradient: 'from-lime-600 via-green-900 to-green-600',
    color: 'bg-green-500',
    benefits: [
      'Alerts & Routes',
      'Walkthroughs',
      'Points Meta',
      'Risk Desk',
      'Cohorts',
      'Advanced resources',
      'Mentor rooms with seasoned farmers',
      'Access exclusive guild chat',
    ],
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
      'Mentor rooms with creators and experts',
      'Access exclusive guild chat',
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
      'Proof-of-Work Threads',
      'Opportunity Radar',
    ],
  },
]

interface NFTRevealFeatureProps {
  nftId: string
}

export function NFTRevealFeature({ nftId }: NFTRevealFeatureProps) {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { assignGuild, isAssigning } = useGuildAssignmentUserPaid()
  const [nft, setNft] = useState<NFTData | null>(null)
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadNFT = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/nft/${nftId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch NFT')
      }

      const result = await response.json()
      setNft(result.data)

      // If NFT is already revealed, redirect to guild selection
      // if (result.data.isRevealed) {
      //   router.push('/guild-selection')
      //   return
      // }
    } catch (error) {
      console.error('Error loading NFT:', error)
      toast.error('Failed to load NFT details')
      router.push('/guild-selection')
    } finally {
      setIsLoading(false)
    }
  }, [nftId, router])

  useEffect(() => {
    loadNFT()
  }, [loadNFT])

  const handleReveal = async () => {
    if (!selectedGuild || !nft || !publicKey) return

    // Extract token number from NFT name (e.g., "Vault Pass #1234" -> 1234)
    const tokenNumberMatch = nft.name.match(/#(\d+)/)
    const tokenNumber = tokenNumberMatch ? parseInt(tokenNumberMatch[1], 10) : 0

    if (!tokenNumber) {
      toast.error('Could not determine token number from NFT name')
      return
    }

    try {
      // Use the new user-paid transaction hook
      const signature = await assignGuild(
        nft.mintAddress,
        tokenNumber,
        selectedGuild.id as 'builder' | 'trader' | 'farmer' | 'gamer' | 'pathfinder',
      )

      if (!signature) {
        // User cancelled or error occurred (already handled by hook)
        return
      }

      toast.success(`Successfully revealed ${nft.name} and assigned to ${selectedGuild.name}!`)

      // Redirect to result page with transaction signature
      router.push(`/reveal/${nftId}/result?guild=${selectedGuild.id}&tx=${signature}`)
    } catch (error) {
      console.error('Error revealing NFT:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reveal NFT. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-zinc-400">Loading NFT details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">NFT Not Found</h1>
            <Button onClick={() => router.push('/guild-selection')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Guild Selection
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.push('/guild-selection')} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to NFT Collection
            </Button>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                <Sparkles className="w-10 h-10 text-purple-500" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Reveal Your NFT</h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-3xl mx-auto">
                Choose a guild to reveal your {nft.name} and unlock exclusive benefits and access.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* NFT Preview */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Your NFT</h2>
              <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover rounded-t-lg"
                    />

                    <div className="absolute top-3 right-3">
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Unrevealed
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{nft.name}</h3>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-white">Attributes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {nft.metadata.attributes.map((attr, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {attr.trait_type}: {attr.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guild Selection */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Choose Your Guild</h2>
              <div className="space-y-4 max-h-[640px] overflow-y-auto">
                {guilds.map((guild) => (
                  <Card
                    key={guild.id}
                    className={`cursor-pointer transition-all ${
                      selectedGuild?.id === guild.id
                        ? 'border-purple-500 bg-purple-500/10 scale-105'
                        : 'border-zinc-800 hover:border-zinc-700 hover:scale-102'
                    }`}
                    onClick={() => setSelectedGuild(guild)}
                  >
                    <CardContent className="p-4">
                      <div className={`h-1 bg-gradient-to-r ${guild.gradient} rounded-full mb-4`} />

                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full ${guild.color}`} />
                        <h3 className="font-bold text-white">{guild.name}</h3>
                        {selectedGuild?.id === guild.id && <CheckCircle className="w-5 h-5 text-purple-400 ml-auto" />}
                      </div>

                      <p className="text-sm text-zinc-400 mb-4">{guild.description}</p>

                      {/* <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-white">Key Benefits:</h4>
                        {guild.benefits.slice(0, 3).map((benefit, index) => (
                          <div key={index} className="flex items-center text-xs text-zinc-300">
                            <div className="w-1 h-1 bg-purple-400 rounded-full mr-2 flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                        {guild.benefits.length > 3 && (
                          <div className="text-xs text-purple-400">+{guild.benefits.length - 3} more benefits</div>
                        )}
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Reveal Button */}
          <div className="text-center">
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto">
              {selectedGuild ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`w-6 h-6 rounded-full ${selectedGuild.color}`} />
                    <span className="text-lg font-semibold text-white">Ready to join {selectedGuild.name}?</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    This action will reveal your NFT and permanently assign it to the {selectedGuild.name}. This cannot
                    be undone.
                  </p>
                  <Button
                    onClick={handleReveal}
                    disabled={isAssigning}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-12"
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Revealing...
                      </>
                    ) : (
                      <>
                        Reveal & Join Guild
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Choose a Guild</h3>
                  <p className="text-zinc-400">
                    Select a guild above to reveal your NFT and unlock exclusive benefits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
