import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import { supabase, auth } from '../supabase.js'

// Create writable stores for authentication state
export const user = writable(null)
export const session = writable(null)
export const loading = writable(true)

// Initialize authentication state
export const initAuth = async () => {
  if (!browser) return

  loading.set(true)

  try {
    // Get initial session
    console.log('🔍 Initializing auth...')
    console.log('🔍 Current URL:', window.location.href)
    console.log('🔍 URL params:', window.location.search)
    
    // Check for invitation redirect (no magic link processing)
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('from') === 'invite') {
      console.log('🎯 Invitation redirect detected - user should signup manually')
      // Let the signup page handle the invitation
    }
    
    const { session: initialSession } = await auth.getSession()
    
    console.log('🔍 Initial session check:', initialSession ? 'Found session' : 'No session')
    
    if (initialSession) {
      console.log('🔍 Setting user:', initialSession.user?.email || 'No email')
      session.set(initialSession)
      user.set(initialSession.user)
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Log only the event type, not sensitive session data
      console.log('Auth state changed:', event, currentSession ? 'User logged in' : 'User logged out')
      
      if (currentSession) {
        session.set(currentSession)
        user.set(currentSession.user)
      } else {
        session.set(null)
        user.set(null)
      }
      
      // Always set loading to false after auth state change
      loading.set(false)
    })
  } catch (error) {
    console.error('Error initializing auth:', error)
    loading.set(false)
  }
}

// Auth action functions
export const authActions = {
  async signIn(email, password) {
    loading.set(true)
    try {
      const result = await auth.signIn(email, password)
      // Don't set loading to false here - let the auth state change handle it
      return result
    } catch (error) {
      loading.set(false)
      throw error
    }
  },

  async signUp(email, password, userData = {}) {
    loading.set(true)
    try {
      const result = await auth.signUp(email, password, userData)
      // Don't set loading to false here - let the auth state change handle it
      return result
    } catch (error) {
      loading.set(false)
      throw error
    }
  },

  async signOut() {
    loading.set(true)
    try {
      const result = await auth.signOut()
      
      // Always clear local state regardless of server response
      user.set(null)
      session.set(null)
      
      // Don't set loading to false here - let the auth state change handle it
      return result
    } catch (error) {
      console.warn('Signout error, clearing local state:', error.message || error)
      // Clear local state even if server signout fails
      user.set(null)
      session.set(null)
      loading.set(false)
      return { error }
    }
  },

  async resetPassword(email) {
    const result = await auth.resetPassword(email)
    return result
  },

  async updatePassword(newPassword) {
    loading.set(true)
    try {
      const result = await auth.updatePassword(newPassword)
      loading.set(false)
      return result
    } catch (error) {
      loading.set(false)
      throw error
    }
  },

  async updateProfile(userData) {
    loading.set(true)
    try {
      const result = await auth.updateProfile(userData)
      loading.set(false)
      return result
    } catch (error) {
      loading.set(false)
      throw error
    }
  }
}