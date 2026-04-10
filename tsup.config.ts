import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: false, // Disabled due to build issues - types are still available in src
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  external: [
    "react",
    "react-dom",
    "@mui/material",
    "@mui/icons-material",
    "@emotion/react",
    "@emotion/styled",
    "@tanstack/react-table",
    "@tanstack/react-virtual",
  ],
});
