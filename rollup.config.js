import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/main.ts', // Entry point of your application
  output: {
    dir: './dist',
    format: 'es', // ES module format
    sourcemap: true, // Enable source maps for debugging
  },
  plugins: [
    typescript(), // Compile TypeScript to JavaScript
    nodeResolve(), // Resolve node_modules and local imports
  ],
};