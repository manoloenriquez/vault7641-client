"use client"

import { useCallback, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createGenericFile } from '@metaplex-foundation/umi'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { UMI_CONFIG } from '@/lib/solana/connection-config'
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
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Connect your wallet to continue')
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

      setStatus('Uploading image & metadata to Arweave...')

      // Initialize Umi with wallet adapter identity
      const umi = createUmi(connection.rpcEndpoint, UMI_CONFIG)
      umi.use(walletAdapterIdentity(wallet))

      // Upload image to Arweave
      const fileName = `vault-guild-${tokenId}.png`
      const imageFile = createGenericFile(pngBytes, fileName, {
        tags: [{ name: 'Content-Type', value: 'image/png' }],
      })
      const [imageUri] = await umi.uploader.upload([imageFile])

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

      const metadataUri = await umi.uploader.uploadJson(metadata)

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
