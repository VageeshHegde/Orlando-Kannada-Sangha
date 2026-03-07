import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

export async function GET() {
	try {
		// Fetch past board members from database, ordered by year
		const { data: pastMembers, error } = await supabase
			.from('past_board_members')
			.select('*')
			.order('year', { ascending: true });

		if (error) {
			console.error('Error fetching past members:', error);
			return json({ error: 'Failed to fetch past members' }, { status: 500 });
		}

		return json({ 
			success: true, 
			members: pastMembers,
			total: pastMembers.length 
		});

	} catch (error) {
		console.error('Past members API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const { name, position, year, image_file } = await request.json();

		if (!name || !position || !year) {
			return json({ error: 'Name, position, and year are required' }, { status: 400 });
		}

		// Verify admin is authenticated
		const { data: { user }, error: authError } = await supabase.auth.getUser();
		
		if (authError || !user) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		// Insert past member (ID will be auto-generated)
		const { data, error } = await supabase
			.from('past_board_members')
			.insert({
				name,
				position,
				year,
				image_file: image_file || null
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating past member:', error);
			return json({ error: 'Failed to create past member' }, { status: 500 });
		}

		return json({ 
			success: true, 
			member: data,
			message: 'Past member created successfully' 
		});

	} catch (error) {
		console.error('Past member creation error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
