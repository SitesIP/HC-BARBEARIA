import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    strictPort: false,
    open: false,
    headers: {
      'Cache-Control': 'no-store',
    },
  },
});
