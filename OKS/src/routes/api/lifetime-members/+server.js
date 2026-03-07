import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

export async function GET() {
	try {
		// Fetch lifetime members from database, ordered by name
		const { data: lifetimeMembers, error } = await supabase
			.from('lifetime_members')
			.select('*')
			.order('name', { ascending: true });

		if (error) {
			console.error('Error fetching lifetime members:', error);
			// If table doesn't exist, return empty result instead of error
			if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
				return json({ 
					success: true, 
					members: [],
					total: 0 
				});
			}
			return json({ error: 'Failed to fetch lifetime members' }, { status: 500 });
		}

		return json({ 
			success: true, 
			members: lifetimeMembers,
			total: lifetimeMembers.length 
		});

	} catch (error) {
		console.error('Lifetime members API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const { email, name, tag_line, image_file } = await request.json();

		if (!email || !name || !tag_line) {
			return json({ error: 'Email, name and tag line are required' }, { status: 400 });
		}

		// Verify admin is authenticated
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		
		if (authError || !user) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		// Insert lifetime member (ID will be auto-generated)
		const { data, error } = await supabase
			.from('lifetime_members')
			.insert({
				email,
				name,
				tag_line,
				image_file: image_file || null
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating lifetime member:', error);
			return json({ error: 'Failed to create lifetime member' }, { status: 500 });
		}

		return json({ 
			success: true, 
			member: data,
			message: 'Lifetime member created successfully' 
		});

	} catch (error) {
		console.error('Lifetime member creation error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
