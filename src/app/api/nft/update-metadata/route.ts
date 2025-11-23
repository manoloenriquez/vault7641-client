import { NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js'
import bs58 from 'bs58'
import {
  DataV2,
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createUpdateMetadataAccountV2Instruction,
} from '@metaplex-foundation/mpl-token-metadata'

export const runtime = 'nodejs'

type UpdateRequestBody = {
  mint: string
  metadataUri: string
}

function getRpcUrl() {
  const rpc = process.env.SOLANA_RPC_URL
  if (!rpc) {
    throw new Error('SOLANA_RPC_URL is not configured')
  }
  return rpc
}

function decodeSecretKey(value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed)
      if (!Array.isArray(arr)) {
        throw new Error('JSON secret must be an array')
      }
      return Uint8Array.from(arr)
    } catch (error) {
      throw new Error(`Unable to parse JSON secret: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }

  try {
    return bs58.decode(trimmed)
  } catch (error) {
    throw new Error(`Unable to decode base58 secret key: ${error instanceof Error ? error.message : 'unknown error'}`)
  }
}

function getAdminKeypair() {
  const jsonSecret = process.env.ADMIN_KEYPAIR_JSON
  const legacySecret = process.env.NFT_UPDATE_AUTHORITY_PRIVATE_KEY

  if (!jsonSecret && !legacySecret) {
    throw new Error('Missing ADMIN_KEYPAIR_JSON or NFT_UPDATE_AUTHORITY_PRIVATE_KEY environment variable')
  }

  const secretBytes = decodeSecretKey(jsonSecret ?? legacySecret ?? '')
  return Keypair.fromSecretKey(secretBytes)
}

async function fetchExistingMetadata(connection: Connection, metadataPda: PublicKey) {
  try {
    return await Metadata.fromAccountAddress(connection, metadataPda)
  } catch (error) {
    throw new Error(`Failed to fetch metadata account: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function POST(req: Request) {
  try {
    const body: UpdateRequestBody = await req.json()
    const { mint, metadataUri } = body || {}

    if (!mint || !metadataUri) {
      return NextResponse.json({ error: 'mint and metadataUri are required' }, { status: 400 })
    }

    const mintPublicKey = new PublicKey(mint)

    const connection = new Connection(getRpcUrl(), 'confirmed')
    const adminKeypair = getAdminKeypair()

    const [metadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintPublicKey.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID,
    )

    const metadataAccount = await fetchExistingMetadata(connection, metadataPda)

    const existingData = metadataAccount.data.data
    const nextData: DataV2 = {
      ...existingData,
      uri: metadataUri,
    }

    const instruction = createUpdateMetadataAccountV2Instruction(
      {
        metadata: metadataPda,
        updateAuthority: adminKeypair.publicKey,
      },
      {
        updateMetadataAccountArgsV2: {
          data: nextData,
          updateAuthority: adminKeypair.publicKey,
          primarySaleHappened: metadataAccount.data.primarySaleHappened,
          isMutable: metadataAccount.data.isMutable,
        },
      },
    )

    const latestBlockhash = await connection.getLatestBlockhash()

    const transaction = new Transaction().add(instruction)
    transaction.feePayer = adminKeypair.publicKey
    transaction.recentBlockhash = latestBlockhash.blockhash

    transaction.sign(adminKeypair)

    const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false })

    await connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature,
    })

    return NextResponse.json({ signature })
  } catch (error) {
    console.error('Metadata update failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

