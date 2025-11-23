import { createClient, SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

/**
 * Get or create a Supabase client for server-side operations.
 * Uses service role key for full access to storage buckets.
 * 
 * Required environment variables:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY: Service role key (not anon key!)
 */
function createSupabaseServerClient(): SupabaseClient {
  if (cachedClient) {
    return cachedClient
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase environment variables are not configured. ' +
      'Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.'
    )
  }

  // Warn if using anon key instead of service role key
  if (process.env.SUPABASE_SERVICE_ROLE_KEY === undefined && process.env.SUPABASE_ANON_KEY) {
    console.warn(
      '⚠️  Using SUPABASE_ANON_KEY instead of SUPABASE_SERVICE_ROLE_KEY. ' +
      'Service role key is required for server-side storage access.'
    )
  }

  cachedClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })

  return cachedClient
}

/**
 * Get the Supabase server client instance.
 * Creates a new client if one doesn't exist.
 */
export function getSupabaseServerClient(): SupabaseClient {
  return createSupabaseServerClient()
}

