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

export async function getPublicUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single();

  if (data) return data;

  // no row yet — create one from auth metadata (handles accounts created before signup fix)
  const meta = user.user_metadata ?? {};
  const { data: newUser } = await supabase
    .from('users')
    .insert({
      name: meta.name ?? '',
      email: user.email,
      university: meta.university ?? '',
      graduation_year: meta.graduation_year ?? null,
    })
    .select()
    .single();

  return newUser;
}