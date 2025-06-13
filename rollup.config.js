import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js", // For modern bundlers like Next.js
      format: "esm",
    },
    {
      file: "dist/index.umd.js", // For direct browser use (e.g., in WordPress)
      format: "umd",
      name: "VisitorTracker", // This becomes window.VisitorTracker
      globals: {
        react: "React"
      }
    },
  ],
  external: ['react'], // <-- Add this line
  plugins: [
    resolve(),      // Enables importing from node_modules
    commonjs(),     // Converts CommonJS modules (like uuid) to ES6
    typescript(),
    terser(),       // Optional: minify output
    json(),       // Allows importing JSON files
  ],
};
