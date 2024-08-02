import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import {svelteTesting} from '@testing-library/svelte/vite'

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	server: {
		headers: {
		  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
		  'Cross-Origin-Embedder-Policy': 'unsafe-none'
		}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
	},
});
