'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Sparkles, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, ArrowDown } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { buildVaultMetadata } from '@/lib/vaultMetadata'
import { TraitAttribute } from '@/types/traits'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GUILDS, type Guild } from '@/lib/guild-constants'

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

interface NFTRevealFeatureProps {
  nftId: string
}

type SignedParamResponse = {
  token: string
  signature: string
  payload: Record<string, unknown>
}

export function NFTRevealFeature({ nftId }: NFTRevealFeatureProps) {
  const router = useRouter()
  const wallet = useWallet()
  const { publicKey } = wallet
  const { connection } = useConnection()
  const [nft, setNft] = useState<NFTData | null>(null)
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const guildListRef = useRef<HTMLDivElement>(null)
  const [isGuildListScrolledToTop, setIsGuildListScrolledToTop] = useState(true)
  const [isGuildListScrolledToBottom, setIsGuildListScrolledToBottom] = useState(false)

  const loadNFT = useCallback(async () => {
    setIsLoading(true)
    try {
      // Check if wallet is connected
      if (!publicKey) {
        toast.error('Please connect your wallet to access this page')
        router.push('/guild-selection')
        return
      }

      // Step 1: Request a signed token for secure access
      const signResponse = await fetch('/api/security/sign-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'nft-access',
          nftId: nftId,
          mint: nftId, // For Core NFTs, the nftId is the mint address
          walletAddress: publicKey.toBase58(),
        }),
      })

      if (!signResponse.ok) {
        const errorData = await signResponse.json().catch(() => ({}))
        
        // Handle unauthorized access (user doesn't own the NFT)
        if (signResponse.status === 403) {
          toast.error('You do not own this NFT')
          router.push('/guild-selection')
          return
        }
        
        throw new Error(errorData.error || 'Failed to authorize access')
      }

      const { token, signature } = await signResponse.json()

      // Step 2: Fetch NFT data using the signed token
      const response = await fetch(`/api/nft/${nftId}?token=${token}&signature=${signature}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Handle unauthorized access
        if (response.status === 401 || response.status === 403) {
          toast.error('You do not own this NFT')
          router.push('/guild-selection')
          return
        }
        
        throw new Error(errorData.message || 'Failed to fetch NFT')
      }

      const result = await response.json()
      setNft(result.data)

      // If NFT is already revealed, redirect to guild selection
      if (result.data.isRevealed) {
        toast.info('This NFT has already been revealed')
        router.push('/guild-selection')
        return
      }
    } catch (error) {
      console.error('Error loading NFT:', error)
      toast.error('Failed to load NFT details')
      router.push('/guild-selection')
    } finally {
      setIsLoading(false)
    }
  }, [nftId, router, publicKey])

  useEffect(() => {
    loadNFT()
  }, [loadNFT])

  useEffect(() => {
    const listEl = guildListRef.current
    if (!listEl) return

    const updateScrollHints = () => {
      const { scrollTop, scrollHeight, clientHeight } = listEl
      setIsGuildListScrolledToTop(scrollTop <= 4)
      setIsGuildListScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 4)
    }

    updateScrollHints()
    listEl.addEventListener('scroll', updateScrollHints)
    window.addEventListener('resize', updateScrollHints)

    return () => {
      listEl.removeEventListener('scroll', updateScrollHints)
      window.removeEventListener('resize', updateScrollHints)
    }
  }, [nft])

  useEffect(() => {
    if (!isProcessing) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isProcessing])

  const handleReveal = async () => {
    if (!selectedGuild || !nft || !publicKey) return

    // Extract token number from NFT name (e.g., "Vault Pass #1234" -> 1234)
    // nft.name already includes fallback to metadata.name from the API route
    const tokenNumberMatch = nft.name.match(/#(\d+)/)
    const tokenNumber = tokenNumberMatch ? parseInt(tokenNumberMatch[1], 10) : 0

    if (!tokenNumber) {
      toast.error(`Could not extract token number from NFT name: "${nft.name}". Expected format: "Name #123"`)
      return
    }

    // Extract gender from attributes, or deterministically assign based on token number (50/50 distribution)
    // Uses hash-like function for more random-looking distribution while staying deterministic
    const genderAttr = nft.metadata.attributes.find((attr) => attr.trait_type?.toLowerCase() === 'gender')
    const gender =
      genderAttr?.value ||
      (() => {
        // Simple hash function using token number - appears random but deterministic
        const hash = (tokenNumber * 2654435761) % 2147483648 >>> 0
        return hash % 2 === 0 ? 'Male' : 'Female'
      })()

    try {
      setIsProcessing(true)

      // Step 1: Generate new art on server
      toast.loading('Generating guild art...', { id: 'reveal-process' })
      const signResponse = await fetch('/api/security/sign-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'generation',
          mint: nft.mintAddress,
          tokenNumber,
          guild: selectedGuild.name,
          gender,
          walletAddress: publicKey.toBase58(),
        }),
      })

      if (!signResponse.ok) {
        const body = await signResponse.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to authorize art generation')
      }

      const generationSignature = (await signResponse.json()) as SignedParamResponse
      const signatureParams = new URLSearchParams({
        token: generationSignature.token,
        signature: generationSignature.signature,
      })

      const imageResponse = await fetch(`/api/generate-image/${tokenNumber}?${signatureParams.toString()}`)
      if (!imageResponse.ok) {
        throw new Error(`Failed to generate image (${imageResponse.status})`)
      }
      const imageBlob = await imageResponse.blob()
      const arrayBuffer = await imageBlob.arrayBuffer()
      const imageBuffer = Buffer.from(arrayBuffer)

      toast.loading('Uploading to Arweave...', { id: 'reveal-process' })

      // Step 2: Initialize Irys and upload to Arweave
      const { WebUploader } = await import('@irys/web-upload')
      const { WebSolana } = await import('@irys/web-upload-solana')

      console.log('Using RPC endpoint:', connection.rpcEndpoint)

      const irysUploader = await WebUploader(WebSolana as unknown as Parameters<typeof WebUploader>[0])
        .withProvider(wallet)
        .withRpc(connection.rpcEndpoint)

      // Check balance and fund if needed
      const balance = await irysUploader.getLoadedBalance()
      if (balance.toNumber() < 2_000_000) {
        // 0.002 SOL threshold
        toast.loading('Funding Irys account with 0.003 SOL...', { id: 'reveal-process' })
        const fundAmount = 3_000_000 // 0.003 SOL
        await irysUploader.fund(fundAmount)
      }

      // Upload image
      const imageReceipt = await irysUploader.upload(imageBuffer, {
        tags: [{ name: 'Content-Type', value: 'image/png' }],
      })
      const imageUri = `https://gateway.irys.xyz/${imageReceipt.id}`
      console.log('✅ Image uploaded:', imageUri)

      const traitsResponse = await fetch(`/api/generate-traits/${tokenNumber}?${signatureParams.toString()}`)
      if (!traitsResponse.ok) {
        throw new Error('Failed to generate metadata traits')
      }
      const traitsJson = (await traitsResponse.json()) as { attributes?: TraitAttribute[] }

      traitsJson!.attributes![0].trait_type = 'Guild'

      const metadataAttributes = traitsJson.attributes ?? []

      // Create and upload metadata JSON
      const metadata = buildVaultMetadata({
        tokenNumber,
        imageUri,
        attributes: metadataAttributes,
        edition: tokenNumber,
      })

      const metadataString = JSON.stringify(metadata)
      const metadataBuffer = Buffer.from(metadataString, 'utf-8')
      const metadataReceipt = await irysUploader.upload(metadataBuffer, {
        tags: [{ name: 'Content-Type', value: 'application/json' }],
      })
      const metadataUri = `https://gateway.irys.xyz/${metadataReceipt.id}`
      console.log('✅ Metadata uploaded:', metadataUri)

      // Step 3: Update onchain metadata
      toast.loading('Updating onchain metadata...', { id: 'reveal-process' })
      const metadataSignResponse = await fetch('/api/security/sign-params', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'update',
          mint: nft.mintAddress,
          metadataUri,
          walletAddress: publicKey.toBase58(),
        }),
      })

      if (!metadataSignResponse.ok) {
        const body = await metadataSignResponse.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to authorize metadata update')
      }

      const metadataSignaturePayload = (await metadataSignResponse.json()) as SignedParamResponse

      const updateResponse = await fetch('/api/nft/update-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: metadataSignaturePayload.token,
          signature: metadataSignaturePayload.signature,
          payload: metadataSignaturePayload.payload,
        }),
      })

      if (!updateResponse.ok) {
        const body = await updateResponse.json().catch(() => ({}))
        throw new Error(body.error ?? 'Metadata update failed')
      }

      const { signature: metadataSignature } = await updateResponse.json()
      console.log('✅ Metadata updated onchain:', metadataSignature)

      toast.success(`Successfully revealed ${nft.name} with ${selectedGuild.name}!`, {
        id: 'reveal-process',
      })

      // Redirect to result page with transaction signature
      router.push(`/reveal/${nftId}/result?guild=${selectedGuild.id}&tx=${metadataSignature}`)
    } catch (error) {
      console.error('Error revealing NFT:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reveal NFT. Please try again.', {
        id: 'reveal-process',
      })
    } finally {
      setIsProcessing(false)
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
            <h2 className="text-2xl font-bold text-white mb-2">Loading NFT Details</h2>
            <p className="text-zinc-400">Fetching your NFT data from the blockchain...</p>
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
    <div className="relative min-h-screen" aria-busy={isProcessing}>
      <div
        className={`py-4 sm:py-6 md:py-12 transition duration-300 ${
          isProcessing ? 'pointer-events-none select-none opacity-40 blur-[1px]' : ''
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <Button variant="ghost" onClick={() => router.push('/guild-selection')} className="mb-2 sm:mb-3 text-xs sm:text-sm -ml-2">
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Back to NFT Collection
              </Button>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 border border-purple-500/20">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-purple-500" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 text-white px-4">Reveal Your NFT</h1>
                <p className="text-sm sm:text-base md:text-xl text-zinc-400 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-4">
                  Choose a guild to reveal your {nft.name} and unlock exclusive benefits and access.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-8 lg:mb-12">
              {/* NFT Preview */}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Your NFT</h2>
                <Card className="bg-zinc-950/50 border-zinc-800">
                  <CardContent className="p-0">
                    <div className="relative">
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        width={400}
                        height={400}
                        className="w-full h-56 sm:h-64 md:h-80 object-cover rounded-t-lg"
                      />

                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-[10px] sm:text-xs">
                          <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                          Unrevealed
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 md:p-6">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 md:mb-4">{nft.name}</h3>
                      <div className="space-y-1.5 sm:space-y-2">
                        <h4 className="text-[11px] sm:text-xs md:text-sm font-semibold text-white">Attributes:</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                          {nft.metadata.attributes.map((attr, index) => (
                            <Badge key={index} variant="secondary" className="text-[9px] sm:text-[10px] md:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
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
                <div className="mb-2 sm:mb-3 md:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Choose Your Guild</h2>
                  <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 mt-1">
                    Scroll to compare all {GUILDS.length} guilds and find the vibe that fits you best.
                  </p>
                </div>
                <div className="relative rounded-xl sm:rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-1 sm:p-1.5 md:p-2">
                  <div
                    ref={guildListRef}
                    className="space-y-1.5 sm:space-y-2 md:space-y-4 max-h-[400px] sm:max-h-[500px] md:max-h-[640px] overflow-y-auto pr-1.5 sm:pr-2 md:pr-3 scroll-smooth vault-scroll-area"
                  >
                    {GUILDS.map((guild) => (
                      <Card
                        key={guild.id}
                        className={`cursor-pointer transition-all bg-zinc-950/50 ${
                          selectedGuild?.id === guild.id
                            ? 'border-purple-500 !bg-purple-500/10 scale-[1.01] sm:scale-[1.02] shadow-[0_0_20px_rgba(147,51,234,0.2)] sm:shadow-[0_0_30px_rgba(147,51,234,0.25)]'
                            : 'border-zinc-800 hover:border-zinc-700 hover:scale-[1.005] sm:hover:scale-[1.01] hover:bg-zinc-900/50'
                        }`}
                        onClick={() => setSelectedGuild(guild)}
                      >
                        <CardContent className="p-2 sm:p-3 md:p-4">
                          <div className={`h-0.5 sm:h-0.5 md:h-1 bg-gradient-to-r ${guild.gradient} rounded-full mb-1.5 sm:mb-2 md:mb-4`} />

                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-2 md:mb-3">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full ${guild.color} flex-shrink-0`} />
                            <h3 className="font-bold text-white text-xs sm:text-sm md:text-base">{guild.name}</h3>
                            {selectedGuild?.id === guild.id && (
                              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-400 ml-auto flex-shrink-0" />
                            )}
                          </div>

                          <p className="text-[10px] sm:text-xs md:text-sm text-zinc-400 leading-relaxed">{guild.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {!isGuildListScrolledToTop && (
                    <div className="pointer-events-none absolute inset-x-1 sm:inset-x-1.5 md:inset-x-2 top-1 sm:top-1.5 md:top-2 h-8 sm:h-12 md:h-16 bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-transparent rounded-t-xl sm:rounded-t-2xl" />
                  )}

                  {!isGuildListScrolledToBottom && (
                    <>
                      <div className="pointer-events-none absolute inset-x-1 sm:inset-x-1.5 md:inset-x-2 bottom-1 sm:bottom-1.5 md:bottom-2 h-8 sm:h-12 md:h-16 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent rounded-b-xl sm:rounded-b-2xl" />
                      <div
                        className="pointer-events-none absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 w-max -translate-x-1/2 rounded-full border border-white/10 bg-zinc-900/90 px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] md:tracking-[0.4em] text-zinc-400 shadow-[0_10px_30px_rgba(10,10,10,0.8)] sm:shadow-[0_20px_45px_rgba(10,10,10,0.8)]"
                        aria-hidden="true"
                      >
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          Scroll
                          <ArrowDown className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reveal Button */}
            <div className="text-center">
              <div className="bg-zinc-950/50 border border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-8 max-w-2xl mx-auto">
                {selectedGuild ? (
                  <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1 sm:mb-2 md:mb-4">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full ${selectedGuild.color} flex-shrink-0`} />
                      <span className="text-sm sm:text-base md:text-lg font-semibold text-white">Ready to join {selectedGuild.name}?</span>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm text-zinc-400 mb-2 sm:mb-4 md:mb-6 px-2">
                      This action will reveal your NFT and permanently assign it to the {selectedGuild.name}. This
                      cannot be undone.
                    </p>
                    <Button
                      onClick={() => setShowConfirmDialog(true)}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-6 sm:px-8 md:px-12 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Reveal & Join Guild
                          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-2 sm:py-4">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-zinc-500 mx-auto mb-2 sm:mb-3 md:mb-4" />
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2">Choose a Guild</h3>
                    <p className="text-xs sm:text-sm md:text-base text-zinc-400 px-4">
                      Select a guild above to reveal your NFT and unlock exclusive benefits.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px] w-[calc(100%-1rem)] max-h-[90vh] sm:max-h-[85vh] flex flex-col p-4 sm:p-6">
            <DialogHeader className="space-y-1.5 sm:space-y-2 flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto border border-orange-500/20">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <DialogTitle className="text-center text-base sm:text-lg md:text-xl">Confirm Guild Assignment</DialogTitle>
              <DialogDescription className="text-center text-zinc-400 text-[11px] sm:text-xs md:text-sm">
                This is a permanent action that cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 sm:space-y-3 py-2 sm:py-3 overflow-y-auto flex-1 min-h-0 -mx-4 px-4 sm:-mx-6 sm:px-6">
              {selectedGuild && (
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${selectedGuild.color} flex-shrink-0`} />
                    <h4 className="font-semibold text-white text-sm sm:text-base">{selectedGuild.name}</h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2 sm:line-clamp-none">{selectedGuild.description}</p>
                </div>
              )}

              <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-[11px] md:text-xs text-zinc-400">
                <p className="flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>NFT revealed with custom guild artwork</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Metadata uploaded to Arweave</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 text-green-500 flex-shrink-0" />
                  <span>Guild selection recorded</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 text-orange-500 flex-shrink-0" />
                  <span>Transaction approval required</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5 mt-0.5 text-orange-500 flex-shrink-0" />
                  <span>Fees: ~0.003 SOL + ~0.00005 SOL</span>
                </p>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-zinc-800">
                  <div className="flex justify-between text-[10px] sm:text-[11px] md:text-xs">
                    <span className="text-zinc-400">Estimated Total:</span>
                    <span className="font-semibold text-white">~0.00305 SOL</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-800/50 flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isProcessing}
                className="w-full sm:w-auto border-zinc-700 text-xs sm:text-sm h-10 sm:h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmDialog(false)
                  handleReveal()
                }}
                disabled={isProcessing}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-xs sm:text-sm h-10 sm:h-10 font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Reveal
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isProcessing && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-4 sm:px-6 text-center text-white backdrop-blur-sm"
          role="status"
          aria-live="assertive"
        >
          <div className="mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl sm:rounded-2xl border border-purple-500/30 bg-purple-500/10">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-semibold mb-2">Revealing your NFT</p>
          <p className="max-w-md text-xs sm:text-sm text-zinc-300 px-4">
            Hang tight while we generate your guild art, upload to Arweave, and finalize the onchain metadata update.
          </p>
        </div>
      )}
    </div>
  )
}
