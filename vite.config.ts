import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { replaceCodePlugin } from "vite-plugin-replace";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    replaceCodePlugin({
      replacements: [
        { from: '"__REPLACE_WITH_CHROME__" + ', to: "chrome.runtime.getURL(" },
        { from: ' + "__CLOSING_PARENTESIS__"', to: ")" },
      ],
    }),
    svelte(),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
