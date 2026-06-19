import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No backend required — everything is mocked in src/lib/mockApi.ts.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
