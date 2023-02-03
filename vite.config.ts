import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const buildScript = process.env.npm_lifecycle_event;

const app = buildScript.includes(":") ? buildScript.split(":")[1] : "app";

const buildConfig = {
  rootHtml: `./${app}.html`,
  entryFileNames: `${app}/${app}.js`,
  assetFileNames: `${app}/${app}.[ext]`,
};

export default defineConfig({
  plugins: [svelte()],
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
