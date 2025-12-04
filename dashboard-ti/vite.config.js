import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Horario/', // ✅ NOMBRE EXACTO DE TU REPOSITORIO
  plugins: [
    react(),
  ],
});
