import path from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr"; // eslint-disable-line
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
    plugins: [react(), svgr(), createHtmlPlugin({ inject: { data: env } })],
  };
});
