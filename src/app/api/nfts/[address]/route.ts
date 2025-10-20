import { NextRequest, NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
import { getSolanaRpcUrl, UMI_CONFIG } from '@/lib/solana/connection-config'

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address: walletAddress } = await params

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    console.log('Fetching NFTs for wallet:', walletAddress)

    // Validate wallet address
    try {
      new PublicKey(walletAddress)
    } catch {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Get RPC endpoint from global config
    const rpcEndpoint = getSolanaRpcUrl()

    // Create UMI instance with global config
    const umi = createUmi(rpcEndpoint, UMI_CONFIG)

    try {
      // Convert wallet address to UMI format
      const owner = publicKey(walletAddress)

      const collectionAddress = process.env.NFT_COLLECTION_ADDRESS // Optional: only needed if NFTs are in a collection

      // Fetch all Core assets (NFTs) owned by the wallet
      console.log('Calling fetchAssetsByOwner...')
      const assets = (await fetchAssetsByOwner(umi, owner)).filter(
        (asset) =>
          asset.updateAuthority.type === 'Collection' &&
          asset.updateAuthority.address?.toString() === collectionAddress,
      )

      console.log(`Found ${assets.length} Core NFTs`)

      // Transform and fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        assets.map(async (asset) => {
          // Check if NFT has been assigned to a guild
          const guilds = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
          let assignedGuild = null
          let isRevealed = false

          for (const guild of guilds) {
            if (asset.uri && (asset.uri.includes(`/${guild}/`) || asset.uri.includes(`${guild}/`))) {
              assignedGuild = guild
              isRevealed = true
              break
            }
          }

          // Fetch metadata JSON if URI exists
          let metadata = null
          if (asset.uri) {
            try {
              const metadataResponse = await fetch(asset.uri)
              if (metadataResponse.ok) {
                metadata = await metadataResponse.json()
              }
            } catch (error) {
              console.error(`Error fetching metadata for ${asset.publicKey}:`, error)
            }
          }

          return {
            id: asset.publicKey.toString(),
            name: asset.name || 'Unknown NFT',
            image: metadata?.image || metadata?.image_uri || '/Logo_Full_nobg.png',
            metadata: {
              attributes: metadata?.attributes || [],
              description: metadata?.description || '',
            },
            mintAddress: asset.publicKey.toString(),
            uri: asset.uri || '',
            isRevealed,
            assignedGuild,
          }
        }),
      )

      console.log(`Processed ${nftsWithMetadata.length} NFTs with metadata`)

      return NextResponse.json({
        success: true,
        data: nftsWithMetadata,
        count: nftsWithMetadata.length,
        timestamp: new Date().toISOString(),
      })
    } catch (fetchError) {
      console.error('Error fetching NFTs from blockchain:', fetchError)
      return NextResponse.json(
        {
          error: 'Failed to fetch NFTs from blockchain',
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error',
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error in NFTs API route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
