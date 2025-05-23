import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	plugins: [sveltekit()],
	base: './',
	define: {
		'import.meta.env.PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
		'import.meta.env.PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_SUPABASE_ANON_KEY),
		'import.meta.env.RESEND_API_KEY': JSON.stringify(process.env.RESEND_API_KEY)
	},
	optimizeDeps: {
		include: [
			'@smui/button',
			'@smui/textfield',
			'@smui/common',
			'@material/dom',
			'@material/ripple',
			'@material/textfield',
			'@material/floating-label',
			'@material/notched-outline',
			'@material/line-ripple'
		]
	}
});