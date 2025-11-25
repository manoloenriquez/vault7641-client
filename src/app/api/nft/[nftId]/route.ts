import { NextRequest, NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { getSolanaRpcUrl, UMI_CONFIG } from '@/lib/solana/connection-config'
import { PublicKey } from '@solana/web3.js'
import { verifySignedToken, NFTAccessSignedPayload } from '@/lib/security/param-signature'

export async function GET(request: NextRequest, { params }: { params: Promise<{ nftId: string }> }) {
  try {
    const { nftId } = await params

    if (!nftId) {
      return NextResponse.json({ error: 'NFT ID is required' }, { status: 400 })
    }

    // Get token and signature from query params for verification
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const signature = searchParams.get('signature')

    console.log('Fetching NFT data for:', nftId)

    // Verify signed token if provided (for secure access)
    let verifiedWalletAddress: string | null = null
    if (token && signature) {
      const verification = verifySignedToken<NFTAccessSignedPayload>(token, signature)
      
      if (!verification.valid || !verification.payload) {
        return NextResponse.json(
          { error: 'Unauthorized', message: verification.error ?? 'Invalid signature' },
          { status: 401 }
        )
      }

      const payload = verification.payload

      // Verify the token is for this specific NFT
      if (payload.type !== 'nft-access') {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Token type mismatch' },
          { status: 401 }
        )
      }

      if (payload.nftId !== nftId) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Token NFT ID mismatch' },
          { status: 401 }
        )
      }

      verifiedWalletAddress = payload.walletAddress
      console.log('✅ Token verified for wallet:', verifiedWalletAddress)
    }

    // Get RPC endpoint from global config
    const rpcEndpoint = getSolanaRpcUrl()

    // Create UMI instance with global config
    const umi = createUmi(rpcEndpoint, UMI_CONFIG)

    try {
      // Convert NFT ID to UMI PublicKey format
      const assetAddress = publicKey(nftId)

      // Fetch the Core NFT asset
      console.log('Fetching asset from blockchain...')
      const asset = await fetchAsset(umi, assetAddress)

      console.log('Asset fetched:', asset.name)

      // Double-check ownership matches the verified wallet from token
      // This is redundant security since we already verified during token issuance,
      // but provides defense in depth
      if (verifiedWalletAddress) {
        try {
          const userPublicKey = new PublicKey(verifiedWalletAddress)
          const ownerPublicKey = asset.owner ? new PublicKey(asset.owner) : null

          if (!ownerPublicKey || !ownerPublicKey.equals(userPublicKey)) {
            console.error('❌ Ownership verification failed!')
            console.error('   Asset owner:', ownerPublicKey?.toBase58() || 'unknown')
            console.error('   Token wallet:', userPublicKey.toBase58())
            return NextResponse.json(
              {
                error: 'Unauthorized',
                message: 'NFT ownership has changed since token was issued',
              },
              { status: 403 },
            )
          }

          console.log('✅ On-chain ownership confirmed')
        } catch (ownershipError) {
          console.error('Error verifying ownership:', ownershipError)
          return NextResponse.json(
            {
              error: 'Verification failed',
              message: 'Failed to verify NFT ownership',
            },
            { status: 500 },
          )
        }
      }

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
      // Guild assignment is indicated by the "Guild" trait in metadata attributes
      let assignedGuild = null
      let isRevealed = false

      if (metadata && metadata.attributes && Array.isArray(metadata.attributes)) {
        // Look for the "Guild" trait in the attributes
        const guildTrait = metadata.attributes.find(
          (attr: { trait_type: string; value: string }) =>
            attr.trait_type && attr.trait_type.toLowerCase() === 'guild'
        )

        if (guildTrait && guildTrait.value) {
          // NFT has a Guild trait, so it's revealed
          assignedGuild = guildTrait.value.toLowerCase()
          isRevealed = true
          console.log(`Guild detected from metadata trait: ${guildTrait.value}`)
        } else {
          console.log('No Guild trait found in metadata - NFT not revealed')
        }
      } else {
        console.log('No metadata attributes available')
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
