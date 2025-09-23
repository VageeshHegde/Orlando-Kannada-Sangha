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
			case 'magic_link':
				return await sendMagicLink(data);
			case 'update_user_profile':
				return await updateUserProfile(data);
			case 'get_user':
				return await getUser(data);
			case 'get_member_count':
				return await getMemberCount();
			case 'bulk_create_users':
				return await bulkCreateUsers(data);
			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('Auth API Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
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

		return json({
			success: true,
			totalUsers: allUsers.length,
			confirmedUsers: confirmedUsers.length
		});

	} catch (error) {
		console.error('getMemberCount error:', error);
		return json({ error: error.message }, { status: 500 });
	}
}


// Send magic link for authentication
async function sendMagicLink(data) {
	const { email, redirectTo = '/dashboard' } = data;

	if (!email) {
		return json({ error: 'Email is required' }, { status: 400 });
	}

	try {
		// Construct the redirect URL
		const baseUrl = process.env.PUBLIC_SITE_URL || 'https://www.orlandokannadasangha.org';
		const fullRedirectUrl = `${baseUrl}${redirectTo}`;

		// Send magic link
		const { data: result, error } = await supabaseClient.auth.signInWithOtp({
			email: email,
			options: {
				emailRedirectTo: fullRedirectUrl
			}
		});

		if (error) {
			return json({ error: error.message }, { status: 400 });
		}

		return json({ 
			success: true, 
			message: 'Magic link sent to your email!',
			data: result 
		});
	} catch (error) {
		console.error('Magic link error:', error);
		return json({ error: 'Failed to send magic link' }, { status: 500 });
	}
}

// Bulk create users from CSV data
async function bulkCreateUsers(data) {
	if (!supabaseAdmin) {
		return json({ error: 'Admin client not available' }, { status: 500 });
	}

	const { users } = data;
	
	if (!users || !Array.isArray(users) || users.length === 0) {
		return json({ error: 'No users provided' }, { status: 400 });
	}

	const results = {
		successful: [],
		failed: [],
		total: users.length
	};

	// Process each user
	for (const user of users) {
		try {
			// Validate required fields
			if (!user.email || !user.first_name || !user.last_name) {
				results.failed.push({
					email: user.email || 'Unknown',
					error: 'Missing required fields (email, first_name, last_name)'
				});
				continue;
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(user.email)) {
				results.failed.push({
					email: user.email,
					error: 'Invalid email format'
				});
				continue;
			}

			// Create user in Supabase Auth
			const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
				email: user.email,
				email_confirm: true, // Auto-confirm email
				user_metadata: {
					first_name: user.first_name,
					last_name: user.last_name
				}
			});

			if (authError) {
				results.failed.push({
					email: user.email,
					error: authError.message
				});
				continue;
			}

			// Update user profile in the database
			const { error: profileError } = await supabaseAdmin
				.from('profiles')
				.upsert({
					id: authUser.user.id,
					email: user.email,
					first_name: user.first_name,
					last_name: user.last_name,
					updated_at: new Date().toISOString()
				});

			if (profileError) {
				console.error('Profile update error for', user.email, ':', profileError);
				// Don't fail the user creation if profile update fails
			}

			// Add to successful results
			results.successful.push({
				email: user.email,
				user_id: authUser.user.id,
				first_name: user.first_name,
				last_name: user.last_name
			});

		} catch (error) {
			results.failed.push({
				email: user.email || 'Unknown',
				error: error.message || 'Unknown error'
			});
		}
	}

	return json(results);
}


