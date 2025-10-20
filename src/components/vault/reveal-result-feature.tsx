'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Sparkles, CheckCircle, Trophy, ArrowRight, Home, Share2 } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

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

interface RevealResultFeatureProps {
  nftId: string
}

export function RevealResultFeature({ nftId }: RevealResultFeatureProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [nft, setNft] = useState<NFTData | null>(null)
  const [guild, setGuild] = useState<Guild | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  const guildId = searchParams.get('guild')
  const transactionId = searchParams.get('tx')

  const loadNFT = useCallback(async () => {
    setIsLoading(true)
    try {
      // Poll for updated NFT data (metadata update may take a moment to propagate)
      // Reduced polling since the update is usually immediate
      let attempts = 0
      const maxAttempts = 3 // Reduced from 10 to 3
      let nftData = null

      while (attempts < maxAttempts) {
        const response = await fetch(`/api/nft/${nftId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch NFT')
        }

        const result = await response.json()
        nftData = result.data

        console.log(`Polling attempt ${attempts + 1}/${maxAttempts}:`, {
          assignedGuild: nftData.assignedGuild,
          expectedGuild: guildId,
          isRevealed: nftData.isRevealed,
        })

        // Check if NFT has been assigned to the correct guild
        if (nftData.assignedGuild === guildId && nftData.isRevealed) {
          console.log('✅ Guild assignment confirmed!')
          break
        }

        // Wait 1 second before retrying (only if not on last attempt)
        attempts++
        if (attempts < maxAttempts) {
          console.log('Waiting 1 second before next poll...')
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      if (!nftData) {
        throw new Error('Failed to fetch NFT data')
      }

      setNft(nftData)

      // Find the assigned guild
      if (guildId) {
        const assignedGuild = guilds.find((g) => g.id === guildId)
        setGuild(assignedGuild || null)
      }

      // Show success message with updated metadata info
      if (nftData.assignedGuild === guildId && nftData.isRevealed) {
        toast.success('NFT metadata updated successfully!')
      } else if (attempts >= maxAttempts) {
        console.warn('Max polling attempts reached. Showing NFT data as-is.')
        toast.info('NFT revealed! Metadata may take a moment to fully update.')
      }
    } catch (error) {
      console.error('Error loading NFT:', error)
      toast.error('Failed to load NFT details')
      router.push('/guild-selection')
    } finally {
      setIsLoading(false)
    }
  }, [nftId, guildId, router])

  useEffect(() => {
    loadNFT()
  }, [loadNFT])

  useEffect(() => {
    // Show confetti animation
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleShare = async () => {
    try {
      if (navigator.share && guild && nft) {
        await navigator.share({
          title: `I just revealed my ${nft.name}!`,
          text: `I joined the ${guild.name} in Vault 7641! 🎉`,
          url: window.location.origin,
        })
      } else {
        // Fallback: copy to clipboard
        const text = `I just revealed my ${nft?.name} and joined the ${guild?.name} in Vault 7641! 🎉`
        await navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share')
    }
  }

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Updating Your NFT...</h2>
            <p className="text-zinc-400 mb-4">
              We&apos;re fetching your updated NFT metadata with the new guild artwork and attributes.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>This may take a few moments</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!nft || !guild) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">NFT Not Found</h1>
            <Button onClick={() => router.push('/guild-selection')}>Back to Guild Selection</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Celebration Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <Trophy className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Congratulations! 🎉</h1>
            <p className="text-xl text-zinc-400 mb-4">
              Your NFT has been successfully revealed and assigned to your guild!
            </p>
            {transactionId && (
              <Badge variant="outline" className="px-4 py-2">
                Transaction: {transactionId.slice(0, 8)}...{transactionId.slice(-8)}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Revealed NFT */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Your Revealed NFT
              </h2>
              <Card className="bg-zinc-950/50 border-zinc-800 relative overflow-hidden animate-in fade-in duration-500">
                <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${guild.gradient}`} />
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover animate-in zoom-in duration-700"
                      key={nft.image}
                    />

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Revealed
                      </Badge>
                      {nft.assignedGuild && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Metadata Updated
                        </Badge>
                      )}
                    </div>

                    {/* Guild Assignment Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className={`bg-gradient-to-r ${guild.gradient} p-[1px] rounded-lg`}>
                        <div className="bg-zinc-900/95 backdrop-blur rounded-lg px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full ${guild.color}`} />
                            <div>
                              <div className="text-white font-bold">{guild.name}</div>
                              <div className="text-zinc-300 text-sm">Member</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{nft.name}</h3>

                    {/* Metadata Update Confirmation */}
                    {nft.assignedGuild && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
                          <CheckCircle className="w-4 h-4" />
                          NFT Metadata Updated On-Chain
                        </div>
                        <p className="text-xs text-zinc-400">
                          Your NFT now displays the exclusive {guild.name} artwork and updated attributes.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-white">Attributes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {nft.metadata.attributes.map((attr, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs animate-in fade-in duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {attr.trait_type}: {attr.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Guild Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Your Guild Benefits
              </h2>
              <Card className="bg-zinc-950/50 border-zinc-800">
                <CardContent className="p-6">
                  <div className={`h-2 bg-gradient-to-r ${guild.gradient} rounded-full mb-6`} />

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full ${guild.color}`} />
                    <div>
                      <h3 className="text-xl font-bold text-white">{guild.name}</h3>
                      <p className="text-green-400 text-sm font-medium">✓ Member Access Granted</p>
                    </div>
                  </div>

                  <p className="text-zinc-400 mb-6">{guild.description}</p>

                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-white">Your Benefits:</h4>
                    {guild.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={handleShare} variant="outline" size="lg" className="w-full sm:w-auto">
              <Share2 className="w-4 h-4 mr-2" />
              Share Your Achievement
            </Button>

            <Button
              onClick={() => router.push('/guild-selection')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              View All NFTs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button onClick={() => router.push('/')} variant="ghost" size="lg" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Next Steps */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 border border-purple-500/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">What&apos;s Next?</h3>
                <p className="text-zinc-400 mb-6">
                  Join your guild Discord channel to connect with other members and start accessing your benefits!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  <a href="https://discord.gg/MeknM4jSch" target="_blank" rel="noopener noreferrer">
                    Join Guild Discord
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
