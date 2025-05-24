import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
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
  plugins: [terser()],
};
