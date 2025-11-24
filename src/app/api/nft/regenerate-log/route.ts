import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

type RegenerateLogEntry = {
  tokenId: number
  nftMint: string
  guild: string
  gender: string
  seed: number
  metadataUri: string
  imageUri: string
  transactionSignature: string
  walletAddress: string
  timestamp: string
}

/**
 * POST /api/nft/regenerate-log
 *
 * Logs a regeneration event to Supabase for audit and persistence.
 * Creates a table if it doesn't exist (requires manual setup first).
 */
export async function POST(req: NextRequest) {
  try {
    const body: RegenerateLogEntry = await req.json()
    const {
      tokenId,
      nftMint,
      guild,
      gender,
      seed,
      metadataUri,
      imageUri,
      transactionSignature,
      walletAddress,
      timestamp,
    } = body

    // Validate required fields
    if (!tokenId || !nftMint || !guild || !gender || !metadataUri || !transactionSignature) {
      return NextResponse.json(
        { error: 'Missing required fields: tokenId, nftMint, guild, gender, metadataUri, transactionSignature' },
        { status: 400 },
      )
    }

    const supabase = getSupabaseServerClient()

    // Insert log entry
    const { data, error } = await supabase
      .from('nft_regeneration_logs')
      .insert({
        token_id: tokenId,
        nft_mint: nftMint,
        guild,
        gender,
        seed,
        metadata_uri: metadataUri,
        image_uri: imageUri,
        transaction_signature: transactionSignature,
        wallet_address: walletAddress,
        created_at: timestamp || new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('Failed to log regeneration event:', error)
      // Don't fail the request if logging fails
      return NextResponse.json(
        {
          success: false,
          error: 'Logging failed (non-critical)',
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      id: data?.[0] ? (data[0] as Record<string, unknown>).id : undefined,
    })
  } catch (error) {
    console.error('Error logging regeneration event:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/nft/regenerate-log?tokenId=X&mint=Y
 *
 * Retrieves regeneration history for a specific NFT.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tokenId = searchParams.get('tokenId')
    const mint = searchParams.get('mint')

    if (!tokenId && !mint) {
      return NextResponse.json({ error: 'tokenId or mint required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    let query = supabase.from('nft_regeneration_logs').select('*').order('created_at', { ascending: false })

    if (tokenId) {
      query = query.eq('token_id', parseInt(tokenId, 10))
    }
    if (mint) {
      query = query.eq('nft_mint', mint)
    }

    const { data, error } = await query.limit(100)

    if (error) {
      console.error('Failed to fetch regeneration logs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Error fetching regeneration logs:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
