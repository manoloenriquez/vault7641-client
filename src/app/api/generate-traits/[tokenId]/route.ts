import { NextRequest, NextResponse } from 'next/server'
import { generateTraitAttributes } from '@/lib/buildNftImage'

export async function GET(request: NextRequest, { params }: { params: Promise<{ tokenId: string }> }) {
  try {
    const { tokenId: tokenIdStr } = await params
    const tokenId = Number.parseInt(tokenIdStr, 10)

    if (!Number.isFinite(tokenId) || tokenId < 0) {
      return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams
    const guild = searchParams.get('guild') ?? undefined
    const gender = searchParams.get('gender') ?? undefined
    const seedParam = searchParams.get('seed')
    const seed = seedParam ? Number.parseInt(seedParam, 10) : undefined

    const attributes = await generateTraitAttributes(tokenId, {
      guild,
      gender,
      seed,
    })

    return NextResponse.json({ attributes })
  } catch (error) {
    console.error('[generate-traits] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate traits' },
      { status: 500 },
    )
  }
}


