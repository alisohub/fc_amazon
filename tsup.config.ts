import { defineConfig } from 'tsup';

export default defineConfig({
    // By using an object instead of an array, we force tsup to flatten the output.
    // The key (e.g., 'hub') becomes the exact filename in the dist folder.
    entry: {
        'hub': 'src/hub/hub.ts',
        'hub_gravis': 'src/hub/hub_gravis.ts',
    },
    format: ['iife'],
    outDir: 'dist',
    clean: true,
    minify: true,
    bundle: true,
    // This custom function stops tsup from adding '.global.js' and forces standard '.js'
    outExtension() {
        return {
            js: '.js',
        };
    },
});
