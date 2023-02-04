import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { replaceCodePlugin } from 'vite-plugin-replace';

const buildScript = process.env.npm_lifecycle_event || '';

const app = buildScript.includes(':') ? buildScript.split(':')[1] : 'app';

const buildConfig = {
  rootHtml: `./${app}.html`,
  entryFileNames: `${app}/${app}.js`,
  assetFileNames: `${app}/${app}.[ext]`,
};

export default defineConfig({
  plugins: [
    svelte(),
    replaceCodePlugin({
      replacements: [
        {
          from: '__API_BASE__',
          to: process.env.OWLIE_API_BASE || 'http://localhost:8080',
        },
        {
          from: '__HASH_FUNCTION__',
          to: process.env.OWLIE_HASH_FUNCTION || '',
        },
        {
          from: '__GET_HASH__',
          to: process.env.OWLIE_GET_HASH || '',
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: { app: buildConfig.rootHtml },
      output: {
        entryFileNames: buildConfig.entryFileNames,
        assetFileNames: buildConfig.assetFileNames,
      },
    },
    emptyOutDir: false,
  },
  server: { open: buildConfig.rootHtml },
});
