import { defineConfig, loadEnv } from "vite";
import path from "path";
import autoprefixer from "autoprefixer";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [tanstackRouter(), react(), tsconfigPaths()],
    envPrefix: ["VITE_"],
    server: {
      port: 5173, // Change the port to your preferred one
      host: "0.0.0.0", // Allows access to your local IP address
      open: true, // Optional: Opens the browser automatically
    },
    base: env.VITE_BASE_PATH || "/",
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      minify: "terser",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
        },
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  };
});
