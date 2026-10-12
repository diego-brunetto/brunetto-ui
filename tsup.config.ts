import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Los componentes usan estado y efectos: en Next (App Router) son componentes de cliente.
  banner: { js: '"use client";' },
});
