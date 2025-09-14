import { createClient } from '@supabase/supabase-js'
import { browser } from '$app/environment'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'

// Regular client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations (requires service role key)
// Only create on server side to avoid multiple client instances
export const supabaseAdmin = typeof window === 'undefined' ? createClient(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder_service',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null

// Auth helper functions
export const auth = {
  // Sign up new user
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  async signOut() {
    try {
      // Check if we have a valid session first
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // No session exists, but still clear local storage
        console.log('No active session found, clearing local storage')
        this.clearLocalStorage()
        return { error: null }
      }

      // Try to sign out with local scope first
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) {
        console.warn('Local signout failed, trying global:', error.message)
        // Fallback to global scope
        const { error: globalError } = await supabase.auth.signOut({ scope: 'global' })
        // Clear local storage regardless of server response
        this.clearLocalStorage()
        return { error: globalError }
      }
      
      // Clear local storage after successful logout
      this.clearLocalStorage()
      return { error }
    } catch (error) {
      // Handle specific session missing error
      if (error.message && error.message.includes('Auth session missing')) {
        console.log('Session already expired/missing, clearing local storage')
        this.clearLocalStorage()
        return { error: null }
      }
      console.error('Signout error:', error.message || error)
      // Clear local storage even on error
      this.clearLocalStorage()
      return { error }
    }
  },

  // Clear Supabase local storage
  clearLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Clear all Supabase-related localStorage items
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (
          key.includes('supabase') || 
          key.includes('sb-') ||
          key.includes('auth-token') ||
          key.includes('refresh-token')
        )) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
      })
      
      // Also clear sessionStorage
      const sessionKeysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && (
          key.includes('supabase') || 
          key.includes('sb-') ||
          key.includes('auth-token') ||
          key.includes('refresh-token')
        )) {
          sessionKeysToRemove.push(key)
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key)
      })
      
      console.log('Cleared Supabase local and session storage')
    }
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Reset password
  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  // Update user profile or password
  async updateUser(updates) {
    const { data, error } = await supabase.auth.updateUser(updates)
    return { data, error }
  }
}

// Database helper functions
export const db = {
  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Create user profile
  async createUserProfile(profile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    return { data, error }
  }
}