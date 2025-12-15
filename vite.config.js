import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Para evitar errores 404 en rutas profundas (ej: /dashboard)
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
