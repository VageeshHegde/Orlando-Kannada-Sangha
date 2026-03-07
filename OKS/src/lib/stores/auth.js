import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import { supabase, auth } from '../supabase.js'

// Create writable stores for authentication state
export const user = writable(null)
export const session = writable(null)
export const loading = writable(true)
/** Set to true when user passes admin check. Cleared on sign out. */
export const isAdmin = writable(false)

function checkAdminAccess(accessToken) {
  if (!accessToken) return
  fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ action: 'check_admin' })
  })
    .then((res) => res.json())
    .then((data) => { if (data?.admin) isAdmin.set(true) })
    .catch(() => {})
}

/** Get current session's access token (for API calls that require auth). */
export function getAccessToken() {
  let token = null
  const unsub = session.subscribe((s) => { token = s?.access_token ?? null })
  unsub()
  return token
}

// Initialize authentication state
export const initAuth = async () => {
  if (!browser) return

  loading.set(true)
  let fallback = setTimeout(() => loading.set(false), 4000)

  try {
    const { session: initialSession } = await auth.getSession()

    if (initialSession) {
      session.set(initialSession)
      user.set(initialSession.user)
      checkAdminAccess(initialSession.access_token)
    }

    loading.set(false)
    clearTimeout(fallback)

    supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        session.set(currentSession)
        user.set(currentSession.user)
        checkAdminAccess(currentSession.access_token)
      } else {
        session.set(null)
        user.set(null)
        isAdmin.set(false)
      }
      loading.set(false)
    })
  } catch {
    loading.set(false)
    if (fallback) clearTimeout(fallback)
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
      
      user.set(null)
      session.set(null)
      isAdmin.set(false)
      return result
    } catch (error) {
      user.set(null)
      session.set(null)
      isAdmin.set(false)
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