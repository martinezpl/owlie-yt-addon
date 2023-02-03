import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

const buildScript = process.env.npm_lifecycle_event;

let buildConfig: { rootHtml: any; entryFileNames: any; assetFileNames: any };
switch (buildScript) {
  case "build:popup":
    buildConfig = {
      rootHtml: "./popup.html",
      entryFileNames: "popup/[name].js",
      assetFileNames: "popup/[name].[ext]",
    };
    break;
  case "build:background":
    buildConfig = {
      rootHtml: "./background.html",
      entryFileNames: "background/[name].js",
      assetFileNames: "background/[name].[ext]",
    };
    break;
  default:
    buildConfig = {
      rootHtml: "./app.html",
      entryFileNames: "app/[name].js",
      assetFileNames: "app/[name].[ext]",
    };
    break;
}

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
