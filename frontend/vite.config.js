import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      /* Serve the manifest during `vite dev` so no 404 in the browser */
      devOptions: {
        enabled: true,
        type: 'module',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/tutor\/.*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'tutor-api', networkTimeoutSeconds: 5 },
          },
        ],
      },

      manifest: {
        name: 'AI Tutor',
        short_name: 'AI Tutor',
        description: 'Personalized adaptive AI tutor for rural students',
        theme_color: '#1F4D3A',
        background_color: '#EEF2F0',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-recharts': ['recharts'],
          'vendor-i18n':     ['i18next', 'react-i18next'],
        },
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
})
