import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

const defaultPlugins = () => [
  typescript(),
  // If you have external dependencies installed from
  // npm, you'll most likely need these plugins. In
  // some cases you'll need additional configuration —
  // consult the documentation for details:
  // https://github.com/rollup/rollup-plugin-commonjs
  resolve({
    browser: true,
  }),
  commonjs(),
  json(),

  // If we're building for production (npm run build
  // instead of npm run dev), minify
  production && terser(),
];

export default [
  // Devtools app
  {
    input: "src/devtools/index.ts",
    output: {
      sourcemap: true,
      format: "iife",
      name: "Vaadin.themeassistant.devtools",
      file: "build/devtools.js",
    },
    plugins: [...defaultPlugins()],
    watch: {
      clearScreen: false,
    },
  },
  // Background script
  {
    input: "src/background/index.ts",
    output: {
      sourcemap: true,
      format: "iife",
      file: "build/background.js",
    },
    plugins: [...defaultPlugins()],
    watch: {
      clearScreen: false,
    },
  },
  // Content script
  {
    input: "src/content/index.ts",
    output: {
      sourcemap: true,
      format: "iife",
      file: "build/content.js",
    },
    plugins: [...defaultPlugins()],
    watch: {
      clearScreen: false,
    },
  },
];
