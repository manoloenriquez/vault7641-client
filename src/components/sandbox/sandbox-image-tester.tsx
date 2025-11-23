'use client'
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createGenericFile } from '@metaplex-foundation/umi'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { UMI_CONFIG } from '@/lib/solana/connection-config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const GUILD_OPTIONS = ['Builder Guild', 'Farmer Guild', 'Gamer Guild', 'Pathfinder Guild', 'Trader Guild'] as const
const GENDER_OPTIONS = ['Male', 'Female'] as const

async function fetchPngAsUint8Array(url: string): Promise<Uint8Array> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch image (${res.status})`)
  }
  const buffer = await res.arrayBuffer()
  return new Uint8Array(buffer)
}

export function SandboxImageTester() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const [tokenIdInput, setTokenIdInput] = useState('1')
  const [selectedGuild, setSelectedGuild] = useState<(typeof GUILD_OPTIONS)[number]>('Builder Guild')
  const [selectedGender, setSelectedGender] = useState<(typeof GENDER_OPTIONS)[number]>('Male')
  const [seedInput, setSeedInput] = useState('')
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ imageUri: string; metadataUri: string } | null>(null)

  const updatePreview = useCallback((bytes: Uint8Array) => {
    const blob = new Blob([bytes], { type: 'image/png' })
    const url = URL.createObjectURL(blob)
    setPreviewSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
  }, [])

  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc)
      }
    }
  }, [previewSrc])

  const parseTokenIdInput = useCallback(() => {
    const numeric = Number(tokenIdInput)
    if (!Number.isFinite(numeric) || numeric < 0) {
      throw new Error('Enter a valid numeric token ID')
    }
    return numeric
  }, [tokenIdInput])

  const parseSeedInput = useCallback(() => {
    if (!seedInput) {
      return undefined
    }
    const numeric = Number(seedInput)
    if (!Number.isFinite(numeric)) {
      throw new Error('Seed must be a numeric value')
    }
    return numeric
  }, [seedInput])

  const buildImageUrl = useCallback(
    (tokenId: number, seedOverride?: number) => {
      const params = new URLSearchParams()
      params.set('guild', selectedGuild)
      params.set('gender', selectedGender)
      if (seedOverride) {
        params.set('seed', seedOverride.toString())
      }
      return `/api/generate-image/${tokenId}?${params.toString()}`
    },
    [selectedGender, selectedGuild],
  )

  const handleGenerateImage = useCallback(async () => {
    try {
      setUploadResult(null)
      setIsGenerating(true)
      setStatus('Requesting PNG from /api/generate-image ...')
      const tokenId = parseTokenIdInput()
      const seedOverride = parseSeedInput()
      const pngBytes = await fetchPngAsUint8Array(buildImageUrl(tokenId, seedOverride))
      updatePreview(pngBytes)
      setStatus('Image generated successfully')
    } catch (error) {
      console.error('Sandbox generate failed:', error)
      setStatus(error instanceof Error ? error.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }, [buildImageUrl, parseSeedInput, parseTokenIdInput, updatePreview])

  const handleGenerateAndUpload = useCallback(async () => {
    try {
      if (!wallet.connected || !wallet.publicKey) {
        throw new Error('Connect your wallet to upload via Bundlr')
      }

      setIsUploading(true)
      setStatus('Generating image before upload...')
      const tokenId = parseTokenIdInput()
      const overrideSeed = parseSeedInput() ?? Date.now()
      const pngBytes = await fetchPngAsUint8Array(buildImageUrl(tokenId, overrideSeed))
      updatePreview(pngBytes)

      setStatus('Uploading image to Arweave...')
      // Initialize Umi with wallet adapter identity
      const umi = createUmi(connection.rpcEndpoint, UMI_CONFIG)
      umi.use(walletAdapterIdentity(wallet))

      const fileName = `sandbox-token-${tokenId}-${Date.now()}.png`
      const imageFile = createGenericFile(pngBytes, fileName, {
        tags: [{ name: 'Content-Type', value: 'image/png' }],
      })
      const [imageUri] = await umi.uploader.upload([imageFile])

      setStatus('Uploading metadata JSON...')
      const metadata = {
        name: `Sandbox NFT #${tokenId}`,
        symbol: 'SANDBOX',
        description: 'Test metadata uploaded from the sandbox page.',
        image: imageUri,
        attributes: [
          { trait_type: 'Token ID', value: tokenId.toString() },
          { trait_type: 'Guild', value: selectedGuild },
          { trait_type: 'Gender', value: selectedGender },
          { trait_type: 'Regeneration Seed', value: overrideSeed.toString() },
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
      setUploadResult({ imageUri, metadataUri })
      setStatus('Image + metadata uploaded successfully')
    } catch (error) {
      console.error('Sandbox upload failed:', error)
      setStatus(error instanceof Error ? error.message : 'Failed to upload to Arweave')
    } finally {
      setIsUploading(false)
    }
  }, [
    buildImageUrl,
    connection,
    parseSeedInput,
    parseTokenIdInput,
    selectedGender,
    selectedGuild,
    updatePreview,
    wallet,
  ])

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <Card className="border-zinc-800 bg-zinc-950/70">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Image Generation Sandbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-white">
          <p className="text-sm text-zinc-400">
            Use this page to call the server-side Sharp compositor and optionally push the resulting PNG + metadata to
            Arweave/Bundlr using your connected wallet.
          </p>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300" htmlFor="token-id">
              Token ID
            </label>
            <Input
              id="token-id"
              type="number"
              min={0}
              value={tokenIdInput}
              onChange={(event) => setTokenIdInput(event.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="guild">
                Guild
              </label>
              <select
                id="guild"
                value={selectedGuild}
                onChange={(event) => setSelectedGuild(event.target.value as (typeof GUILD_OPTIONS)[number])}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              >
                {GUILD_OPTIONS.map((guild) => (
                  <option key={guild} value={guild}>
                    {guild}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                value={selectedGender}
                onChange={(event) => setSelectedGender(event.target.value as (typeof GENDER_OPTIONS)[number])}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
              >
                {GENDER_OPTIONS.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="seed">
                Seed (optional)
              </label>
              <Input
                id="seed"
                type="number"
                value={seedInput}
                onChange={(event) => setSeedInput(event.target.value)}
                placeholder="Random if empty"
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleGenerateImage} disabled={isGenerating || isUploading} className="flex-1">
              {isGenerating ? 'Generating...' : 'Generate Image'}
            </Button>
            <Button
              onClick={handleGenerateAndUpload}
              disabled={isUploading}
              className="flex-1 bg-purple-600 hover:bg-purple-500"
            >
              {isUploading ? 'Uploading...' : 'Generate & Upload to Arweave'}
            </Button>
          </div>

          {previewSrc && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">Latest PNG preview</p>
              <div className="rounded-lg border border-zinc-800 bg-black/40 p-4">
                <img src={previewSrc} alt="Generated NFT preview" className="mx-auto max-h-[400px]" />
              </div>
            </div>
          )}

          {uploadResult && (
            <div className="space-y-2 rounded-lg border border-green-900/50 bg-green-500/5 p-4 text-sm">
              <p className="font-medium text-green-300">Upload results</p>
              <div className="space-y-1">
                <p className="text-zinc-300">
                  Image URI:{' '}
                  <a
                    href={uploadResult.imageUri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline"
                  >
                    {uploadResult.imageUri}
                  </a>
                </p>
                <p className="text-zinc-300">
                  Metadata URI:{' '}
                  <a
                    href={uploadResult.metadataUri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 underline"
                  >
                    {uploadResult.metadataUri}
                  </a>
                </p>
              </div>
            </div>
          )}

          {status && <p className="text-sm text-zinc-400">Status: {status}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

