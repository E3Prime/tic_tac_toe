import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/tic_tac_toe/",
  server: {
    port: 8080,
  },
});
