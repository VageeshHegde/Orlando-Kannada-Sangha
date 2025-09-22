import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Use environment variables
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client for regular operations
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

// Create Supabase admin client for admin operations (if service role key is available)
const supabaseAdmin = supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
}) : null;

export async function POST({ request }) {
	try {
		const { action, data } = await request.json();

		switch (action) {
			case 'send_invitation':
				return await sendInvitation(data);
			case 'send_bulk_invitations':
				return await sendBulkInvitations(data);
			case 'update_user_profile':
				return await updateUserProfile(data);
			case 'get_user':
				return await getUser(data);
			case 'get_member_count':
				return await getMemberCount();
			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('Auth API Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

async function sendInvitation(data) {
	const { email, redirectTo = '/register' } = data;

	if (!email) {
		return json({ error: 'Email is required' }, { status: 400 });
	}

	try {
		// Use admin client if available, otherwise use regular client
		const client = supabaseAdmin || supabaseClient;
		
		if (supabaseAdmin) {
			// Use admin invite function if service role key is available
			const { data: result, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
				redirectTo: `https://www.orlandokannadasangha.org${redirectTo}?email=${encodeURIComponent(email)}&from=invite`
			});

			if (error) {
				return json({ error: error.message }, { status: 400 });
			}

			return json({ 
				success: true, 
				message: 'Invitation sent successfully',
				user: result.user 
			});
		} else {
			// Fallback to signInWithOtp for invitation (magic link)
			const { data: result, error } = await supabaseClient.auth.signInWithOtp({
				email: email,
				options: {
					emailRedirectTo: `https://www.orlandokannadasangha.org${redirectTo}?email=${encodeURIComponent(email)}&from=invite`
				}
			});

			if (error) {
				return json({ error: error.message }, { status: 400 });
			}

			return json({ 
				success: true, 
				message: 'Invitation sent successfully',
				data: result 
			});
		}
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}

async function sendBulkInvitations(data) {
	const { emails, redirectTo = '/register', delay = 1000 } = data;

	if (!emails || !Array.isArray(emails) || emails.length === 0) {
		return json({ error: 'Emails array is required and must not be empty' }, { status: 400 });
	}

	if (!supabaseAdmin) {
		return json({ error: 'Admin access required for bulk invitations' }, { status: 403 });
	}

	const results = {
		successful: [],
		failed: [],
		total: emails.length,
		processed: 0
	};

	try {
		// Process emails with delay to avoid rate limiting
		for (let i = 0; i < emails.length; i++) {
			const email = emails[i].trim();
			
			if (!email) {
				results.failed.push({
					email: email,
					error: 'Empty email address'
				});
				results.processed++;
				continue;
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				results.failed.push({
					email: email,
					error: 'Invalid email format'
				});
				results.processed++;
				continue;
			}

			try {
				const { data: result, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
					redirectTo: `https://www.orlandokannadasangha.org${redirectTo}?email=${encodeURIComponent(email)}&from=invite`
				});

				if (error) {
					results.failed.push({
						email: email,
						error: error.message
					});
				} else {
					results.successful.push({
						email: email,
						user: result.user
					});
				}
			} catch (error) {
				results.failed.push({
					email: email,
					error: error.message
				});
			}

			results.processed++;

			// Add delay between invitations to avoid rate limiting
			if (i < emails.length - 1 && delay > 0) {
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}

		return json({
			success: true,
			message: `Bulk invitations processed. ${results.successful.length} successful, ${results.failed.length} failed.`,
			results: results
		});

	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}

async function updateUserProfile(data) {
	const { userId, email, updates } = data;

	if (!supabaseAdmin) {
		return json({ error: 'Admin access required for this operation' }, { status: 403 });
	}

	try {
		let targetUserId = userId;

		// If no userId provided but email is provided, find user by email
		if (!targetUserId && email) {
			// List users and find by email
			const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
			
			if (listError) {
				console.error('Error listing users:', listError);
				return json({ error: 'Failed to find user' }, { status: 500 });
			}

			// Find user by email
			const user = usersData.users.find(u => u.email === email);
			
			if (!user) {
				return json({ error: 'User not found' }, { status: 404 });
			}

			targetUserId = user.id;
		}

		if (!targetUserId) {
			return json({ error: 'User ID or email is required' }, { status: 400 });
		}

		if (!updates) {
			return json({ error: 'Updates are required' }, { status: 400 });
		}

		const { data: result, error } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, updates);

		if (error) {
			return json({ error: error.message }, { status: 400 });
		}

		return json({ 
			success: true, 
			message: 'User profile updated successfully',
			user: result.user 
		});
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}

async function getUser(data) {
	const { userId } = data;

	if (!userId) {
		return json({ error: 'User ID is required' }, { status: 400 });
	}

	if (!supabaseAdmin) {
		return json({ error: 'Admin access required for this operation' }, { status: 403 });
	}

	try {
		const { data: result, error } = await supabaseAdmin.auth.admin.getUserById(userId);

		if (error) {
			return json({ error: error.message }, { status: 400 });
		}

		return json({ 
			success: true, 
			user: result.user 
		});
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}

async function getMemberCount() {
	if (!supabaseAdmin) {
		console.error('Supabase admin client not available - check SUPABASE_SERVICE_ROLE_KEY');
		return json({ error: 'Admin access required for this operation' }, { status: 403 });
	}

	try {
		// Get all users with pagination to ensure we get all users
		let allUsers = [];
		let page = 1;
		const perPage = 1000;
		let hasMore = true;

		while (hasMore) {
			const { data: usersData, error } = await supabaseAdmin.auth.admin.listUsers({
				page: page,
				perPage: perPage
			});

			if (error) {
				return json({ error: error.message }, { status: 400 });
			}

			allUsers = allUsers.concat(usersData.users);
			
			// If we got less than perPage users, we've reached the end
			hasMore = usersData.users.length === perPage;
			page++;
		}

		// Count confirmed users (fully active users)
		const confirmedUsers = allUsers.filter(user => 
			user.email_confirmed_at !== null && 
			user.confirmed_at !== null
		);

		// Count invited users (users who were invited but haven't confirmed yet)
		const invitedUsers = allUsers.filter(user => 
			user.email_confirmed_at === null && user.confirmed_at === null
		);

		return json({
			success: true,
			totalUsers: allUsers.length,
			confirmedUsers: confirmedUsers.length,
			invitedUsers: invitedUsers.length
		});

	} catch (error) {
		console.error('getMemberCount error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}


