import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'app',
  publicDir: '../public',
  // Portable relative default; Pages can explicitly set its repository/custom-domain base.
  base: process.env.VITE_BASE_PATH || './',
  plugins: [react()],
  build: { target: 'es2022', outDir: '../dist', emptyOutDir: true },
});
