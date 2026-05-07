import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgnosahbbkxvnhlngxba.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbm9zYWhiYmt4dm5obG5neGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDkyOTQsImV4cCI6MjA5MDY4NTI5NH0.uGgKok_HnZe1d1899KHnNGgNnehZEZuL0q_FcRjXkJw'

// In a real app, this would crash if defaults are used, but we handle it in components or middleware
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
