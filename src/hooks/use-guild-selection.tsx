'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'sonner'
import { useGuildAssignmentUserPaid } from './use-guild-assignment-user-paid'
import { type GuildType } from '@/lib/guild-constants'

export function useGuildSelection() {
  const wallet = useWallet()
  const { publicKey } = wallet
  const { assignGuild, isAssigning } = useGuildAssignmentUserPaid()

  const selectGuild = async (nftMint: string, guildId: GuildType, tokenNumber: number) => {
    if (!publicKey || !wallet.wallet) {
      toast.error('Please connect your wallet first')
      return { success: false, error: 'Wallet not connected' }
    }

    if (!tokenNumber) {
      toast.error('Token number is required')
      return { success: false, error: 'Token number missing' }
    }

    try {
      // Use the new user-paid transaction system
      // User's wallet will be prompted to sign and pay for the transaction
      toast.loading('Assigning guild to NFT...', { id: 'guild-selection' })

      const transactionSignature = await assignGuild(nftMint, tokenNumber, guildId)

      if (!transactionSignature) {
        // User cancelled or error occurred (already handled by hook)
        toast.dismiss('guild-selection')
        return { success: false, error: 'Transaction cancelled or failed' }
      }

      toast.success(`Successfully joined ${guildId} guild!`, { id: 'guild-selection' })

      return {
        success: true,
        data: { transactionSignature },
        transactionSignature,
      }
    } catch (error) {
      console.error('Guild selection error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to select guild'
      toast.error(errorMessage, { id: 'guild-selection' })

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  return {
    selectGuild,
    isSelecting: isAssigning,
    isConnected: !!publicKey,
    walletAddress: publicKey?.toBase58(),
  }
}
