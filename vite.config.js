import { defineConfig } from "vite";

export default defineConfig({
  base: "/ismism/",
  build: {
    target: "es2020",
    sourcemap: true,
  },
});
