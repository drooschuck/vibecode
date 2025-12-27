import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react-dom/client',
          '@google/genai',
          'react-markdown',
          'recharts',
          'lucide-react',
          '@monaco-editor/react'
        ]
      }
    }
  };
});