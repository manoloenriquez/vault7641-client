'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
// Removed direct Irys imports - using API route instead
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, RefreshCcw, Upload, ExternalLink, Wallet } from 'lucide-react'
import { buildVaultMetadata } from '@/lib/vaultMetadata'
import { TraitAttribute } from '@/types/traits'

const GUILDS = ['Builder Guild', 'Farmer Guild', 'Gamer Guild', 'Pathfinder Guild', 'Trader Guild']
const GENDERS = ['Male', 'Female']

type GeneratedMetadata = ReturnType<typeof buildVaultMetadata>

export default function SandboxPage() {
  const wallet = useWallet()
  const { connection } = useConnection()

  const [tokenId, setTokenId] = useState('1')
  const [guild, setGuild] = useState('Builder Guild')
  const [gender, setGender] = useState('Male')
  const [seed, setSeed] = useState(Date.now().toString())
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [metadata, setMetadata] = useState<GeneratedMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Arweave upload state
  const [isUploading, setIsUploading] = useState(false)
  const [arweaveImageUri, setArweaveImageUri] = useState<string | null>(null)
  const [arweaveMetadataUri, setArweaveMetadataUri] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [irysBalance, setIrysBalance] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setImageUrl(null)
    setImageBlob(null)
    setMetadata(null)
    setArweaveImageUri(null)
    setArweaveMetadataUri(null)
    setUploadStatus(null)

    try {
      // Generate the image
      const params = new URLSearchParams({
        guild,
        gender,
        seed,
      })

      const queryString = params.toString()
      const response = await fetch(`/api/generate-image/${tokenId}?${queryString}`)

      if (!response.ok) {
        throw new Error(`Failed to generate image: ${response.statusText}`)
      }

      // Get the image as blob and create URL
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setImageUrl(url)
      setImageBlob(blob)

      const traitsResponse = await fetch(`/api/generate-traits/${tokenId}?${queryString}`)
      if (!traitsResponse.ok) {
        throw new Error('Failed to generate metadata traits')
      }
      const traitsJson = (await traitsResponse.json()) as { attributes?: TraitAttribute[] }

      traitsJson!.attributes![0].trait_type = 'Guild'

      const metadataAttributes = traitsJson.attributes ?? []

      const tokenNumber = parseInt(tokenId, 10)
      const generatedMetadata = buildVaultMetadata({
        tokenNumber,
        imageUri: url,
        attributes: metadataAttributes,
        edition: tokenNumber,
      }) as GeneratedMetadata

      setMetadata(generatedMetadata)
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate NFT image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRandomize = () => {
    setGuild(GUILDS[Math.floor(Math.random() * GUILDS.length)])
    setGender(GENDERS[Math.floor(Math.random() * GENDERS.length)])
    setSeed(Date.now().toString())
  }

  const handleCheckIrysBalance = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your wallet first')
      return
    }

    try {
      const { WebUploader } = await import('@irys/web-upload')
      const { WebSolana } = await import('@irys/web-upload-solana')

      // Type assertion needed due to transitive dependency version mismatch
      const irysUploader = await WebUploader(WebSolana as unknown as Parameters<typeof WebUploader>[0])
        .withProvider(wallet)
        .withRpc(connection.rpcEndpoint)

      // Get balance in atomic units
      const balance = await irysUploader.getLoadedBalance()

      // Convert to SOL (1 SOL = 1,000,000,000 lamports)
      const balanceInSol = Number(balance) / 1_000_000_000

      setIrysBalance(`${balanceInSol.toFixed(6)} SOL`)
      console.log('Irys Balance:', balanceInSol, 'SOL')
    } catch (err) {
      console.error('Error checking Irys balance:', err)
      setError(err instanceof Error ? err.message : 'Failed to check Irys balance')
    }
  }

  const handleFundIrys = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your wallet first')
      return
    }

    try {
      const { WebUploader } = await import('@irys/web-upload')
      const { WebSolana } = await import('@irys/web-upload-solana')

      setUploadStatus('Connecting to Irys...')
      setUploadStatus('Connecting to Irys...')
      // Type assertion needed due to transitive dependency version mismatch
      const irysUploader = await WebUploader(WebSolana as unknown as Parameters<typeof WebUploader>[0])
        .withProvider(wallet)
        .withRpc(connection.rpcEndpoint)
      // Fund with 0.003 SOL (3,000,000 lamports) - enough for ~3-5 uploads
      const fundAmount = 3_000_000 // 0.003 SOL in lamports

      setUploadStatus('Funding Irys account with 0.003 SOL...')
      const fundTx = await irysUploader.fund(fundAmount)

      console.log('Funded Irys account:', fundTx)
      setUploadStatus(`✅ Successfully funded Irys with 0.003 SOL`)

      // Check new balance
      await handleCheckIrysBalance()
    } catch (err) {
      console.error('Error funding Irys:', err)
      setError(err instanceof Error ? err.message : 'Failed to fund Irys')
      setUploadStatus(null)
    }
  }

  const handleWithdrawIrys = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your wallet first')
      return
    }

    try {
      const { WebUploader } = await import('@irys/web-upload')
      const { WebSolana } = await import('@irys/web-upload-solana')

      setUploadStatus('Connecting to Irys...')
      setUploadStatus('Connecting to Irys...')
      // Type assertion needed due to transitive dependency version mismatch
      const irysUploader = await WebUploader(WebSolana as unknown as Parameters<typeof WebUploader>[0])
        .withProvider(wallet)
        .withRpc(connection.rpcEndpoint)
      // Check current balance first
      const balance = await irysUploader.getLoadedBalance()
      const balanceNum = Number(balance)

      if (balanceNum === 0) {
        setError('No balance to withdraw from Irys')
        setUploadStatus(null)
        return
      }

      // Leave 1,000,000 lamports (0.001 SOL) for gas fees
      const gasBuffer = 1_000_000 // 0.001 SOL

      if (balanceNum <= gasBuffer) {
        setError('Balance too low to withdraw (need to leave gas for withdrawal transaction)')
        setUploadStatus(null)
        return
      }

      const withdrawAmount = balanceNum - gasBuffer
      const withdrawInSol = withdrawAmount / 1_000_000_000

      setUploadStatus(`Withdrawing ${withdrawInSol.toFixed(6)} SOL from Irys (leaving 0.001 SOL for gas)...`)

      // Withdraw balance minus gas buffer
      const withdrawTx = await irysUploader.withdrawBalance(withdrawAmount)

      console.log('Withdrew from Irys:', withdrawTx)
      setUploadStatus(`✅ Successfully withdrew ${withdrawInSol.toFixed(6)} SOL from Irys`)

      // Update balance display (showing remaining gas buffer)
      setIrysBalance('~0.001000 SOL')

      // Check new balance to confirm
      setTimeout(() => handleCheckIrysBalance(), 2000)
    } catch (err) {
      console.error('Error withdrawing from Irys:', err)
      setError(err instanceof Error ? err.message : 'Failed to withdraw from Irys')
      setUploadStatus(null)
    }
  }

  const handleUploadToArweave = async () => {
    // Validate wallet connection and public key
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your wallet first')
      return
    }

    // Validate required wallet methods for Irys
    if (!wallet.signTransaction || !wallet.signAllTransactions) {
      setError('Wallet does not support transaction signing. Please ensure your wallet is properly connected.')
      return
    }

    if (!imageBlob || !metadata) {
      setError('Please generate an image first before uploading')
      return
    }

    setIsUploading(true)
    setError(null)
    setUploadStatus('Initializing Irys Web Uploader...')

    try {
      // Use Irys Web Upload SDK (browser-compatible)
      // Reference: https://docs.irys.xyz/build/d/irys-in-the-browser
      const { WebUploader } = await import('@irys/web-upload')
      const { WebSolana } = await import('@irys/web-upload-solana')

      setUploadStatus('Connecting to Irys...')

      console.log('Using RPC endpoint:', connection.rpcEndpoint)

      // Initialize Irys Web Uploader with Solana wallet and explicit RPC endpoint
      // Pass the entire wallet object from useWallet() as per Irys docs
      // Initialize Irys Web Uploader with Solana wallet and explicit RPC endpoint
      // Pass the entire wallet object from useWallet() as per Irys docs
      // Type assertion needed due to transitive dependency version mismatch
      const irysUploader = await WebUploader(WebSolana as unknown as Parameters<typeof WebUploader>[0])
        .withProvider(wallet)
        .withRpc(connection.rpcEndpoint)
      setUploadStatus('Checking Irys balance...')
      const balance = await irysUploader.getLoadedBalance()
      const balanceNum = Number(balance)
      const balanceInSol = balanceNum / 1_000_000_000
      setIrysBalance(`${balanceInSol.toFixed(6)} SOL`)

      console.log('Current Irys balance:', balanceInSol, 'SOL')

      // If balance is very low (less than 0.002 SOL), fund automatically
      if (balanceNum < 2_000_000) {
        // 0.002 SOL in lamports
        setUploadStatus('Insufficient balance. Funding Irys with 0.003 SOL...')
        const fundAmount = 3_000_000 // 0.003 SOL
        await irysUploader.fund(fundAmount)

        // Update balance display
        const newBalance = await irysUploader.getLoadedBalance()
        const newBalanceInSol = Number(newBalance) / 1_000_000_000
        setIrysBalance(`${newBalanceInSol.toFixed(6)} SOL`)

        console.log('Funded Irys account. New balance:', newBalanceInSol, 'SOL')
        setUploadStatus('Irys funded successfully. Proceeding with upload...')
      }

      setUploadStatus('Converting image to Buffer...')

      // Convert blob to Buffer (Irys requires Buffer, not Uint8Array)
      const arrayBuffer = await imageBlob.arrayBuffer()
      const imageBuffer = Buffer.from(arrayBuffer)

      setUploadStatus('Uploading image to Arweave...')

      // Upload image
      const imageReceipt = await irysUploader.upload(imageBuffer, {
        tags: [{ name: 'Content-Type', value: 'image/png' }],
      })

      const imageUri = `https://gateway.irys.xyz/${imageReceipt.id}`

      setArweaveImageUri(imageUri)
      console.log('✅ Image uploaded to Arweave:', imageUri)

      setUploadStatus('Creating metadata JSON...')

      // Create metadata JSON
      const metadataJson = buildVaultMetadata({
        tokenNumber: metadata.edition,
        imageUri,
        attributes: metadata.attributes,
        edition: metadata.edition,
      })

      setUploadStatus('Uploading metadata to Arweave...')

      // Upload metadata (convert to Buffer)
      const metadataString = JSON.stringify(metadataJson)
      const metadataBuffer = Buffer.from(metadataString, 'utf-8')
      const metadataReceipt = await irysUploader.upload(metadataBuffer, {
        tags: [{ name: 'Content-Type', value: 'application/json' }],
      })

      const metadataUri = `https://gateway.irys.xyz/${metadataReceipt.id}`

      setArweaveMetadataUri(metadataUri)
      setMetadata(metadataJson)
      console.log('✅ Metadata uploaded to Arweave:', metadataUri)

      setUploadStatus('✅ Upload complete!')
    } catch (err) {
      console.error('Arweave upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload to Arweave')
      setUploadStatus(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">NFT Generation Sandbox</h1>
              <p className="text-zinc-400">Test and preview NFT image generation with metadata</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300">
              <Wallet className="w-3 h-3 mr-1" />
              {wallet.connected
                ? `${wallet.publicKey?.toBase58().slice(0, 4)}...${wallet.publicKey?.toBase58().slice(-4)}`
                : 'Not connected'}
            </Badge>
            <WalletMultiButton />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          <Card className="bg-zinc-950/70 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Generation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Token ID */}
              <div className="space-y-2">
                <Label htmlFor="tokenId" className="text-zinc-300">
                  Token ID
                </Label>
                <input
                  id="tokenId"
                  type="number"
                  min="0"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Guild Selection */}
              <div className="space-y-2">
                <Label htmlFor="guild" className="text-zinc-300">
                  Guild
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {GUILDS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuild(g)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        guild === g ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {g.replace(' Guild', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-zinc-300">
                  Gender
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        gender === g ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seed */}
              <div className="space-y-2">
                <Label htmlFor="seed" className="text-zinc-300">
                  Generation Seed
                </Label>
                <input
                  id="seed"
                  type="text"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-purple-600 hover:bg-purple-500"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleRandomize}
                    disabled={isGenerating}
                    variant="outline"
                    className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Randomize
                  </Button>
                </div>

                {/* Irys Balance Management */}
                {wallet.connected && (
                  <div className="space-y-2 p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Irys Balance:</span>
                      <span className="text-sm text-white font-mono">{irysBalance || 'Not checked'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={handleCheckIrysBalance}
                        disabled={isUploading}
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 text-xs"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={handleFundIrys}
                        disabled={isUploading}
                        size="sm"
                        variant="outline"
                        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs"
                      >
                        Fund 0.003
                      </Button>
                      <Button
                        onClick={handleWithdrawIrys}
                        disabled={isUploading}
                        size="sm"
                        variant="outline"
                        className="border-green-500/30 text-green-300 hover:bg-green-500/10 text-xs"
                      >
                        Withdraw
                      </Button>
                    </div>
                  </div>
                )}

                {/* Arweave Upload Button */}
                <Button
                  onClick={handleUploadToArweave}
                  disabled={!imageBlob || !metadata || isUploading || !wallet.connected}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-500"
                  variant={wallet.connected ? 'default' : 'outline'}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading to Arweave...
                    </>
                  ) : !wallet.connected ? (
                    <>
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet to Upload
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload to Arweave
                    </>
                  )}
                </Button>

                {/* Upload Status */}
                {uploadStatus && <div className="text-xs text-center text-zinc-400 animate-pulse">{uploadStatus}</div>}
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata Display */}
          {metadata && (
            <Card className="bg-zinc-950/70 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Generated Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Name</span>
                      <span className="text-white font-medium">{metadata.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Symbol</span>
                      <Badge variant="secondary" className="bg-zinc-900 text-zinc-200">
                        {metadata.symbol}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Edition</span>
                      <span className="text-white font-medium">#{metadata.edition}</span>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300 mb-3">Attributes</h4>
                    <div className="space-y-2">
                      {metadata.attributes.map((attr, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg">
                          <span className="text-xs text-zinc-400 uppercase tracking-wider">{attr.trait_type}</span>
                          <span className="text-sm text-white font-medium">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* JSON Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-zinc-300">JSON Preview</h4>
                    <pre className="p-3 bg-zinc-900 rounded-lg text-xs text-zinc-300 overflow-x-auto border border-zinc-800">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arweave Upload Results */}
          {(arweaveImageUri || arweaveMetadataUri) && (
            <Card className="bg-gradient-to-br from-green-950/50 to-emerald-950/30 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-400" />
                  Arweave Upload Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {arweaveImageUri && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-green-300">Image URI</h4>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-green-500/20">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs text-green-200 break-all flex-1">{arweaveImageUri}</code>
                          <a
                            href={arweaveImageUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(arweaveImageUri)
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-green-500/30 text-green-300 hover:bg-green-500/10"
                      >
                        Copy Image URI
                      </Button>
                    </div>
                  )}

                  {arweaveMetadataUri && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-green-300">Metadata URI</h4>
                      <div className="p-3 bg-zinc-900/50 rounded-lg border border-green-500/20">
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs text-green-200 break-all flex-1">{arweaveMetadataUri}</code>
                          <a
                            href={arweaveMetadataUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-green-400 hover:text-green-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(arweaveMetadataUri)
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full border-green-500/30 text-green-300 hover:bg-green-500/10"
                      >
                        Copy Metadata URI
                      </Button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-green-500/20">
                    <p className="text-xs text-green-300/70 text-center">
                      ✅ Successfully uploaded to Arweave permanent storage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Image Preview */}
        <div className="space-y-6">
          <Card className="bg-zinc-950/70 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Generated Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
                    <p className="text-sm text-zinc-400">Generating image...</p>
                  </div>
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Generated NFT" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-zinc-600">
                    <Sparkles className="w-12 h-12" />
                    <p className="text-sm">No image generated yet</p>
                  </div>
                )}
              </div>

              {/* Image Info */}
              {imageUrl && (
                <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Size</span>
                    <span className="text-white">2048 × 2048</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Format</span>
                    <span className="text-white">PNG</span>
                  </div>
                  <div className="mt-3">
                    <a
                      href={imageUrl}
                      download={`vault-${tokenId}-${guild.toLowerCase().replace(' ', '-')}-${gender.toLowerCase()}.png`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Download Image
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Layer Info */}
          {metadata && (
            <Card className="bg-zinc-950/70 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Layer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-400 mb-3">This image was generated using the following layering order:</p>
                  <ol className="space-y-1 text-zinc-300">
                    <li className="pl-3">1. Background (Guild-specific)</li>
                    <li className="pl-3">2. Body (Gender-specific)</li>
                    <li className="pl-3 text-purple-400 font-medium">3. Nose (Gender-specific) ✓</li>
                    <li className="pl-3">4. Mouth</li>
                    <li className="pl-3">5. Eyes</li>
                    <li className="pl-3">6. Outfits (Guild + Gender)</li>
                    <li className="pl-3">7. Hair (Gender-specific)</li>
                    <li className="pl-3">8. Headwear (Guild + Gender + Hair logic)</li>
                    <li className="pl-3">9. Hand (Skin tone matched)</li>
                    <li className="pl-3">10. Hand Gear (Guild-specific)</li>
                  </ol>
                  <div className="mt-4 p-2 bg-purple-950/30 border border-purple-500/20 rounded text-xs text-purple-200">
                    ✓ Nose layer is correctly positioned between Body and Mouth
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
