import { Connection, PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { updateV1, fetchAsset } from '@metaplex-foundation/mpl-core'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { UMI_CONFIG, getCollectionAddress } from './connection-config'
import { nftCache } from './nft-cache'

type GuildType = 'builder' | 'trader' | 'farmer' | 'gamer' | 'pathfinder'

// Type for basic NFT data
interface NFTData {
  mint: unknown
  tokenAccount: unknown
  name: string
  symbol: string
  uri: string
  updateAuthority: unknown
}

// Type for NFT with metadata
interface NFTWithMetadata extends NFTData {
  metadata: {
    name?: string
    description?: string
    image?: string
    image_uri?: string
    attributes?: Array<{ trait_type: string; value: string }>
  } | null
}

/**
 * Get all NFTs from the Vault 7641 collection owned by a wallet address using DAS API
 * Results are cached for 5 minutes to improve performance
 *
 * Uses the Digital Asset Standard (DAS) API which is much faster than fetching all assets
 * and allows filtering by collection.
 */
export async function getUserNFTs(
  connection: Connection,
  walletAddress: PublicKey,
  useCache = true,
): Promise<NFTData[]> {
  try {
    // Check cache first
    if (useCache) {
      const cached = nftCache.get<NFTData[]>(walletAddress)
      if (cached) {
        console.log('✅ [getUserNFTs] Using cached NFT data for:', walletAddress.toBase58())
        return cached
      }
      console.log('⏳ [getUserNFTs] Cache MISS, fetching from blockchain...')
    }

    console.log('🔍 [getUserNFTs] Fetching Vault NFTs for wallet:', walletAddress.toBase58())

    // Get the RPC endpoint from the connection
    const rpcEndpoint = connection.rpcEndpoint

    // Create UMI instance with DAS API plugin
    const umi = createUmi(rpcEndpoint, UMI_CONFIG).use(dasApi())

    // Convert wallet address to UMI format
    const owner = publicKey(walletAddress.toBase58())

    // Get collection address from env
    const collectionAddress = getCollectionAddress()

    let assets

    if (collectionAddress) {
      // Fetch NFTs from specific collection (faster and more accurate)
      console.log('Fetching NFTs from collection:', collectionAddress)
      // @ts-expect-error - DAS API searchAssets method is added by dasApi() plugin
      const searchResult = await umi.rpc.searchAssets({
        owner,
        grouping: ['collection', collectionAddress],
        limit: 1000,
        displayOptions: {
          showCollectionMetadata: true,
          showFungible: false,
        },
      })
      assets = searchResult.items
      console.log(`Found ${assets.length} NFTs from Vault 7641 collection`)
    } else {
      // Fallback: Fetch all NFTs owned by wallet (slower, includes all collections)
      console.warn('⚠️ No collection address configured. Fetching all NFTs...')
      // @ts-expect-error - DAS API searchAssets method is added by dasApi() plugin
      const searchResult = await umi.rpc.searchAssets({
        owner,
        limit: 1000,
        displayOptions: {
          showCollectionMetadata: true,
          showFungible: false,
        },
      })
      assets = searchResult.items
      console.log(`Found ${assets.length} total NFTs`)
    }

    // Transform to our format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nfts = assets.map((asset: any) => ({
      mint: asset.id,
      tokenAccount: asset.id,
      name: asset.content?.metadata?.name || 'Unknown',
      symbol: asset.content?.metadata?.symbol || '',
      uri: asset.content?.json_uri || '',
      updateAuthority: asset.authorities?.[0]?.address || asset.id,
    }))

    console.log('NFTs transformed:', nfts.length)

    if (nfts.length > 0) {
      console.log(
        'First few NFTs:',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nfts.slice(0, 3).map((n: { mint: any; name: string; uri: string }) => ({
          mint: String(n.mint),
          name: n.name,
          uri: n.uri,
        })),
      )
    }

    // Cache the results
    if (useCache) {
      nftCache.set(walletAddress, nfts)
    }

    return nfts
  } catch (error) {
    console.error('Error fetching NFTs with DAS API:', error)
    throw error
  }
}

/**
 * Get NFT with full metadata (including image and attributes from JSON)
 * Results are cached for 5 minutes to improve performance
 */
export async function getNFTWithMetadata(
  connection: Connection,
  walletAddress: PublicKey,
  useCache = true,
): Promise<NFTWithMetadata[]> {
  try {
    // Check cache first (using a different cache key for metadata)
    const cacheKey = `${walletAddress.toBase58()}_metadata`
    if (useCache) {
      const cached = nftCache.get<NFTWithMetadata[]>(cacheKey)
      if (cached) {
        console.log('✅ [getNFTWithMetadata] Using cached NFT metadata for:', walletAddress.toBase58())
        console.log('✅ [getNFTWithMetadata] Cached NFTs:', cached.length)
        return cached
      }
      console.log('⏳ [getNFTWithMetadata] Cache MISS, fetching metadata...')
    }

    const nfts = await getUserNFTs(connection, walletAddress, useCache)

    // Fetch metadata for each NFT
    const nftsWithMetadata = await Promise.all(
      nfts.map(async (nft) => {
        if (!nft.uri) {
          return { ...nft, metadata: null }
        }

        try {
          const metadata = await fetchNFTMetadata(nft.uri)
          return {
            ...nft,
            metadata,
          }
        } catch (error) {
          console.error(`Error fetching metadata for ${nft.mint}:`, error)
          return { ...nft, metadata: null }
        }
      }),
    )

    // Cache the results with metadata
    if (useCache) {
      nftCache.set(cacheKey, nftsWithMetadata)
    }

    return nftsWithMetadata
  } catch (error) {
    console.error('Error getting NFTs with metadata:', error)
    throw error
  }
}

/**
 * Update Core NFT metadata URI using Metaplex Core
 * Uses the updateV1 instruction from @metaplex-foundation/mpl-core
 */
export async function updateCoreNFTMetadata(
  connection: Connection,
  wallet: WalletAdapter,
  nftMintAddress: string,
  newUri: string,
  newName?: string,
) {
  try {
    console.log('Updating Core NFT metadata...')
    console.log('NFT Mint:', nftMintAddress)
    console.log('New URI:', newUri)

    // Get the RPC endpoint from the connection
    const rpcEndpoint = connection.rpcEndpoint

    // Create UMI instance with wallet adapter and global config
    const umi = createUmi(rpcEndpoint, UMI_CONFIG).use(walletAdapterIdentity(wallet))

    // Convert mint address to UMI format
    const assetAddress = publicKey(nftMintAddress)

    // Fetch the current asset to get its details
    console.log('Fetching asset details...')
    const asset = await fetchAsset(umi, assetAddress)

    console.log('Current asset name:', asset.name)
    console.log('Current asset URI:', asset.uri)
    console.log('Update authority:', asset.updateAuthority.address)

    // Build the update instruction
    console.log('Building updateV1 instruction...')
    const updateInstruction = await updateV1(umi, {
      asset: assetAddress,
      newUri: newUri,
      newName: newName || asset.name, // Keep existing name if not provided
    })

    console.log('Sending transaction...')
    const result = await updateInstruction.sendAndConfirm(umi)

    console.log('NFT metadata updated successfully!')
    console.log('Transaction signature:', result.signature)

    // Invalidate cache for the wallet that owns this NFT
    // This ensures fresh data is fetched next time
    if (wallet.publicKey) {
      nftCache.invalidate(wallet.publicKey.toString())
      nftCache.invalidate(`${wallet.publicKey.toString()}_metadata`)
      console.log('🔄 Cache invalidated for wallet:', wallet.publicKey.toString())
    }

    return {
      signature: result.signature,
      newUri,
      newName: newName || asset.name,
    }
  } catch (error) {
    console.error('Error updating Core NFT metadata:', error)
    throw error
  }
}

/**
 * Update NFT with guild-specific metadata
 * This is the main function called from the frontend for guild assignment
 */
export async function updateNftGuild(
  connection: Connection,
  wallet: WalletAdapter,
  nftMint: string,
  guildId: GuildType,
  tokenNumber: number,
) {
  try {
    // Construct the new metadata URI
    const baseUrl = process.env.NEXT_PUBLIC_METADATA_BASE_URL || 'https://vault7641.com'
    const newMetadataUri = `${baseUrl}/art/${guildId}/${tokenNumber}.json`

    // Optional: Update the name to include guild info
    const newName = `Vault 7641 - ${guildId.charAt(0).toUpperCase() + guildId.slice(1)} #${tokenNumber}`

    console.log('Assigning NFT to guild:', guildId)
    console.log('Token number:', tokenNumber)

    // Update the NFT metadata
    const result = await updateCoreNFTMetadata(connection, wallet, nftMint, newMetadataUri, newName)

    return result
  } catch (error) {
    console.error('Error updating NFT guild:', error)
    throw error
  }
}

/**
 * Fetch NFT metadata from URI
 */
export async function fetchNFTMetadata(metadataUri: string) {
  try {
    console.log('Fetching metadata from URI:', metadataUri)
    const response = await fetch(metadataUri)
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`)
    }
    const metadata = await response.json()
    console.log('Metadata fetched successfully:', metadata.name || 'Unknown')
    return metadata
  } catch (error) {
    console.error('Error fetching NFT metadata:', error)
    throw error
  }
}

/**
 * Get NFT metadata URI from on-chain metadata account
 */
export async function getNFTMetadataUri(connection: Connection, mintAddress: PublicKey): Promise<string | null> {
  try {
    // Derive metadata PDA
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mintAddress.toBuffer()],
      METADATA_PROGRAM_ID,
    )

    // Fetch metadata account
    const accountInfo = await connection.getAccountInfo(metadataPDA)
    if (!accountInfo) {
      return null
    }

    // Parse URI from metadata account
    // Note: This is a simplified version - proper parsing would use Metaplex SDK
    const data = accountInfo.data
    // URI starts at byte 99 (after name and symbol)
    // Length is encoded in first 4 bytes of URI section
    const uriStart = 99
    const uriLength = data.readUInt32LE(uriStart)
    const uri = data.slice(uriStart + 4, uriStart + 4 + uriLength).toString('utf8')

    return uri
  } catch (error) {
    console.error('Error getting NFT metadata URI:', error)
    return null
  }
}

/**
 * Check if an NFT has been assigned to a guild
 */
export async function isNFTAssignedToGuild(connection: Connection, mintAddress: PublicKey): Promise<boolean> {
  try {
    const uri = await getNFTMetadataUri(connection, mintAddress)
    if (!uri) return false

    // Check if URI contains a guild name
    const guilds: GuildType[] = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
    return guilds.some((guild) => uri.includes(`/art/${guild}/`))
  } catch (error) {
    console.error('Error checking guild assignment:', error)
    return false
  }
}

/**
 * Get the guild assigned to an NFT from its metadata URI
 */
export async function getAssignedGuild(connection: Connection, mintAddress: PublicKey): Promise<GuildType | null> {
  try {
    const uri = await getNFTMetadataUri(connection, mintAddress)
    if (!uri) return null

    // Extract guild from URI pattern: /art/[guild-name]/[number].json
    const guilds: GuildType[] = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
    for (const guild of guilds) {
      if (uri.includes(`/art/${guild}/`)) {
        return guild
      }
    }

    return null
  } catch (error) {
    console.error('Error getting assigned guild:', error)
    return null
  }
}

// Re-export cache utilities for manual cache management
export { invalidateNFTCache, clearNFTCache, getNFTCacheStats } from './nft-cache'
