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
