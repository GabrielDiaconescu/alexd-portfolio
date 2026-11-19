import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Același alias ca în tsconfig.json: "@/*" -> "./*"
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)).replace(/[\\/]$/, '') },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules/**', '.next/**', 'dist/**'],
  },
})
