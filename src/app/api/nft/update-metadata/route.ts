import { NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { updateV1, fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey, createSignerFromKeypair, keypairIdentity } from '@metaplex-foundation/umi'
import { getSolanaRpcUrl, SOLANA_CONNECTION_CONFIG, UMI_CONFIG } from '@/lib/solana/connection-config'
import { verifySignedPayload, verifySignedToken, UpdateSignedPayload } from '@/lib/security/param-signature'

export const runtime = 'nodejs'

type UpdateRequestBody = {
  token: string
  signature: string
  payload?: UpdateSignedPayload
}

function getUpdateAuthorityKeypair(): Keypair {
  const updateAuthorityPrivateKey = process.env.NFT_UPDATE_AUTHORITY_PRIVATE_KEY

  if (!updateAuthorityPrivateKey) {
    throw new Error('NFT_UPDATE_AUTHORITY_PRIVATE_KEY is not set in environment variables')
  }

  try {
    let secretKey: Uint8Array
    const trimmedKey = updateAuthorityPrivateKey.trim()

    console.log('Parsing private key...')

    // Try parsing as JSON array first
    if (trimmedKey.startsWith('[')) {
      console.log('Format detected: JSON array')
      const secretKeyArray = JSON.parse(trimmedKey)
      if (!Array.isArray(secretKeyArray) || secretKeyArray.length !== 64) {
        throw new Error(`Invalid secret key length: ${secretKeyArray.length}. Expected 64 bytes.`)
      }
      secretKey = Uint8Array.from(secretKeyArray)
    }
    // Try as base58 string (from Phantom or other wallets)
    else if (!trimmedKey.includes(',') && trimmedKey.length > 32) {
      console.log('Format detected: Base58 string')
      secretKey = bs58.decode(trimmedKey)
      if (secretKey.length !== 64) {
        throw new Error(`Invalid secret key length: ${secretKey.length}. Expected 64 bytes.`)
      }
    }
    // Try as comma-separated numbers
    else {
      console.log('Format detected: Comma-separated')
      const parts = trimmedKey.split(',')
      const secretKeyArray = parts.map((num) => parseInt(num.trim()))
      if (secretKeyArray.length !== 64) {
        throw new Error(`Invalid secret key length: ${secretKeyArray.length}. Expected 64 bytes.`)
      }
      secretKey = Uint8Array.from(secretKeyArray)
    }

    const keypair = Keypair.fromSecretKey(secretKey)
    console.log('✅ Successfully loaded keypair')
    console.log('Update authority public key:', keypair.publicKey.toBase58())
    return keypair
  } catch (error) {
    console.error('Failed to parse update authority private key:', error)
    throw new Error(
      `Invalid NFT_UPDATE_AUTHORITY_PRIVATE_KEY format: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}

export async function POST(req: Request) {
  try {
    const body: UpdateRequestBody = await req.json()

    let verification = verifySignedToken<UpdateSignedPayload>(body.token, body.signature)

    if ((!verification.valid || !verification.payload) && body.payload) {
      verification = verifySignedPayload<UpdateSignedPayload>(body.payload, body.signature)
      if (verification.valid) {
        console.warn('[update-metadata] Token verification failed but payload signature succeeded. Falling back to payload.')
      }
    }

    if (!verification.valid || !verification.payload) {
      return NextResponse.json({ error: verification.error ?? 'Invalid signature' }, { status: 401 })
    }

    const payload = verification.payload

    const { mint, metadataUri, newName, walletAddress } = payload

    if (!mint || !metadataUri) {
      return NextResponse.json({ error: 'mint and metadataUri are required' }, { status: 400 })
    }

    console.log('Processing metadata update for Core NFT:', { mint, metadataUri, newName, walletAddress })

    // Get RPC URL from global config
    const rpcUrl = getSolanaRpcUrl()

    // Verify the NFT mint exists
    const connection = new Connection(rpcUrl, SOLANA_CONNECTION_CONFIG)
    try {
      const mintPublicKey = new PublicKey(mint)
      const accountInfo = await connection.getAccountInfo(mintPublicKey)
      if (!accountInfo) {
        return NextResponse.json({ error: 'NFT mint not found' }, { status: 404 })
      }
    } catch (error) {
      console.error('Invalid NFT mint address:', error)
      return NextResponse.json({ error: 'Invalid NFT mint address' }, { status: 400 })
    }

    // Load update authority keypair
    const updateAuthorityKeypair = getUpdateAuthorityKeypair()

    // Initialize Umi with the signer
    console.log('Initializing UMI with signer...')
    const umi = createUmi(rpcUrl, UMI_CONFIG)
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(updateAuthorityKeypair.secretKey)
    const updateAuthoritySigner = createSignerFromKeypair(umi, umiKeypair)
    umi.use({ install: () => ({ identity: updateAuthoritySigner }) })
    umi.use(keypairIdentity(updateAuthoritySigner))
    console.log('✅ UMI initialized with update authority signer')

    // Convert mint to Umi PublicKey
    const assetAddress = umiPublicKey(mint)

    // Fetch current Core NFT asset
    console.log('Fetching Core asset...')
    const asset = await fetchAsset(umi, assetAddress)
    console.log('Current asset:', {
      name: asset.name,
      uri: asset.uri,
      updateAuthority: asset.updateAuthority.address?.toString() || 'none',
    })

    // Verify wallet ownership if walletAddress is provided
    if (walletAddress) {
      const userPublicKey = new PublicKey(walletAddress)
      const ownerPublicKey = asset.owner ? new PublicKey(asset.owner) : null

      if (!ownerPublicKey || !ownerPublicKey.equals(userPublicKey)) {
        console.error('❌ Ownership verification failed!')
        console.error('   Asset owner:', ownerPublicKey?.toBase58() || 'unknown')
        console.error('   Request wallet:', userPublicKey.toBase58())
        return NextResponse.json(
          {
            error: 'Unauthorized: Wallet does not own this NFT',
            details: 'You can only update metadata for NFTs that you own.',
          },
          { status: 403 },
        )
      }

      console.log('✅ Ownership verified')
    } else {
      console.warn('⚠️ No walletAddress provided - skipping ownership verification')
    }

    // Check if NFT is part of a collection and get collection public key if needed
    const collectionAddress = process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS
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

    // Build update params
    const updateParams: Parameters<typeof updateV1>[1] = {
      asset: assetAddress,
      newUri: metadataUri,
      ...(collectionPublicKey && { collection: collectionPublicKey }), // Conditionally add collection
    }

    // Add newName if provided
    if (newName) {
      updateParams.newName = newName
    }

    console.log('Update params:', {
      asset: assetAddress.toString(),
      newUri: metadataUri,
      hasCollection: !!collectionPublicKey,
      collectionAddress: collectionPublicKey?.toString() || 'none',
      ...(newName && { newName }),
    })

    // Build and send the transaction
    console.log('Building transaction...')
    const updateInstruction = updateV1(umi, updateParams)

    // Send and confirm with retry logic
    let result
    let lastError: Error | null = null
    const maxRetries = 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries}: Sending transaction...`)
        result = await updateInstruction.sendAndConfirm(umi, {
          send: {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
            maxRetries: 3,
          },
          confirm: {
            strategy: {
              type: 'blockhash',
              ...(await umi.rpc.getLatestBlockhash()),
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
          const waitTime = attempt * 1000 // Progressive backoff
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

    return NextResponse.json({
      success: true,
      signature: result.signature,
      mint,
      newUri: metadataUri,
      ...(newName && { newName }),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Metadata update failed:', error)
    return NextResponse.json(
      {
        error: 'Metadata update failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}
