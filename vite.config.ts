import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import * as path from 'path';

export default defineConfig({
  plugins: [vike(), react()],
  base: '/invoice/',
  build: {
    target: "es2022",
  },
  resolve: {
    alias: [
      {
        find: "#",
        replacement: path.resolve(__dirname, 'src')
      },
      {
        find: "#styled-system",
        replacement: path.resolve(__dirname, 'styled-system')
      }
    ]
  }
});
