import { NextRequest, NextResponse } from 'next/server'
import { buildImageBufferFromTraits } from '@/lib/buildNftImage'
import { verifySignedToken, GenerationSignedPayload } from '@/lib/security/param-signature'

export async function GET(request: NextRequest, { params }: { params: Promise<{ tokenId: string }> }) {
  try {
    const { tokenId: tokenIdStr } = await params
    const tokenId = parseInt(tokenIdStr, 10)

    if (!Number.isFinite(tokenId) || tokenId < 0) {
      return NextResponse.json({ error: 'Invalid token ID' }, { status: 400 })
    }

    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    const signature = searchParams.get('signature')

    const verification = verifySignedToken<GenerationSignedPayload>(token, signature)
    if (!verification.valid || !verification.payload) {
      return NextResponse.json({ error: verification.error ?? 'Invalid signature' }, { status: 401 })
    }

    const { payload } = verification

    if (payload.type !== 'generation') {
      return NextResponse.json({ error: 'Token type mismatch' }, { status: 400 })
    }

    if (payload.tokenNumber !== tokenId) {
      return NextResponse.json({ error: 'Token number mismatch' }, { status: 400 })
    }

    const { guild, gender, seed } = payload

    console.log(`[generate-image] Generating image for token ${tokenId}`, {
      guild,
      gender,
      seed,
      wallet: payload.walletAddress,
    })

    const imageBuffer = await buildImageBufferFromTraits(tokenId, {
      guild,
      gender,
      seed,
    })

    return new NextResponse(new Uint8Array(imageBuffer), {
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
