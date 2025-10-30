import { defineConfig } from 'vite'
import fs from 'fs';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // https: {
    //   key: fs.readFileSync('./.cert/key.pem'),
    //   cert: fs.readFileSync('./.cert/cert.pem'),
    // },
    allowedHosts: ['.ngrok-free.app']
  },
  plugins: [react()],
})
