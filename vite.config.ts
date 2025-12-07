import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Ensure unique filenames with content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
  // Preview server headers (for testing builds locally)
  preview: {
    headers: {
      // Don't cache HTML - always fetch fresh
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  },
  // Enable JSON imports
  json: {
    stringify: true,
  },
});
