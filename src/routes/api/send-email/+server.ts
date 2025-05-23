// src/routes/api/send-email/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { supabase, resend } from '$lib';

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
	const { to, subject, body } = await request.json();

	if (!to || !subject || !body) {
		return json(
			{ success: false, message: 'Missing required fields.' },
			{ status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
		);
	}

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
		return json(
			{ success: false, message: `Resend Error: ${err.message}` },
			{ status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
		);
	}
};