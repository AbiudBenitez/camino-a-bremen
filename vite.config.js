import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// El sitio se publica en https://abiudbenitez.github.io/camino-a-bremen/, así que
// todas las rutas de los recursos cuelgan de ese prefijo. En desarrollo la base
// es la raíz para que `npm run dev` siga abriendo en http://localhost:5173/.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/camino-a-bremen/' : '/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.js', 'src/**/*.test.jsx'],
    environment: 'node',
  },
}))
