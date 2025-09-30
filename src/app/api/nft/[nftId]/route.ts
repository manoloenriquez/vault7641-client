import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { nftId: string } }) {
  try {
    const nftId = params.nftId

    if (!nftId) {
      return NextResponse.json({ error: 'NFT ID is required' }, { status: 400 })
    }

    // Mock NFT data - In a real implementation, this would:
    // 1. Query the database for the specific NFT
    // 2. Verify ownership if needed
    // 3. Return current metadata and guild assignment

    interface MockNFT {
      id: string
      name: string
      image: string
      metadata: {
        attributes: Array<{
          trait_type: string
          value: string
        }>
      }
      mintAddress: string
      isRevealed: boolean
      assignedGuild: string | null
    }

    const mockNFTs: Record<string, MockNFT> = {
      '1': {
        id: '1',
        name: 'Vault Pass #1234',
        image: '/Logo_Full_nobg.png',
        metadata: {
          attributes: [
            { trait_type: 'Rarity', value: 'Common' },
            { trait_type: 'Background', value: 'Dark' },
            { trait_type: 'Element', value: 'Fire' },
          ],
        },
        mintAddress: 'mint1234567890abcdef',
        isRevealed: false,
        assignedGuild: null,
      },
      '2': {
        id: '2',
        name: 'Vault Pass #5678',
        image: '/Logo_Full_nobg.png',
        metadata: {
          attributes: [
            { trait_type: 'Rarity', value: 'Rare' },
            { trait_type: 'Background', value: 'Blue' },
            { trait_type: 'Element', value: 'Water' },
          ],
        },
        mintAddress: 'mint0987654321fedcba',
        assignedGuild: 'trader',
        isRevealed: true,
      },
      '3': {
        id: '3',
        name: 'Vault Pass #9012',
        image: '/Logo_Full_nobg.png',
        metadata: {
          attributes: [
            { trait_type: 'Rarity', value: 'Epic' },
            { trait_type: 'Background', value: 'Gold' },
            { trait_type: 'Element', value: 'Earth' },
          ],
        },
        mintAddress: 'mint1122334455667788',
        isRevealed: false,
        assignedGuild: null,
      },
    }

    const nft = mockNFTs[nftId]

    if (!nft) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
    }

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 300))

    console.log(`Fetched NFT: ${nftId}`)

    return NextResponse.json({
      success: true,
      data: nft,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching NFT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
