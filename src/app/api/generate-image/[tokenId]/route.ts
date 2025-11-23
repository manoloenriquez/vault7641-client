import { NextRequest, NextResponse } from 'next/server'
import { buildImageBufferFromTraits } from '@/lib/buildNftImage'

export async function GET(request: NextRequest, { params }: { params: { tokenId: string } }) {
  try {
    const tokenId = parseInt(params.tokenId, 10)

    if (!Number.isFinite(tokenId) || tokenId < 0) {
      return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams
    const guild = searchParams.get('guild') ?? undefined
    const gender = searchParams.get('gender') ?? undefined
    const seed = searchParams.get('seed') ? parseInt(searchParams.get('seed')!, 10) : undefined

    console.log(`[generate-image] Generating image for token ${tokenId}`, { guild, gender, seed })

    const imageBuffer = await buildImageBufferFromTraits(tokenId, {
      guild,
      gender,
      seed,
    })

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('[generate-image] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 },
    )
  }
}

