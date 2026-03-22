import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        'src/base_de_datos/*.json', // Excluimos la base de datos de comprobaciones
        '**/*.json',                
        'node_modules/**',
        'dist/**'
      ]
    }
  }
});