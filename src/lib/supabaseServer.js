import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookies().get(name)?.value
        },
      },
    }
  )
}
