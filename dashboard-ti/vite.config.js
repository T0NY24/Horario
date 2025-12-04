import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { postgres } from 'vite-plugin-db';

export default defineConfig({
  plugins: [
    postgres({
      // Esto inyectará VITE_DATABASE_URL en tu .env automáticamente
      envPrefix: 'VITE_',
      seed: {
        type: 'sql-script',
        path: './init.sql', // El archivo que crearemos en el paso 4
      },
    }),
    react(),
  ],
});
