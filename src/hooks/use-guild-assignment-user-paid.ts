'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { toast } from 'sonner'
import { USE_MOCK_TRANSACTIONS } from '@/lib/constants'
import { type GuildType } from '@/lib/guild-constants'

interface UseGuildAssignmentUserPaidReturn {
  assignGuild: (nftMint: string, tokenNumber: number, guildId: GuildType) => Promise<string | null>
  isAssigning: boolean
}

/**
 * Hook for guild assignment where USER pays the transaction fee
 *
 * Flow:
 * 1. Client calls API to prepare transaction
 * 2. Server creates transaction with update authority signature
 * 3. Client receives partially-signed transaction
 * 4. User signs and sends transaction (paying the fee)
 *
 * @returns {UseGuildAssignmentUserPaidReturn} Guild assignment functions
 */
export function useGuildAssignmentUserPaid(): UseGuildAssignmentUserPaidReturn {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [isAssigning, setIsAssigning] = useState(false)

  const assignGuild = async (nftMint: string, tokenNumber: number, guildId: GuildType): Promise<string | null> => {
    // Validation
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet first')
      return null
    }

    if (!nftMint || typeof nftMint !== 'string') {
      toast.error('Invalid NFT mint address')
      return null
    }

    if (!tokenNumber || tokenNumber < 1) {
      toast.error('Invalid token number')
      return null
    }

    if (!guildId) {
      toast.error('Please select a guild')
      return null
    }

    // 🎨 MOCK MODE - Block transaction requests
    if (USE_MOCK_TRANSACTIONS) {
      toast.warning('Mock mode is enabled. Transactions are disabled.', { duration: 3000 })
      console.log('🎨 [Mock Mode] Transaction blocked:', { nftMint, tokenNumber, guildId })
      return null
    }

    setIsAssigning(true)

    try {
      console.log('🔨 [Client] Requesting transaction preparation...')

      // Step 1: Request server to prepare the transaction
      const response = await fetch('/api/guild/prepare-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nftMint,
          tokenNumber,
          guildId,
          walletAddress: publicKey.toBase58(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to prepare transaction')
      }

      const data = await response.json()
      console.log('✅ [Client] Transaction prepared:', data.details)

      // Step 2: Deserialize the partially-signed transaction
      const transactionBuffer = Buffer.from(data.transaction, 'base64')
      const transaction = Transaction.from(transactionBuffer)

      console.log('📝 [Client] Transaction received, requesting user signature...')
      toast.info('Please sign the transaction in your wallet')

      // Step 3: User signs the transaction
      const signedTransaction = await signTransaction(transaction)

      console.log('✅ [Client] Transaction signed by user, sending...')
      toast.loading('Sending transaction...', { id: 'guild-assign' })

      // Step 4: Send the fully-signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })

      console.log('📡 [Client] Transaction sent:', signature)
      toast.loading('Confirming transaction...', { id: 'guild-assign' })

      // Step 5: Confirm the transaction
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash: data.details.blockhash,
          lastValidBlockHeight: data.details.lastValidBlockHeight,
        },
        'confirmed',
      )

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }

      console.log('✅ [Client] Transaction confirmed!')
      toast.success('Guild assigned successfully!', { id: 'guild-assign' })

      return signature
    } catch (error) {
      console.error('❌ [Client] Error assigning guild:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Failed to assign guild: ${errorMessage}`, { id: 'guild-assign' })
      return null
    } finally {
      setIsAssigning(false)
    }
  }

  return {
    assignGuild,
    isAssigning,
  }
}
