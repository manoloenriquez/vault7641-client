'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'

export type GuildType = 'builder' | 'trader' | 'farmer' | 'gamer' | 'pathfinder'

export function useGuildSelection() {
  const wallet = useWallet()
  const { publicKey } = wallet
  const [isSelecting, setIsSelecting] = useState(false)

  const selectGuild = async (nftMint: string, guildId: GuildType, tokenNumber: number) => {
    if (!publicKey || !wallet.wallet) {
      toast.error('Please connect your wallet first')
      return { success: false, error: 'Wallet not connected' }
    }

    if (!tokenNumber) {
      toast.error('Token number is required')
      return { success: false, error: 'Token number missing' }
    }

    setIsSelecting(true)

    try {
      // Call server-side API to update NFT metadata
      // Server has the update authority and will perform the on-chain update
      toast.loading('Assigning guild to NFT...', { id: 'guild-selection' })

      const response = await fetch('/api/guild/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nftMint,
          tokenNumber,
          guildId,
          walletAddress: publicKey.toBase58(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign guild')
      }

      const data = await response.json()

      toast.success(`Successfully joined ${guildId} guild!`, { id: 'guild-selection' })

      return {
        success: true,
        data: data.data,
        transactionSignature: data.data.transactionSignature,
      }
    } catch (error) {
      console.error('Guild selection error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to select guild'
      toast.error(errorMessage, { id: 'guild-selection' })

      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsSelecting(false)
    }
  }

  return {
    selectGuild,
    isSelecting,
    isConnected: !!publicKey,
    walletAddress: publicKey?.toBase58(),
  }
}
