import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updateV1, fetchAsset } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey, createSignerFromKeypair } from '@metaplex-foundation/umi'

// Guild types
type GuildType = 'builder' | 'trader' | 'farmer' | 'gamer' | 'pathfinder'

interface GuildAssignmentRequest {
  nftMint: string
  tokenNumber: number
  guildId: GuildType
  walletAddress: string
}

/**
 * POST /api/guild/assign
 *
 * Assigns a guild to a Core NFT by updating its metadata on-chain (SERVER-SIDE)
 * This endpoint has the update authority to modify the NFT
 *
 * Request Body:
 * - nftMint: The mint address of the NFT
 * - tokenNumber: The token number (used for art asset path)
 * - guildId: The guild to assign ('builder', 'trader', 'farmer', 'gamer', 'pathfinder')
 * - walletAddress: The owner's wallet address (for verification)
 */
export async function POST(request: NextRequest) {
  try {
    const body: GuildAssignmentRequest = await request.json()
    const { nftMint, tokenNumber, guildId, walletAddress } = body

    // Validate required fields
    if (!nftMint || !tokenNumber || !guildId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: nftMint, tokenNumber, guildId, walletAddress' },
        { status: 400 },
      )
    }

    // Validate guild ID
    const validGuilds: GuildType[] = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
    if (!validGuilds.includes(guildId)) {
      return NextResponse.json({ error: 'Invalid guild ID' }, { status: 400 })
    }

    console.log('Processing guild assignment:', { nftMint, guildId, tokenNumber, walletAddress })

    // Get environment variables
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    const updateAuthorityPrivateKey = process.env.NFT_UPDATE_AUTHORITY_PRIVATE_KEY

    if (!updateAuthorityPrivateKey) {
      console.error('NFT_UPDATE_AUTHORITY_PRIVATE_KEY is not set in environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Create Solana connection
    const connection = new Connection(rpcUrl, 'confirmed')

    // Verify the NFT mint exists
    try {
      const mintPublicKey = new PublicKey(nftMint)
      const accountInfo = await connection.getAccountInfo(mintPublicKey)
      if (!accountInfo) {
        return NextResponse.json({ error: 'NFT mint not found' }, { status: 404 })
      }
    } catch (error) {
      console.error('Invalid NFT mint address:', error)
      return NextResponse.json({ error: 'Invalid NFT mint address' }, { status: 400 })
    }

    // Initialize Umi
    console.log('Initializing UMI...')
    const umi = createUmi(rpcUrl)

    // Load update authority keypair from environment
    const updateAuthorityKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(updateAuthorityPrivateKey)))

    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(updateAuthorityKeypair.secretKey)
    const updateAuthoritySigner = createSignerFromKeypair(umi, umiKeypair)
    umi.use({ install: () => ({ identity: updateAuthoritySigner }) })

    console.log('Update authority loaded:', updateAuthorityKeypair.publicKey.toBase58())

    // Convert mint to Umi PublicKey
    const assetAddress = umiPublicKey(nftMint)

    // Fetch current Core NFT asset
    console.log('Fetching Core asset...')
    const asset = await fetchAsset(umi, assetAddress)

    console.log('Current asset:', {
      name: asset.name,
      uri: asset.uri,
      updateAuthority: asset.updateAuthority.address?.toString() || 'none',
    })

    // Verify server has update authority
    const assetAuthority = asset.updateAuthority.address?.toString()
    if (!assetAuthority || assetAuthority !== updateAuthorityKeypair.publicKey.toBase58()) {
      console.error('Update authority mismatch!')
      return NextResponse.json({ error: 'Server does not have update authority for this NFT' }, { status: 403 })
    }

    // Construct new metadata URI based on guild and token number
    const baseUrl = process.env.NEXT_PUBLIC_METADATA_BASE_URL || 'https://vault7641.com'
    const newUri = `${baseUrl}/art/${guildId}/${tokenNumber}.json`
    const newName = `Vault 7641 - ${guildId.charAt(0).toUpperCase() + guildId.slice(1)} #${tokenNumber}`

    console.log('Updating Core NFT metadata:', { newUri, newName })

    // Update the Core NFT using updateV1
    const result = await updateV1(umi, {
      asset: assetAddress,
      newUri,
      newName,
    }).sendAndConfirm(umi)

    console.log('Successfully updated Core NFT metadata')
    console.log('Transaction signature:', result.signature)

    // TODO: Store assignment in database for tracking/analytics
    // You can add database logic here to track:
    // - Which wallets have which guilds
    // - When the assignment was made
    // - Transaction signatures for reference
    // Example:
    // await db.guildAssignments.create({
    //   nftMint,
    //   tokenNumber,
    //   guildId,
    //   walletAddress,
    //   transactionSignature: result.signature,
    //   newUri,
    //   assignedAt: new Date(),
    // })

    return NextResponse.json({
      success: true,
      data: {
        nftMint,
        tokenNumber,
        guildId,
        newUri,
        newName,
        transactionSignature: result.signature,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Guild assignment error:', error)

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'Failed to assign guild',
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

/**
 * GET /api/guild/assign?walletAddress=xxx
 *
 * Get guild assignments for a wallet address
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing walletAddress parameter' }, { status: 400 })
    }

    // TODO: Fetch from database
    // const assignments = await db.guildAssignments.findMany({
    //   where: { walletAddress },
    //   orderBy: { assignedAt: 'desc' },
    // })

    // Mock response for now
    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        assignments: [],
      },
    })
  } catch (error) {
    console.error('Error fetching guild assignments:', error)
    return NextResponse.json({ error: 'Failed to fetch guild assignments' }, { status: 500 })
  }
}
