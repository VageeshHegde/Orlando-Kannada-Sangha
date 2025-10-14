import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase.js';

export async function GET() {
	try {
		const { data, error } = await supabase
			.from('present_board_members')
			.select('*');

		if (error) {
			console.error('Error fetching present board members:', error);
			return json({ error: 'Failed to fetch present board members' }, { status: 500 });
		}

		// Custom sorting: President, Vice President, Secretary, Treasurer
		const positionOrder = ['President', 'Vice President', 'Secretary', 'Treasurer'];
		const sortedMembers = (data || []).sort((a, b) => {
			const aIndex = positionOrder.indexOf(a.position);
			const bIndex = positionOrder.indexOf(b.position);
			
			// If position not found in order, put at end
			if (aIndex === -1 && bIndex === -1) return 0;
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			
			return aIndex - bIndex;
		});

		return json({ members: sortedMembers });
	} catch (error) {
		console.error('Exception in GET /api/present-board-members:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}

