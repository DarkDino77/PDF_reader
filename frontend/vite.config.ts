import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    host: true,    // This allows the container to expose the port to your Windows host
    port: 5173,    // The internal port that matches your docker-compose.yml
    proxy: {
      '/PDF': {
        target: 'http://backend:8080', // 'backend' must match the service name in your docker-compose.yml
        changeOrigin: true,

      }
    }
  }
})