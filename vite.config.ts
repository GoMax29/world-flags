import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-state': ['zustand'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Use esbuild for minification (default, faster than terser)
    minify: 'esbuild',
  },
  // Optimize dev server
  server: {
    port: 5173,
    host: true,
  },
  // Enable JSON imports
  json: {
    stringify: true,
  },
});
