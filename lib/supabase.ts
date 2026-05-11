import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcmrjgmsbwxfozlzhwql.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbXJqZ21zYnd4Zm96bHpod3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0NzIxNzQsImV4cCI6MjA5NDA0ODE3NH0.WKa8pTJLB8l7d3UBXp5PKA4MWgDj2YJXxHRmFCVEClI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})