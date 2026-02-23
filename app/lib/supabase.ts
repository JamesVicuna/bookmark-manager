import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

export const createSupabaseClient = async () => {
  const {getToken} = await auth();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      // Session accessed from Clerk SDK, either as Clerk.session (vanilla
      // JavaScript) or useSession (React)
      accessToken: async () => getToken() ?? null,
    }
  )
}