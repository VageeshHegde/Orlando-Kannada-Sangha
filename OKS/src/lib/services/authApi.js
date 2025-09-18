/**
 * Client-side service for Supabase Auth API operations
 */

const API_BASE = '/api/auth';

/**
 * Send invitation to a user
 * @param {string} email - User's email address
 * @param {string} redirectTo - Redirect URL after invitation (default: '/register')
 * @returns {Promise<Object>} API response
 */
export async function sendInvitation(email, redirectTo = '/register') {
	try {
		const response = await fetch(API_BASE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'send_invitation',
				data: { email, redirectTo }
			})
		});

		const result = await response.json();
		
		if (!response.ok) {
			throw new Error(result.error || 'Failed to send invitation');
		}

		return result;
	} catch (error) {
		console.error('Send invitation error:', error);
		throw error;
	}
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} API response
 */
export async function updateUserProfile(userId, updates) {
	try {
		const response = await fetch(API_BASE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'update_user_profile',
				data: { userId, updates }
			})
		});

		const result = await response.json();
		
		if (!response.ok) {
			throw new Error(result.error || 'Failed to update user profile');
		}

		return result;
	} catch (error) {
		console.error('Update user profile error:', error);
		throw error;
	}
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} API response
 */
export async function getUser(userId) {
	try {
		const response = await fetch(API_BASE, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: 'get_user',
				data: { userId }
			})
		});

		const result = await response.json();
		
		if (!response.ok) {
			throw new Error(result.error || 'Failed to get user');
		}

		return result;
	} catch (error) {
		console.error('Get user error:', error);
		throw error;
	}
}
