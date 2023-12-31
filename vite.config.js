import path from "path";
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import progress from "vite-plugin-progress";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: "",
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  plugins: [
    libInjectCss(),
    createVuePlugin(),
    viteCommonjs({
      exclude: ["lucky-sheet-pkg"],
    }),
    progress(),
  ],
  server: {
    strictPort: false,
    https: false,
  },
  build: {
    cssCodeSplit: false,
    emptyOutDir: true,
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "luckysheetvue",
      fileName: "luckysheetvue",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
