import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl()
  ],
  build: {
    outDir: path.resolve(__dirname, '../VGamepadWeb.WinForm/wwwroot'),
    emptyOutDir: true,
  }
})
