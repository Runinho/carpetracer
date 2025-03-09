import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  assetsInclude: ['**/*.glb'], // Include .glb files as assets
  base: "https://runinho.github.io/carpetracer/",
});