# Developer Guide: How to Add New Scripts

This guide outlines the step-by-step process for creating a new script, registering it with the build system, declaring its types, and integrating it into the Script Hub interface.

---

## 1. Create the Script File
Create a new TypeScript file inside the `src/scripts/` directory (e.g., `src/scripts/my_new_script.ts`). 

Ensure your script safely initializes, checks a global loader flag to prevent duplicate loading, and exposes its control interface on the `window` object so the Hub can manage it:

```typescript
if (!window.__myNewScriptLoaded) {
    window.__myNewScriptLoaded = true;

    let active: boolean = false;

    window.__myNewScript = {
        enable: (): void => { 
            active = true; 
            // Add script activation/event listener logic here 
        },
        disable: (): void => { 
            active = false; 
            // Add script cleanup/removal logic here 
        },
        isActive: (): boolean => active
    };
}

```

---

## 2. Register the Script in the Build Config

Open `tsup.config.ts` and add your new script entry point to the `entry` object. This ensures `tsup` bundles and compiles your code into the `dist/` folder:

```typescript
export default defineConfig({
    entry: {
        'hub': 'src/hub/hub.ts',
        'auto_lpn': 'src/scripts/auto_lpn.ts',
        'binds': 'src/scripts/binds.ts',
        'counter': 'src/scripts/counter.ts',
        'dev_inspector': 'src/scripts/dev_inspector.ts',
        'my_new_script': 'src/scripts/my_new_script.ts' // <-- ADD YOUR SCRIPT ENTRY HERE
    },
    format: ['iife'],
    outDir: 'dist',
    clean: true,
    minify: true,
    bundle: true,
    outExtension() {
        return {
            js: '.js',
        };
    },
});

```

---

## 3. Update TypeScript Global Typings

Open `src/types/global.d.ts` to declare your script's window properties so TypeScript compiles without errors:

1. Add your loader flag and script handler interface to the `Window` interface:


```typescript
declare global {
    interface Window {
        // Existing loaders...
        __myNewScriptLoaded?: boolean;

        // Handler registration (use ScriptHandler or a custom extended interface if it has settings)
        __myNewScript?: ScriptHandler;
    }
}

```



---

## 4. Add the Script Definition to the Hub

Open `src/hub/hub.ts` and add your script definition to the `SCRIPTS` array. This automatically provisions its UI card, master toggle switch, and optional settings panel:

```typescript
    const SCRIPTS: ScriptDefinition[] = [
        // ... existing scripts ...
        {
            id: 'my-new-script',
            name: 'My New Script',
            file: 'my_new_script.js',
            description: 'Short description detailing what this automation script performs.',
            getHandler: () => window.__myNewScript,
            // Optional: Include renderSettings(container: HTMLElement) if your script requires custom configuration UI elements.
            // experimental: true // Uncomment if the script should only display in development environments.
        }
    ];

```

---

## 5. Build and Test

Run your compilation or development watch script to test your changes locally:

```bash
# For live-reloading development tracking
npm run dev

# For generating production builds in /dist
npm run build

```

Your new script is now fully integrated into the architecture, dynamically fetchable by the Hub, and ready for deployment.
