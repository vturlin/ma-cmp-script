import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'CookieBannerWidget',
      fileName: () => 'welcome-widget.js',
      formats: ['iife']
    },
    minify: 'esbuild', // ✅ déjà actif par défaut, mais explicite c'est mieux
    reportCompressedSize: true, // ✅ affiche la taille compressée dans les logs de build
  },
  define: { 'process.env.NODE_ENV': '"production"' }
})
