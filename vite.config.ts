import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { replaceCodePlugin } from "vite-plugin-replace";

const production = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: '"__REPLACE_WITH_CHROME__" + ',
          to: production ? "chrome.runtime.getURL(" : "",
        },
        { from: ' + "__CLOSING_PARENTESIS__"', to: production ? ")" : "" },
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
