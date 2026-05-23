import { createClient } from '@supabase/supabase-js'
import { env } from '@/shared/constants/env'

const isConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey)

export const supabaseClient = isConfigured
  ? createClient(env.supabaseUrl, env.supabaseAnonKey)
  : null
