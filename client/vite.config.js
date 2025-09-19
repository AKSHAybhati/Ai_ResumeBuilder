import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [
      tailwindcss({
        config: {
          theme: {
            extend: {
              backgroundOpacity: ['responsive', 'hover', 'focus'],
            },
          },
          variants: {
            backgroundOpacity: ['responsive', 'hover', 'focus'],
          },
        },
      }),
      react(),
    ],
    
    build: {
      minify: isProduction,
      sourcemap: !isProduction,
      
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['framer-motion', 'react-toastify'],
            pdf: ['jspdf', 'html2canvas']
          }
        }
      },
      
      esbuild: {
        drop: isProduction ? ['console', 'debugger'] : []
      }
    },
    
    server: {
      port: 5173,
      open: false
    }
  }
})