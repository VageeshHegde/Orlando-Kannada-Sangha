// User import service for handling Zapier data and bulk user creation
import { auth, supabaseAdmin } from '$lib/supabase.js';

class UserImportService {
  
  // Create a single user from Zapier data
  async createUserFromZapier(zapierData) {
    try {
      // Normalize the data
      const userData = this.normalizeZapierData(zapierData);
      
      // Invite user (duplicate checking is handled in createSupabaseUser)
      return await this.createSupabaseUser(userData);
      
    } catch (error) {
      console.error('❌ Error inviting user from Zapier:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Normalize Zapier data to standard format
  normalizeZapierData(zapierData) {
    // Handle different naming conventions from various Zapier sources
    const email = zapierData.email || zapierData.Email || zapierData.emailAddress;
    
    // Handle name fields
    let firstName = zapierData.firstName || zapierData.first_name || zapierData['First Name'];
    let lastName = zapierData.lastName || zapierData.last_name || zapierData['Last Name'];
    
    // If no first/last name, try to split full name
    if (!firstName && !lastName && zapierData.name) {
      const nameParts = zapierData.name.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Handle phone number variations
    const phone = zapierData.phone || zapierData.phoneNumber || zapierData['Phone Number'] || zapierData.Phone;

    return {
      email: email?.toLowerCase().trim(),
      firstName: firstName?.trim() || '',
      lastName: lastName?.trim() || '',
      phone: phone?.trim() || '',
      source: zapierData.source || 'Zapier Import',
      originalData: zapierData
    };
  }

  // Invite user in Supabase (better than direct creation)
  async createSupabaseUser(userData) {
    try {
      // Prepare metadata for the invitation
      const userMetadata = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        source: userData.source,
        created_via: 'zapier_invite',
        import_date: new Date().toISOString(),
        original_zapier_data: userData.originalData
      };

      // Invite user (will send invitation email with signup link)
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        userData.email,
        {
          data: userMetadata,
          redirectTo: `${this.getBaseUrl()}/register?from=invite&name=${encodeURIComponent(userData.firstName + ' ' + userData.lastName)}`
        }
      );

      if (error) {
        // Check if it's a duplicate user error
        if (error.message.includes('User already registered') || 
            error.message.includes('already registered') ||
            error.message.includes('already exists')) {
          return {
            success: false,
            error: 'User already exists',
            email: userData.email
          };
        }
        throw new Error(error.message);
      }

      return {
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          created_at: data.user?.created_at,
          invited: true
        }
      };

    } catch (error) {
      throw new Error(`Failed to invite user: ${error.message}`);
    }
  }

  // Get base URL for redirects
  getBaseUrl() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  // Bulk import users from an array
  async bulkImportUsers(usersArray) {
    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    for (const userData of usersArray) {
      try {
        const result = await this.createUserFromZapier(userData);
        
        if (result.success) {
          results.success.push({
            email: result.user.email,
            name: `${result.user.firstName} ${result.user.lastName}`.trim(),
            invited: true
          });
        } else if (result.error === 'User already exists') {
          results.skipped.push({
            email: result.email,
            reason: 'Already exists'
          });
        } else {
          results.failed.push({
            email: userData.email,
            error: result.error
          });
        }
      } catch (error) {
        results.failed.push({
          email: userData.email || 'Unknown',
          error: error.message
        });
      }
    }

    return results;
  }

  // Get import statistics
  getImportStats(results) {
    return {
      total: results.success.length + results.failed.length + results.skipped.length,
      invited: results.success.length,
      failed: results.failed.length,
      skipped: results.skipped.length,
      successRate: ((results.success.length / (results.success.length + results.failed.length + results.skipped.length)) * 100).toFixed(1)
    };
  }
}

// Export singleton instance
export const userImportService = new UserImportService();

// Export class for custom instances
export { UserImportService };