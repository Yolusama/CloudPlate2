import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    react(),
    electron({
        entry: 'src/electron/index.js'
    })
  ],
  server: {
    port: 8085
  },
  base:"./",
  "build":{
    outDir: "dist"
  }
});
