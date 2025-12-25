
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Change 'your-repo-name' to your actual GitHub repository name
  // If deploying to a custom domain or username.github.io, set base to '/'
  base: './', 
  build: {
    outDir: 'dist',
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
