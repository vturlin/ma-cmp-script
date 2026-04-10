import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015', /* LA MAGIE POUR LES ANCIENS IPHONES EST ICI */
    rollupOptions: {
      output: {
        entryFileNames: `cmp-bundle.js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
        format: 'iife' 
      }
    }
  }
})
