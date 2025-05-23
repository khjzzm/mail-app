import { json, type RequestHandler } from '@sveltejs/kit';
import { getResendClient } from '$lib/resend';
import { getSupabaseClient } from '$lib/supabase';

export const OPTIONS: RequestHandler = async () => {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	});
};

export const POST: RequestHandler = async ({ request }) => {
	console.log('📦 PUBLIC_SUPABASE_URL:', import.meta.env.PUBLIC_SUPABASE_URL);
	console.log('📦 PUBLIC_SUPABASE_ANON_KEY:', import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
	console.log('📦 RESEND_API_KEY:', import.meta.env.RESEND_API_KEY);

	const { to, subject, body } = await request.json();

	if (!to || !subject || !body) {
		return json(
			{ success: false, message: 'Missing required fields.' },
			{ status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
		);
	}

	const supabase = getSupabaseClient();

	const { error: dbError } = await supabase.from('emails').insert([
		{ to_email: to, subject, body }
	]);

	if (dbError) {
		return json(
			{ success: false, message: `DB Error: ${dbError.message}` },
			{ status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
		);
	}

	try {
		const resend = getResendClient();

		await resend.emails.send({
			from: 'Your Name <onboarding@resend.dev>',
			to,
			subject,
			html: `<p>${body}</p>`
		});

		return json(
			{ success: true, message: 'Email sent and saved.' },
			{ status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
		);
	} catch (err: any) {
		console.error('Resend Error:', {
			name: err?.name,
			message: err?.message,
			stack: err?.stack
		});

		return json(
			{
				success: false,
				message: 'Resend Error',
				error: {
					name: err?.name,
					message: err?.message,
					stack: err?.stack
				}
			},
			{ status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
		);
	}
};