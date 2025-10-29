import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { federation } from '@module-federation/vite';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/gastos',

  server: {
    port: 4202,
    host: 'localhost',
    hmr: {
      overlay: true,
    },
    cors: true,
    fs: {
      allow: ['..']
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  },

  preview: {
    port: 4302,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    federation({
      name: 'gastos',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
        './App': path.resolve(__dirname, './src/app/app.tsx'),
        './ModuleInfo': path.resolve(__dirname, './src/app/components/ModuleInfo.tsx'),
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^19.0.0',
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.29.0',
        },
      },
    }),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [],
      output: {
        minifyInternalExports: false,
        format: 'es',
      },
    },
    outDir: '../../dist/apps/gastos',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

});
