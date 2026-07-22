import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://zqyoxmcaxnvyfmcvppeq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxeW94bWNheG52eWZtY3ZwcGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjY5NTgsImV4cCI6MjEwMDMwMjk1OH0.K6fTsExHN7Upjq_ACkg4EwelTApOt1_YcyQWN67LwEc'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)