import { defineConfig } from 'vitest/config'

/* Config propia y no la del sitio a propósito: `vite.config.ts` monta React, el
   React Compiler y el plugin del manifest, y ninguno de los tres hace falta para
   comprobar objetos planos. Vitest usa este archivo en vez de aquel. */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
