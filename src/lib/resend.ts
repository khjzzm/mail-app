// src/lib/resend.ts
import { Resend } from 'resend';

let client: Resend | null = null;

export function getResendClient() {
	if (!client) {
		const apiKey = import.meta.env.PUBLIC_RESEND_API_KEY;
		if (!apiKey) {
			throw new Error('Missing PUBLIC_RESEND_API_KEY');
		}
		client = new Resend(apiKey);
	}
	return client;
}