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
    
    
    const { session: initialSession } = await auth.getSession()
    
    if (initialSession) {
      session.set(initialSession)
      user.set(initialSession.user)
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, currentSession) => {
      
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
    loading.set(false)
  }
}

// Auth action functions
export const authActions = {
  async sendMagicLink(email, redirectTo = '/') {
    loading.set(true)
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'magic_link',
          data: {
            email: email,
            redirectTo: redirectTo
          }
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send magic link')
      }
      
      loading.set(false)
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
      // Clear local state even if server signout fails
      user.set(null)
      session.set(null)
      loading.set(false)
      return { error }
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