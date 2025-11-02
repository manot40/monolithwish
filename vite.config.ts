import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html}', '**/assets/**/*'],
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
			}
		})
	]
});
