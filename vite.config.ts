import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { replaceCodePlugin } from "vite-plugin-replace";
import { config as configDotenv } from "dotenv";
import { resolve } from "path";

// infer which code we are building. We can choose between app, background and popup
const buildScript = process.env.npm_lifecycle_event || "";

const app = buildScript.includes(":") ? buildScript.split(":")[1] : "app";

// if building background, treat it as a library, not a web app
const isLibrary = app === "background";

const buildConfig = {
  rootHtml: `./${app}.html`,
  entryFileLib: `.src/${app}/${app}.ts`,
  entryFileNames: `${app}/${app}.js`,
  assetFileNames: `${app}/${app}.[ext]`,
};

// load variables from .env
configDotenv();

export default defineConfig({
  plugins: [
    // Only use svelte if not a library
    !isLibrary && svelte(),
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
    lib: isLibrary && {
      entry: resolve(__dirname, buildConfig.entryFileLib),
      name: app,
    },
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
