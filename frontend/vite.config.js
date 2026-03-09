import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-ui': ['react-icons', 'react-toastify', 'framer-motion'],
          'vendor-utils': ['axios', 'react-infinite-scroll-component', 'react-loader-spinner']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})
