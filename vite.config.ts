// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig(({ mode }) => {
  // You can still log the mode for debugging purposes
  console.log(`Running in ${mode} mode`);

  return {
    plugins: [sveltekit(), svelteTesting()],
    envPrefix: 'VITE_', // Ensure only env variables with this prefix are accessible via import.meta.env
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest-setup.ts',
    },
    define: {
      // If you need to pass process.env variables from the node environment, you can include them here
      // 'process.env': process.env,
    },
  };
});
