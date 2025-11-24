import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updateV1, fetchAsset } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey, createSignerFromKeypair, keypairIdentity } from '@metaplex-foundation/umi'
import { toWeb3JsInstruction } from '@metaplex-foundation/umi-web3js-adapters'
import bs58 from 'bs58'
import { getSolanaRpcUrl, SOLANA_CONNECTION_CONFIG, UMI_CONFIG } from '@/lib/solana/connection-config'
import { type GuildType, VALID_GUILD_IDS } from '@/lib/guild-constants'

interface PrepareTransactionRequest {
  nftMint: string
  tokenNumber: number
  guildId: GuildType
  walletAddress: string
}

/**
 * POST /api/guild/prepare-transaction
 *
 * Prepares a transaction for guild assignment that the user will sign and pay for.
 * Server signs as the update authority, but user pays the transaction fee.
 *
 * Request Body:
 * - nftMint: The mint address of the NFT
 * - tokenNumber: The token number (used for art asset path)
 * - guildId: The guild to assign
 * - walletAddress: The user's wallet address (will be the fee payer)
 *
 * Response:
 * - transaction: Base64 encoded serialized transaction (partially signed by server)
 * - message: Instructions for the client
 */
export async function POST(request: NextRequest) {
  try {
    const body: PrepareTransactionRequest = await request.json()
    const { nftMint, tokenNumber, guildId, walletAddress } = body

    // Validate required fields
    if (!nftMint || !tokenNumber || !guildId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: nftMint, tokenNumber, guildId, walletAddress' },
        { status: 400 },
      )
    }

    // Validate guild ID
    if (!VALID_GUILD_IDS.includes(guildId as GuildType)) {
      return NextResponse.json({ error: 'Invalid guild ID' }, { status: 400 })
    }

    console.log('🔨 [Prepare TX] Preparing transaction for:', { nftMint, guildId, walletAddress })

    // Get environment variables
    const rpcUrl = getSolanaRpcUrl()
    const updateAuthorityPrivateKey = process.env.NFT_UPDATE_AUTHORITY_PRIVATE_KEY

    if (!updateAuthorityPrivateKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Update authority not configured' },
        { status: 500 },
      )
    }

    // Create connection
    const connection = new Connection(rpcUrl, SOLANA_CONNECTION_CONFIG)

    // Parse update authority keypair
    let updateAuthorityKeypair: Keypair
    try {
      const trimmedKey = updateAuthorityPrivateKey.trim()
      let secretKey: Uint8Array

      if (trimmedKey.startsWith('[') || trimmedKey.startsWith('{')) {
        // JSON array format
        const keyArray = JSON.parse(trimmedKey)
        secretKey = Uint8Array.from(keyArray)
      } else if (trimmedKey.includes(',')) {
        // Comma-separated format
        const keyArray = trimmedKey.split(',').map((num) => parseInt(num.trim(), 10))
        secretKey = Uint8Array.from(keyArray)
      } else {
        // Base58 format
        secretKey = bs58.decode(trimmedKey)
      }

      updateAuthorityKeypair = Keypair.fromSecretKey(secretKey)
      console.log('✅ [Prepare TX] Update authority loaded:', updateAuthorityKeypair.publicKey.toBase58())
    } catch (error) {
      console.error('❌ [Prepare TX] Failed to parse private key:', error)
      return NextResponse.json({ error: 'Invalid update authority configuration' }, { status: 500 })
    }

    // Create UMI instance with update authority as identity (for signing) but NOT as payer
    const umi = createUmi(rpcUrl, UMI_CONFIG)
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(updateAuthorityKeypair.secretKey)
    const updateAuthoritySigner = createSignerFromKeypair(umi, umiKeypair)
    umi.use(keypairIdentity(updateAuthoritySigner))

    // Fetch the NFT asset
    const assetPublicKey = umiPublicKey(nftMint)
    const asset = await fetchAsset(umi, assetPublicKey)

    console.log('📦 [Prepare TX] Current NFT:', { name: asset.name, uri: asset.uri })

    // Verify wallet ownership - security check
    const userPublicKey = new PublicKey(walletAddress)
    const ownerPublicKey = asset.owner ? new PublicKey(asset.owner) : null

    if (!ownerPublicKey || !ownerPublicKey.equals(userPublicKey)) {
      console.error('❌ [Prepare TX] Ownership verification failed')
      console.error('   Asset owner:', ownerPublicKey?.toBase58() || 'unknown')
      console.error('   Request wallet:', userPublicKey.toBase58())
      return NextResponse.json(
        { error: 'Wallet does not own this NFT. You can only assign guilds to NFTs you own.' },
        { status: 403 },
      )
    }

    console.log('✅ [Prepare TX] Ownership verified')

    // Construct new metadata URI
    const baseUrl = process.env.NEXT_PUBLIC_METADATA_BASE_URL || 'https://vault7641.com'
    const newUri = `${baseUrl}/metadata/${guildId}/${tokenNumber}.json`
    console.log('🎯 [Prepare TX] New URI:', newUri)

    // Build the update instruction using UMI
    console.log('🔨 [Prepare TX] Building update instruction...')

    const updateBuilder = updateV1(umi, {
      asset: assetPublicKey,
      newUri,
      authority: updateAuthoritySigner,
    })

    // Build and get the serialized instruction
    const compiledInstruction = await updateBuilder.getInstructions()
    const web3Instruction = toWeb3JsInstruction(compiledInstruction[0])

    // Create a new transaction with the user as fee payer
    const userPublicKey = new PublicKey(walletAddress)
    const transaction = new Transaction()

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    transaction.recentBlockhash = blockhash
    transaction.lastValidBlockHeight = lastValidBlockHeight
    transaction.feePayer = userPublicKey

    // Add the update instruction
    transaction.add(web3Instruction)

    // Partially sign with update authority
    transaction.partialSign(updateAuthorityKeypair)

    console.log('✅ [Prepare TX] Transaction prepared and partially signed')
    console.log('   Fee payer:', userPublicKey.toBase58())
    console.log('   Update authority signature added:', updateAuthorityKeypair.publicKey.toBase58())

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false, // User hasn't signed yet
      verifySignatures: false,
    })
    const base64Transaction = serializedTransaction.toString('base64')

    return NextResponse.json({
      success: true,
      transaction: base64Transaction,
      message: 'Transaction prepared. User must sign and send.',
      details: {
        feePayer: walletAddress,
        updateAuthority: updateAuthorityKeypair.publicKey.toBase58(),
        nftMint,
        newUri,
        blockhash,
        lastValidBlockHeight,
      },
    })
  } catch (error) {
    console.error('❌ [Prepare TX] Error preparing transaction:', error)
    return NextResponse.json(
      {
        error: 'Failed to prepare transaction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
