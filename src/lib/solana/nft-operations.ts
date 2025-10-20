import { Connection, PublicKey } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner, updateV1, fetchAsset, type AssetV1 } from '@metaplex-foundation/mpl-core'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import type { WalletAdapter } from '@solana/wallet-adapter-base'
import { UMI_CONFIG } from './connection-config'

type GuildType = 'builder' | 'trader' | 'farmer' | 'gamer' | 'pathfinder'

/**
 * Get all Core NFTs owned by a wallet address using Metaplex Core
 */
export async function getUserNFTs(connection: Connection, walletAddress: PublicKey) {
  try {
    console.log('Fetching Core NFTs for wallet:', walletAddress.toBase58())

    // Get the RPC endpoint from the connection
    const rpcEndpoint = connection.rpcEndpoint

    // Create UMI instance with global config
    const umi = createUmi(rpcEndpoint, UMI_CONFIG)

    // Convert wallet address to UMI format
    const owner = publicKey(walletAddress.toBase58())

    // Fetch all Core assets (NFTs) owned by the wallet
    console.log('Calling fetchAssetsByOwner from mpl-core...')
    const assets = await fetchAssetsByOwner(umi, owner)

    console.log('Total Core NFTs found:', assets.length)

    // Transform to our format
    const nfts = assets.map((asset: AssetV1) => ({
      mint: asset.publicKey,
      tokenAccount: asset.publicKey,
      name: asset.name || 'Unknown',
      symbol: '', // Core assets don't have symbol in the same way
      uri: asset.uri || '',
      updateAuthority: asset.updateAuthority.address,
    }))

    console.log('Core NFTs transformed:', nfts.length)

    if (nfts.length > 0) {
      console.log(
        'First few Core NFTs:',
        nfts.slice(0, 3).map((n: { mint: string; name: string; uri: string }) => ({
          mint: n.mint,
          name: n.name,
          uri: n.uri,
        })),
      )
    }

    return nfts
  } catch (error) {
    console.error('Error fetching Core NFTs with Metaplex:', error)
    throw error
  }
}

/**
 * Get NFT with full metadata (including image and attributes from JSON)
 */
export async function getNFTWithMetadata(connection: Connection, walletAddress: PublicKey) {
  try {
    const nfts = await getUserNFTs(connection, walletAddress)

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
