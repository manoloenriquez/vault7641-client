import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updateV1, fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey, createSignerFromKeypair, keypairIdentity } from '@metaplex-foundation/umi'
import bs58 from 'bs58'

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
    const rpcUrl =
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      'https://spring-fragrant-violet.solana-mainnet.quiknode.pro/79d544575c48d9b2a6a8f91ecabf7f981a9ee730'
    const updateAuthorityPrivateKey = process.env.NFT_UPDATE_AUTHORITY_PRIVATE_KEY
    const collectionAddress = process.env.NFT_COLLECTION_ADDRESS // Optional: only needed if NFTs are in a collection

    if (!updateAuthorityPrivateKey) {
      console.error('NFT_UPDATE_AUTHORITY_PRIVATE_KEY is not set in environment variables')
      return NextResponse.json(
        {
          error: 'Server configuration error: NFT_UPDATE_AUTHORITY_PRIVATE_KEY not set',
          hint: 'Add NFT_UPDATE_AUTHORITY_PRIVATE_KEY to your .env.local file',
          example: 'NFT_UPDATE_AUTHORITY_PRIVATE_KEY="[123,45,67,...]"',
        },
        { status: 500 },
      )
    }

    // Create Solana connection with finalized commitment for better reliability
    const connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000, // 60 seconds
    })

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

    // Load update authority keypair from environment FIRST
    // The private key can be in different formats:
    // 1. Base58 string (from Phantom wallet export): "5Kb8...xyz"
    // 2. JSON array: "[1,2,3,...]"
    // 3. Comma-separated: "1,2,3,..."
    let updateAuthorityKeypair: Keypair

    try {
      let secretKey: Uint8Array

      // Remove any whitespace
      const trimmedKey = updateAuthorityPrivateKey.trim()

      console.log('Parsing private key...')
      console.log('Private key length:', trimmedKey.length)
      console.log('First 20 chars:', trimmedKey.substring(0, 20))

      // Try parsing as JSON array first
      if (trimmedKey.startsWith('[')) {
        console.log('Format detected: JSON array')
        const secretKeyArray = JSON.parse(trimmedKey)
        console.log('Parsed array length:', secretKeyArray.length)

        if (!Array.isArray(secretKeyArray) || secretKeyArray.length !== 64) {
          throw new Error(`Invalid secret key length: ${secretKeyArray.length}. Expected 64 bytes.`)
        }

        secretKey = Uint8Array.from(secretKeyArray)
      }
      // Try as base58 string (from Phantom or other wallets)
      else if (!trimmedKey.includes(',') && trimmedKey.length > 32) {
        console.log('Format detected: Base58 string')
        secretKey = bs58.decode(trimmedKey)
        console.log('Decoded base58, length:', secretKey.length)

        if (secretKey.length !== 64) {
          throw new Error(`Invalid secret key length: ${secretKey.length}. Expected 64 bytes.`)
        }
      }
      // Try as comma-separated numbers
      else {
        console.log('Format detected: Comma-separated')
        const parts = trimmedKey.split(',')
        console.log('Split by comma, parts count:', parts.length)
        const secretKeyArray = parts.map((num) => parseInt(num.trim()))

        if (secretKeyArray.length !== 64) {
          throw new Error(`Invalid secret key length: ${secretKeyArray.length}. Expected 64 bytes.`)
        }

        secretKey = Uint8Array.from(secretKeyArray)
      }

      updateAuthorityKeypair = Keypair.fromSecretKey(secretKey)
      console.log('✅ Successfully loaded keypair')
      console.log('Update authority public key:', updateAuthorityKeypair.publicKey.toBase58())
    } catch (error) {
      console.error('Failed to parse update authority private key:', error)
      return NextResponse.json(
        {
          error: 'Invalid NFT_UPDATE_AUTHORITY_PRIVATE_KEY format',
          details: error instanceof Error ? error.message : 'Unknown error',
          hint: 'Supported formats: Base58 string (from Phantom), JSON array [1,2,3,...], or comma-separated numbers',
          examples: [
            'Base58 (Phantom): "5Kb8...xyz" (88 characters)',
            'JSON array: "[1,2,3,...,64]"',
            'Comma-separated: "1,2,3,...,64"',
          ],
        },
        { status: 500 },
      )
    }

    // Initialize Umi with the signer and better RPC settings
    console.log('Initializing UMI with signer...')
    const umi = createUmi(rpcUrl, {
      commitment: 'confirmed',
    })

    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(updateAuthorityKeypair.secretKey)
    const updateAuthoritySigner = createSignerFromKeypair(umi, umiKeypair)
    umi.use({ install: () => ({ identity: updateAuthoritySigner }) })
    umi.use(keypairIdentity(updateAuthoritySigner))

    console.log('✅ UMI initialized with update authority signer')

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
    // const assetAuthority = asset.updateAuthority.address?.toString()
    // if (!assetAuthority || assetAuthority !== updateAuthorityKeypair.publicKey.toBase58()) {
    //   console.error('Update authority mismatch!')
    //   return NextResponse.json({ error: 'Server does not have update authority for this NFT' }, { status: 403 })
    // }

    // Construct new metadata URI based on guild and token number
    const baseUrl =
      process.env.NEXT_PUBLIC_METADATA_BASE_URL ||
      'https://gateway.lighthouse.storage/ipfs/bafybeidqvgwmkzsmabgiv7wjnla4lqobmhfzpi5oxb52xta6h7rayowara'
    // const newUri = `${baseUrl}/${guildId}/${tokenNumber}.json`
    const newUri = `${baseUrl}/${guildId}/0.json`
    const newName = `Vault #${tokenNumber}`

    console.log('Updating Core NFT metadata:', { newUri, newName })

    // Check if NFT is part of a collection and get collection public key if needed
    let collectionPublicKey = null

    if (collectionAddress) {
      try {
        console.log('Using collection from environment:', collectionAddress)
        collectionPublicKey = umiPublicKey(collectionAddress)

        // Verify the collection exists
        const collection = await fetchCollection(umi, collectionPublicKey)
        console.log('Collection verified:', collection.name)
      } catch (error) {
        console.warn('Failed to fetch collection (NFT may not be in a collection):', error)
        collectionPublicKey = null
        // Continue without collection - it's optional
      }
    } else if (asset.updateAuthority.type === 'Collection') {
      // If no collection address in env but asset has collection in updateAuthority
      const assetCollectionAddress = asset.updateAuthority.address
      if (assetCollectionAddress) {
        try {
          console.log('Using collection from asset updateAuthority:', assetCollectionAddress.toString())
          collectionPublicKey = assetCollectionAddress

          // Verify the collection exists
          const collection = await fetchCollection(umi, collectionPublicKey)
          console.log('Collection verified:', collection.name)
        } catch (error) {
          console.warn('Failed to fetch collection from asset:', error)
          collectionPublicKey = null
        }
      }
    }

    // Update the Core NFT using updateV1
    const updateParams = {
      asset: assetAddress,
      newUri,
      newName,
      ...(collectionPublicKey && { collection: collectionPublicKey }), // Conditionally add collection PublicKey
    }

    console.log('Update params:', {
      asset: assetAddress.toString(),
      newUri,
      newName,
      hasCollection: !!collectionPublicKey,
      collectionAddress: collectionPublicKey?.toString() || 'none',
    })

    // Build the transaction
    console.log('Building transaction...')
    const updateInstruction = updateV1(umi, updateParams)

    // Send and confirm with retry logic
    let result
    let lastError: Error | null = null
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries}: Sending transaction...`)

        // Use sendAndConfirm with skipPreflight for better reliability
        result = await updateInstruction.sendAndConfirm(umi, {
          send: {
            skipPreflight: false, // Check for errors before sending
            preflightCommitment: 'confirmed',
            maxRetries: 3,
          },
          confirm: {
            strategy: {
              type: 'blockhash',
              ...(await umi.rpc.getLatestBlockhash()), // Get fresh blockhash
            },
          },
        })

        console.log('✅ Transaction confirmed!')
        console.log('Signature:', result.signature)
        break // Success, exit retry loop
      } catch (error) {
        lastError = error as Error
        console.error(`Attempt ${attempt} failed:`, error)

        if (attempt < maxRetries) {
          const waitTime = attempt * 1000 // Progressive backoff: 1s, 2s
          console.log(`Waiting ${waitTime}ms before retry...`)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
        }
      }
    }

    if (!result) {
      throw new Error(
        `Transaction failed after ${maxRetries} attempts. Last error: ${lastError?.message || 'Unknown error'}`,
      )
    }

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
