import { NextRequest, NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAsset } from '@metaplex-foundation/mpl-core'

export async function GET(request: NextRequest, { params }: { params: Promise<{ nftId: string }> }) {
  try {
    const { nftId } = await params

    if (!nftId) {
      return NextResponse.json({ error: 'NFT ID is required' }, { status: 400 })
    }

    console.log('Fetching NFT data for:', nftId)

    // Get RPC endpoint from environment
    const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'

    // Create UMI instance
    const umi = createUmi(rpcEndpoint)

    try {
      // Convert NFT ID to UMI PublicKey format
      const assetAddress = publicKey(nftId)

      // Fetch the Core NFT asset
      console.log('Fetching asset from blockchain...')
      const asset = await fetchAsset(umi, assetAddress)

      console.log('Asset fetched:', asset.name)

      // Check if asset is part of vault collection
      // if (asset.updateAuthority.type !== 'Collection' || asset.updateAuthority) {

      // Fetch metadata JSON if URI exists
      let metadata = null
      if (asset.uri) {
        try {
          console.log('Fetching metadata from URI:', asset.uri)
          const metadataResponse = await fetch(asset.uri)
          if (metadataResponse.ok) {
            metadata = await metadataResponse.json()
            console.log('Metadata fetched successfully')
          }
        } catch (metadataError) {
          console.error('Error fetching metadata JSON:', metadataError)
          // Continue without metadata - not critical
        }
      }

      // Check if NFT has been assigned to a guild
      // Guild assignment is indicated by the URI containing a guild name
      const guilds = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
      let assignedGuild = null
      let isRevealed = false

      for (const guild of guilds) {
        // Check for guild name in URI - supports multiple patterns:
        // - /art/builder/0.json
        // - /builder/0.json
        // - builder/0.json
        if (asset.uri && (asset.uri.includes(`/${guild}/`) || asset.uri.includes(`${guild}/`))) {
          assignedGuild = guild
          isRevealed = true
          console.log(`Guild detected: ${guild} from URI pattern`)
          break
        }
      }

      // Construct response
      const nftData = {
        id: nftId,
        name: asset.name || 'Unknown NFT',
        image: metadata?.image || metadata?.image_uri || '/Logo_Full_nobg.png',
        metadata: {
          attributes: metadata?.attributes || [],
          description: metadata?.description || '',
          external_url: metadata?.external_url || '',
        },
        mintAddress: nftId,
        uri: asset.uri || '',
        updateAuthority: asset.updateAuthority.address?.toString() || '',
        isRevealed,
        assignedGuild,
      }

      console.log('NFT data prepared:', { name: nftData.name, isRevealed, assignedGuild })

      return NextResponse.json({
        success: true,
        data: nftData,
        timestamp: new Date().toISOString(),
      })
    } catch (fetchError) {
      console.error('Error fetching NFT from blockchain:', fetchError)

      // Check if it's an invalid public key
      if (fetchError instanceof Error && fetchError.message.includes('Invalid public key')) {
        return NextResponse.json({ error: 'Invalid NFT address' }, { status: 400 })
      }

      // NFT not found on chain
      return NextResponse.json({ error: 'NFT not found on blockchain' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error in NFT API route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
