import { defineConfig } from 'tsup';

export default defineConfig({
    // By using an object instead of an array, we force tsup to flatten the output.
    // The key (e.g., 'hub') becomes the exact filename in the dist folder.
    entry: {
        'hub': 'src/hub/hub.ts',
        'auto_lpn': 'src/scripts/auto_lpn.ts',
        'auto_questionnaire': 'src/scripts/auto_questionnaire.ts',
        'counter': 'src/scripts/counter.ts',
        'dev_inspector': 'src/scripts/dev_inspector.ts'
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
