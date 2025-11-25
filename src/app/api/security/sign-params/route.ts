import { NextRequest, NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey } from '@metaplex-foundation/umi'
import { PublicKey } from '@solana/web3.js'
import { GUILDS } from '@/lib/guild-constants'
import {
  createSignedToken,
  generateSeed,
  GenerationSignedPayload,
  UpdateSignedPayload,
  NFTAccessSignedPayload,
} from '@/lib/security/param-signature'
import { getSolanaRpcUrl, UMI_CONFIG } from '@/lib/solana/connection-config'

export const runtime = 'nodejs'

type GenerationRequest = {
  type: 'generation'
  mint: string
  tokenNumber: number
  guild: string
  gender: string
  walletAddress: string
  seed?: string
}

type UpdateRequest = {
  type: 'update'
  mint: string
  metadataUri: string
  newName?: string
  walletAddress: string
}

type NFTAccessRequest = {
  type: 'nft-access'
  nftId: string
  mint: string
  walletAddress: string
}

type SignParamsRequest = GenerationRequest | UpdateRequest | NFTAccessRequest

const guildNameSet = new Set(GUILDS.map((guild) => guild.name))

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignParamsRequest | null
    if (!body || typeof body.type !== 'string') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const rpcEndpoint = getSolanaRpcUrl()
    const umi = createUmi(rpcEndpoint, UMI_CONFIG)

    switch (body.type) {
      case 'generation':
        return await handleGenerationRequest(body, umi)
      case 'update':
        return await handleUpdateRequest(body, umi)
      case 'nft-access':
        return await handleNFTAccessRequest(body, umi)
      default:
        return NextResponse.json({ error: 'Unsupported request type' }, { status: 400 })
    }
  } catch (error) {
    console.error('[sign-params] Failed to create signature', error)
    return NextResponse.json(
      {
        error: 'Failed to create signature for request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

async function handleGenerationRequest(body: GenerationRequest, umi: ReturnType<typeof createUmi>) {
  if (!Number.isFinite(body.tokenNumber) || body.tokenNumber <= 0) {
    return NextResponse.json({ error: 'tokenNumber must be a positive integer' }, { status: 400 })
  }

  if (!guildNameSet.has(body.guild)) {
    return NextResponse.json({ error: `Unknown guild "${body.guild}"` }, { status: 400 })
  }

  if (!body.gender) {
    return NextResponse.json({ error: 'gender is required' }, { status: 400 })
  }

  const ownershipResult = await verifyOwnership(umi, body.mint, body.walletAddress)
  if (!ownershipResult.valid) {
    return NextResponse.json({ error: ownershipResult.error }, { status: ownershipResult.statusCode })
  }

  let seedOverride: string | undefined
  if (typeof body.seed !== 'undefined') {
    if (typeof body.seed !== 'string' && typeof body.seed !== 'number') {
      return NextResponse.json({ error: 'seed must be a string or number' }, { status: 400 })
    }
    seedOverride = String(body.seed).slice(0, 64)
  }

  const payload: Omit<GenerationSignedPayload, 'issuedAt' | 'expiresAt'> = {
    type: 'generation',
    mint: body.mint,
    walletAddress: body.walletAddress,
    tokenNumber: body.tokenNumber,
    guild: body.guild,
    gender: body.gender,
    seed: seedOverride ?? generateSeed(16),
  }

  const signed = createSignedToken<GenerationSignedPayload>(payload)
  return NextResponse.json({
    token: signed.token,
    signature: signed.signature,
    payload: signed.payload,
  })
}

async function handleUpdateRequest(body: UpdateRequest, umi: ReturnType<typeof createUmi>) {
  if (!body.metadataUri) {
    return NextResponse.json({ error: 'metadataUri is required' }, { status: 400 })
  }

  try {
    const parsedUri = new URL(body.metadataUri)
    if (!['http:', 'https:'].includes(parsedUri.protocol)) {
      return NextResponse.json({ error: 'metadataUri must use http/https' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'metadataUri must be a valid URL' }, { status: 400 })
  }

  const ownershipResult = await verifyOwnership(umi, body.mint, body.walletAddress)
  if (!ownershipResult.valid) {
    return NextResponse.json({ error: ownershipResult.error }, { status: ownershipResult.statusCode })
  }

  const payload: Omit<UpdateSignedPayload, 'issuedAt' | 'expiresAt'> = {
    type: 'update',
    mint: body.mint,
    walletAddress: body.walletAddress,
    metadataUri: body.metadataUri,
    newName: body.newName,
  }

  const signed = createSignedToken<UpdateSignedPayload>(payload)
  return NextResponse.json({
    token: signed.token,
    signature: signed.signature,
    payload: signed.payload,
  })
}

async function handleNFTAccessRequest(body: NFTAccessRequest, umi: ReturnType<typeof createUmi>) {
  if (!body.nftId) {
    return NextResponse.json({ error: 'nftId is required' }, { status: 400 })
  }

  // Verify ownership using mint address
  const ownershipResult = await verifyOwnership(umi, body.mint, body.walletAddress)
  if (!ownershipResult.valid) {
    return NextResponse.json({ error: ownershipResult.error }, { status: ownershipResult.statusCode })
  }

  const payload: Omit<NFTAccessSignedPayload, 'issuedAt' | 'expiresAt'> = {
    type: 'nft-access',
    mint: body.mint,
    nftId: body.nftId,
    walletAddress: body.walletAddress,
  }

  const signed = createSignedToken<NFTAccessSignedPayload>(payload)
  return NextResponse.json({
    token: signed.token,
    signature: signed.signature,
    payload: signed.payload,
  })
}

async function verifyOwnership(
  umi: ReturnType<typeof createUmi>,
  mint: string,
  walletAddress: string,
): Promise<{ valid: boolean; error?: string; statusCode: number }> {
  if (!mint || !walletAddress) {
    return { valid: false, error: 'mint and walletAddress are required', statusCode: 400 }
  }

  try {
    const walletPublicKey = new PublicKey(walletAddress)
    const assetAddress = umiPublicKey(mint)
    const asset = await fetchAsset(umi, assetAddress)
    const assetOwner = asset.owner ? new PublicKey(asset.owner) : null

    if (!assetOwner) {
      return { valid: false, error: 'Unable to determine asset owner', statusCode: 400 }
    }

    if (!assetOwner.equals(walletPublicKey)) {
      return { valid: false, error: 'Wallet does not own this NFT', statusCode: 403 }
    }

    return { valid: true, statusCode: 200 }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid public key')) {
      return { valid: false, error: 'Invalid mint or wallet address', statusCode: 400 }
    }
    console.error('[sign-params] Ownership verification failed', error)
    return { valid: false, error: 'Failed to verify NFT ownership', statusCode: 500 }
  }
}

