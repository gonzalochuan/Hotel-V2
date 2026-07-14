import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
}

const supabaseUrl: string = process.env.SUPABASE_URL
const supabaseServiceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
})

// A client whose requests carry the caller's own JWT in the Authorization
// header instead of the service role key, so Postgres RLS policies (e.g.
// auth.uid() = user_id on bookings) are enforced as that user rather than
// bypassed. Use this for any write that must be scoped to the request's
// authenticated user.
export function createUserScopedClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
}

export const ROOM_IMAGES_BUCKET = process.env.SUPABASE_ROOM_IMAGES_BUCKET || 'room-images'
