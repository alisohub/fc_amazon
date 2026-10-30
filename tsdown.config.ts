import { defineConfig } from 'tsdown';

const tamperMonkeyBanner = `// ==UserScript==
// @name         Amazon FC Scripts
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Integrated automation scripts for Amazon FC 
// @author       aliso
// @match        *://trex-prod-eu.aka.amazon.com/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==`;

export default defineConfig([
    {
        entry: { 'hub': 'src/hub/hub.ts' },
        format: 'iife',
        outDir: 'dist',
        clean: true,
        minify: true,
        outputOptions: {
            codeSplitting: false,
            entryFileNames: '[name].js'
        },
        banner: {
            js: tamperMonkeyBanner
        }
    },
    {
        entry: { 'hub.user': 'src/hub/hub.ts' },
        format: 'iife',
        outDir: 'dist',
        clean: false,
        minify: true,
        outputOptions: {
            codeSplitting: false,
            entryFileNames: '[name].js'
        },
        banner: {
            js: tamperMonkeyBanner
        }
    }
]);
