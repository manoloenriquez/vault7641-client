import { NextRequest, NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
import { getSolanaRpcUrl, UMI_CONFIG, getCollectionAddress } from '@/lib/solana/connection-config'

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

    // Create UMI instance with DAS API plugin
    const umi = createUmi(rpcEndpoint, UMI_CONFIG).use(dasApi())

    try {
      // Convert wallet address to UMI format
      const owner = publicKey(walletAddress)

      // Get collection address from env
      const collectionAddress = getCollectionAddress()
      console.log('🔍 [API] Collection address from env:', collectionAddress)

      let assets = []

      // Strategy: Try DAS API with collection filter first (fastest), fallback to mpl-core
      if (collectionAddress) {
        try {
          // Try DAS API with collection filtering (fastest if supported by RPC)
          console.log('🚀 [API] Attempting DAS API with collection filter...')
          // @ts-expect-error - DAS API searchAssets method is added by dasApi() plugin
          const searchResult = await umi.rpc.searchAssets({
            owner,
            grouping: ['collection', collectionAddress],
            limit: 1000,
          })
          assets = searchResult.items || []
          console.log(`✅ [API] DAS API Success! Found ${assets.length} NFTs from collection`)

          // Transform DAS API response to mpl-core format for consistency
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          assets = assets.map((item: any) => ({
            publicKey: item.id,
            name: item.content?.metadata?.name || 'Unknown',
            uri: item.content?.json_uri || '',
            updateAuthority: {
              type: 'Collection',
              address: collectionAddress,
            },
          }))
        } catch {
          // DAS API failed, fallback to mpl-core with filtering
          console.log('⚠️ [API] DAS API not available, using mpl-core with filtering...')
          const allAssets = await fetchAssetsByOwner(umi, owner)
          console.log(`📦 [API] Total assets found: ${allAssets.length}`)

          // Filter by collection
          assets = allAssets.filter((asset) => {
            const isCollection = asset.updateAuthority.type === 'Collection'
            const collectionMatch = asset.updateAuthority.address?.toString() === collectionAddress
            return isCollection && collectionMatch
          })
          console.log(`✅ [API] Filtered to ${assets.length} NFTs from Vault 7641 collection`)
        }
      } else {
        // No collection filter - fetch all NFTs
        console.log('⚠️ [API] No collection address configured, fetching all NFTs...')
        assets = await fetchAssetsByOwner(umi, owner)
        console.log(`✅ [API] Found ${assets.length} total NFTs`)
      }

      // If no assets found, return empty array
      if (assets.length === 0) {
        console.log('📭 [API] No NFTs found for wallet:', walletAddress)
        return NextResponse.json({
          success: true,
          data: [],
          count: 0,
          timestamp: new Date().toISOString(),
          message: 'No NFTs found for this wallet',
        })
      }

      // Transform and fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        assets.map(async (asset: any) => {
          // Check if NFT has been assigned to a guild
          const guilds = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
          let assignedGuild = null
          let isRevealed = false

          // Get URI (handle both mpl-core and DAS API formats)
          const assetUri = asset.uri || ''

          for (const guild of guilds) {
            if (assetUri && (assetUri.includes(`/${guild}/`) || assetUri.includes(`${guild}/`))) {
              assignedGuild = guild
              isRevealed = true
              break
            }
          }

          // Fetch metadata from URI
          let fetchedMetadata = null
          if (assetUri) {
            try {
              const metadataResponse = await fetch(assetUri)
              if (metadataResponse.ok) {
                fetchedMetadata = await metadataResponse.json()
              }
            } catch (error) {
              console.error(`❌ [API] Error fetching metadata for ${asset.publicKey}:`, error)
            }
          }

          // Handle both string and object publicKey
          const mintAddress = typeof asset.publicKey === 'string' ? asset.publicKey : asset.publicKey.toString()

          return {
            id: mintAddress,
            name: asset.name || 'Unknown NFT',
            image: fetchedMetadata?.image || fetchedMetadata?.image_uri || '/Logo_Full_nobg.png',
            metadata: {
              attributes: fetchedMetadata?.attributes || [],
              description: fetchedMetadata?.description || '',
            },
            mintAddress,
            uri: assetUri,
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
