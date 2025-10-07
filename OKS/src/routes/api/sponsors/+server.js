import { supabase } from '$lib/supabase.js';
import { json } from '@sveltejs/kit';

/**
 * GET /api/sponsors
 * Fetch all sponsors from the sponsors table
 */
export async function GET({ request }) {
	try {
		// Fetch all sponsors from the table
		const { data: sponsors, error, count } = await supabase
			.from('sponsors')
			.select('*', { count: 'exact' })
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching sponsors:', error);
			return json({ 
				error: 'Failed to fetch sponsors',
				details: error.message,
				sponsors: [],
				total: 0
			}, { status: 500 });
		}

		return json({
			sponsors: sponsors || [],
			total: count || 0
		});

	} catch (error) {
		console.error('Unexpected error in GET /api/sponsors:', error);
		return json({ 
			error: 'Internal server error',
			details: error.message,
			sponsors: [],
			total: 0
		}, { status: 500 });
	}
}
