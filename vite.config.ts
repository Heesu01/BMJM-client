import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: {
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: { overrides: { removeViewBox: false } },
              },
            ],
          },
          replaceAttrValues: {
            '#000': 'currentColor',
            '#000000': 'currentColor',
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: isDev
      ? {
          https: {
            key: fs.readFileSync(
              path.resolve(__dirname, 'cert/localhost-key.pem'),
            ),
            cert: fs.readFileSync(
              path.resolve(__dirname, 'cert/localhost.pem'),
            ),
          },
          port: 3000,
        }
      : { port: 3000 },
  }
})
