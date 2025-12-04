import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { postgres } from 'vite-plugin-db';

export default defineConfig({
  base: './',
  plugins: [
    postgres({
      // Esto inyectará VITE_DATABASE_URL en tu .env automáticamente
      envPrefix: 'VITE_',
      seed: {
        type: 'sql-script',
        path: './init.sql',
      },
    }),
    react(),
  ],
});
