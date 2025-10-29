import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { federation } from '@module-federation/vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/host',

  server: {
    port: 4200,
    host: 'localhost',
    hmr: {
      overlay: true,
    },
    cors: true,
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    react(),
    nxViteTsPaths(),
    federation({
      name: 'host',
      manifest: true,
      remotes: {
        autofactura: {
          type: "module",
          name: "autofactura",
          entry: "http://localhost:4201/remoteEntry.js",
        },
        gastos: {
          type: "module",
          name: "gastos",
          entry: "http://localhost:4202/remoteEntry.js",
        },
        proveedores: {
          type: "module",
          name: "proveedores",
          entry: "http://localhost:4203/remoteEntry.js",
        },
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
      },
    },
    outDir: '../../dist/apps/host',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

});
