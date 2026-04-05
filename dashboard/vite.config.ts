import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_SPARQL_PROXY_TARGET
  const proxyRepositoryPath = env.VITE_SPARQL_PROXY_PATH

  if (!proxyTarget) {
    throw new Error('Missing VITE_SPARQL_PROXY_TARGET. Set it in .env.local or .env.')
  }

  if (!proxyRepositoryPath) {
    throw new Error('Missing VITE_SPARQL_PROXY_PATH. Set it in .env.local or .env.')
  }

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/sparql': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: requestPath => requestPath.replace(/^\/sparql/, proxyRepositoryPath),
        },
      },
    },
  }
})
