import { createClient } from '@supabase/supabase-js'
const envs = import.meta.env
// Create a single supabase client for interacting with your database
export const supabase = createClient(envs.VITE_SUPABASE_DOMAIN, envs.VITE_SUPABASE_KEY)
