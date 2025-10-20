import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, nftMint, tokenNumber, guildId, transactionSignature, metadataUri } = body

    // Validate required fields
    if (!walletAddress || !nftMint || !guildId || !transactionSignature || !metadataUri) {
      return NextResponse.json(
        { error: 'Missing required fields: walletAddress, nftMint, guildId, transactionSignature, metadataUri' },
        { status: 400 },
      )
    }

    // Validate guild ID
    const validGuilds = ['builder', 'trader', 'farmer', 'gamer', 'pathfinder']
    if (!validGuilds.includes(guildId)) {
      return NextResponse.json({ error: 'Invalid guild ID' }, { status: 400 })
    }

    console.log('Guild assignment successful - Recording:', {
      walletAddress,
      nftMint,
      tokenNumber,
      guildId,
      transactionSignature,
      metadataUri,
      timestamp: new Date().toISOString(),
    })

    // ============================================
    // DATABASE SAVE LOGIC GOES HERE
    // ============================================
    // In a production implementation, you would:
    // 1. Connect to your database (Prisma, MongoDB, PostgreSQL, etc.)
    // 2. Save or update the guild assignment record:
    //
    // Example with Prisma:
    // const assignment = await prisma.guildAssignment.upsert({
    //   where: { nftMint },
    //   update: {
    //     guildId,
    //     walletAddress,
    //     tokenNumber,
    //     transactionSignature,
    //     metadataUri,
    //     updatedAt: new Date(),
    //   },
    //   create: {
    //     nftMint,
    //     guildId,
    //     walletAddress,
    //     tokenNumber,
    //     transactionSignature,
    //     metadataUri,
    //     createdAt: new Date(),
    //   },
    // })
    //
    // 3. Optionally update user statistics, leaderboards, etc.
    // 4. Send notifications or trigger webhooks
    // ============================================

    // For now, we'll just log and return success since the on-chain update already happened
    const assignmentRecord = {
      id: `assignment-${Date.now()}`,
      nftMint,
      walletAddress,
      guildId,
      tokenNumber,
      transactionSignature,
      metadataUri,
      assignedAt: new Date().toISOString(),
      status: 'confirmed',
    }

    console.log('Guild assignment record created:', assignmentRecord)

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully assigned NFT to ${guildId} guild`,
      data: {
        nftMint,
        assignedGuild: guildId,
        tokenNumber,
        transactionSignature,
        metadataUri,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error in guild assignment API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
