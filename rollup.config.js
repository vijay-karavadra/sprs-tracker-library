import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js", // for Next.js
      format: "esm",
    },
    {
      file: "dist/index.umd.js", // for WordPress or browsers
      format: "umd",
      name: "sperse-tracker",
    },
  ],
  plugins: [typescript()],
};
