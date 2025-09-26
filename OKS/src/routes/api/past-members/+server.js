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
