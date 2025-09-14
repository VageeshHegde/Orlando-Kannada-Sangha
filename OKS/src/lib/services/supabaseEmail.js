// Supabase email service - handles all email notifications via Supabase
import { supabase, supabaseAdmin } from '$lib/supabase.js';

class SupabaseEmailService {
  
  // Send password reset email (forgot password)
  async notifyUserWithReset(userEmail) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${this.getBaseUrl()}/reset-password?from=zapier`
      });

      if (error) {
        // If user hasn't confirmed email yet, this will fail
        if (error.message.includes('Email not confirmed') || 
            error.message.includes('not confirmed')) {
          return { 
            success: false, 
            error: 'User must confirm email first',
            needsConfirmation: true 
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get base URL for redirects
  getBaseUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Let Supabase handle the site URL configuration
    return '';
  }

}

// Export singleton instance
export const supabaseEmailService = new SupabaseEmailService();

// Export individual methods for convenience
export const {
  notifyUserWithReset
} = supabaseEmailService;