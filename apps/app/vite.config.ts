import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 2081,
    strictPort: true
  }
  ,
  preview: {
    port: 2081,
    strictPort: true
  }
});
