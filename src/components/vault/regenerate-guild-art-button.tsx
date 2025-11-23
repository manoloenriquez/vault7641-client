"use client"

import { useCallback, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
// Removed direct Irys imports - using API route instead
import { Button } from '@/components/ui/button'

type Props = {
  nftMint: string
  tokenId: number
  guildName?: string | null
  gender?: string | null
}

async function fetchPngAsUint8Array(url: string): Promise<Uint8Array> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch PNG (${res.status})`)
  }
  const arrayBuffer = await res.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

export function RegenerateGuildArtButton({ nftMint, tokenId, guildName, gender }: Props) {
  const wallet = useWallet()
  const { connection } = useConnection()
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleRegenerate = useCallback(async () => {
    try {
      // Validate wallet connection and public key
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Please connect your wallet first')
      }

      setIsProcessing(true)
      setStatus('Generating image on server...')

      const resolvedGuild = guildName ?? 'Builder Guild'
      const resolvedGender = gender ?? 'Male'
      const generationSeed = Date.now()

      const params = new URLSearchParams()
      params.set('guild', resolvedGuild)
      params.set('gender', resolvedGender)
      params.set('seed', generationSeed.toString())

      const pngBytes = await fetchPngAsUint8Array(`/api/generate-image/${tokenId}?${params.toString()}`)

      setStatus('Initializing Irys Web Uploader...')

      // Use Irys Web Upload SDK (browser-compatible)
      // Reference: https://docs.irys.xyz/build/d/irys-in-the-browser
      const { WebUploader } = await import('@irys/web-upload')
      const { WebSolana } = await import('@irys/web-upload-solana')

      // Debug: Log wallet structure to understand what Irys receives
      console.log('Wallet object:', {
        connected: wallet.connected,
        publicKey: wallet.publicKey?.toBase58(),
        hasSignTransaction: !!wallet.signTransaction,
        hasSignAllTransactions: !!wallet.signAllTransactions,
        walletKeys: Object.keys(wallet),
      })

      // Validate required wallet methods
      if (!wallet.signTransaction || !wallet.signAllTransactions) {
        throw new Error('Wallet does not support transaction signing. Please ensure your wallet is properly connected.')
      }

      setStatus('Connecting to Irys...')

      console.log('Using RPC endpoint:', connection.rpcEndpoint)

      // Initialize Irys Web Uploader with Solana wallet and explicit RPC endpoint
      // Pass the entire wallet object from useWallet() as per Irys docs
      const irysUploader = await WebUploader(WebSolana)
        .withProvider(wallet)
        .withRpc(connection.rpcEndpoint)

      setStatus('Uploading image & metadata to Arweave...')

      // Upload image (convert Uint8Array to Buffer)
      const imageBuffer = Buffer.from(pngBytes)
      const imageReceipt = await irysUploader.upload(imageBuffer, {
        tags: [{ name: 'Content-Type', value: 'image/png' }],
      })
      
      const imageUri = `https://gateway.irys.xyz/${imageReceipt.id}`

      // Create and upload metadata JSON
      const metadata = {
        name: `Vault Guild NFT #${tokenId}`,
        symbol: 'V7641',
        description: 'Guild art generated on the server and refreshed via Vault 7641.',
        image: imageUri,
        attributes: [
          { trait_type: 'Token ID', value: tokenId.toString() },
          { trait_type: 'Guild', value: resolvedGuild },
          { trait_type: 'Gender', value: resolvedGender },
          { trait_type: 'Regeneration Seed', value: generationSeed.toString() },
        ],
        properties: {
          files: [{ uri: imageUri, type: 'image/png' }],
          category: 'image',
          creators: [
            {
              address: wallet.publicKey.toBase58(),
              share: 100,
            },
          ],
        },
      }

      const metadataString = JSON.stringify(metadata)
      const metadataBuffer = Buffer.from(metadataString, 'utf-8')
      const metadataReceipt = await irysUploader.upload(metadataBuffer, {
        tags: [{ name: 'Content-Type', value: 'application/json' }],
      })
      
      const metadataUri = `https://gateway.irys.xyz/${metadataReceipt.id}`

      setStatus('Requesting admin metadata update...')

      const res = await fetch('/api/nft/update-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mint: nftMint,
          metadataUri,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Metadata update failed')
      }

      const { signature } = await res.json()
      
      // Log regeneration event (non-blocking)
      fetch('/api/nft/regenerate-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          nftMint,
          guild: resolvedGuild,
          gender: resolvedGender,
          seed: generationSeed,
          metadataUri,
          imageUri,
          transactionSignature: signature,
          walletAddress: wallet.publicKey.toBase58(),
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.warn('Failed to log regeneration event:', err)
        // Non-critical, don't throw
      })
      
      setStatus(`Success! Tx: ${signature}`)
    } catch (error) {
      console.error('Regenerate art failed:', error)
      setStatus(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }, [wallet, connection, nftMint, tokenId, guildName, gender])

  return (
    <div className="space-y-1">
      <Button
        size="sm"
        variant="outline"
        onClick={(event) => {
          event.stopPropagation()
          handleRegenerate()
        }}
        disabled={isProcessing}
        className="w-full border-purple-500/40 text-purple-200 hover:bg-purple-500/10"
      >
        {isProcessing ? 'Processing...' : 'Regenerate art'}
      </Button>
      {status && <p className="text-xs text-zinc-400">{status}</p>}
    </div>
  )
}
