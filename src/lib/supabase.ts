import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function that returns the client, validating at runtime
// This allows build to succeed (Vercel doesn't have env vars during build)
// but will fail at runtime if vars aren't set (which is correct behavior)
function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings → Environment Variables.'
    )
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Lazy initialization - client is created when first used (at runtime, not build time)
let supabaseClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient()
  }
  return supabaseClient
}

// For backward compatibility, export supabase as a getter
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient]
  }
})

// Validate configuration (called at runtime in API routes)
export function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings → Environment Variables.'
    )
  }
}

