import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { replaceCodePlugin } from "vite-plugin-replace";
import { config as configDotenv } from "dotenv";

const buildScript = process.env.npm_lifecycle_event || "";

const app = buildScript.includes(":") ? buildScript.split(":")[1] : "app";

const buildConfig = {
  rootHtml: `./${app}.html`,
  entryFileNames: `${app}/${app}.js`,
  assetFileNames: `${app}/${app}.[ext]`,
};

// load variables from .env
configDotenv();

export default defineConfig({
  plugins: [
    svelte(),
    replaceCodePlugin({
      replacements: [
        {
          from: "__API_BASE__",
          to: process.env.VITE_OWLIE_API_BASE || "http://localhost:8080",
        },
        {
          from: '"__HASH_FUNCTION__"',
          to: process.env.VITE_OWLIE_HASH_FUNCTION || "",
        },
        {
          from: '"__GET_HASH__"',
          to: process.env.VITE_OWLIE_GET_HASH || "",
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
