import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { postgres } from 'vite-plugin-db';

export default defineConfig({
  base: '/Horario/', // ✅ NOMBRE EXACTO DE TU REPOSITORIO
  plugins: [
    postgres({
      envPrefix: 'VITE_',
      seed: {
        type: 'sql-script',
        path: './init.sql',
      },
    }),
    react(),
  ],
});
