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

/**
 * DELETE /api/sponsors?id=...
 */
export async function DELETE({ url }) {
	try {
		const id = url.searchParams.get('id');
		if (!id) {
			return json({ error: 'id is required' }, { status: 400 });
		}

		const { data: { user }, error: authError } = await supabase.auth.getUser();
		if (authError || !user) {
			return json({ error: 'Authentication required' }, { status: 401 });
		}

		const { error } = await supabase
			.from('sponsors')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Error deleting sponsor:', error);
			return json({ error: 'Failed to delete sponsor' }, { status: 500 });
		}

		return json({ success: true, message: 'Sponsor deleted' });
	} catch (error) {
		console.error('Delete sponsor error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
