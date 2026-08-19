// This empty export is required to tell TypeScript this is a module, 
// allowing us to augment the global scope safely.
export {}; 

declare global {
    // ==========================================
    // 1. CORE HANDLER INTERFACES
    // ==========================================
    
    // The base contract every script MUST follow
    interface ScriptHandler {
        enable: () => void;
        disable: () => void;
        isActive: () => boolean;
    }

    // specific settings shape for the counter
    interface CounterSettings {
        overlayOpacity: number;
        lunchBreak: number;
        overlayLeft: number | null;
        overlayTop: number | null;
        customStartTime: string | null;
        targetRate?: number;
    }

    // Extended handler just for the counter script
    interface CounterHandler extends ScriptHandler {
        getCount: () => number;
        setCount: (newCount: number) => void;
        getSettings: () => CounterSettings;
        // Partial<> means you can pass just one setting at a time to update it
        updateSettings: (newSettings: Partial<CounterSettings>) => void;
    }

    interface BindsHandler extends ScriptHandler {
        // Returns the current active shortcuts (e.g., F1: ["opinia", "brak", ...])
        getShortcuts: () => Record<string, string[]>;
        // Returns the primary Polish words for the dropdowns
        getDictionary: () => string[];
        // Saves user edits to localStorage and updates the engine
        updateShortcuts: (newBinds: Record<string, string[]>) => void;
        // Restores a specific F-key to its default sequence
        resetToDefault: (key: string) => void;
    }
    
    interface OffTaskHandler extends ScriptHandler {
            getSettings: () => OffTaskSettings;
            updateSettings: (newSettings: Partial<OffTaskSettings>) => void;
    }
    // ==========================================
    // 2. THE WINDOW OBJECT EXTENSIONS
    // ==========================================
    interface OffTaskSettings {
        toteBarcode?: string;
        timeoutMins?: number;
    }

    interface Window {
        // Branch / Environment info
        __SH_BRANCH?: string;

        // Load Trackers (The ? means they might be undefined initially)
        __scriptHubLoaded?: boolean;
        __autoLpnLoaded?: boolean;
        __counterLoaded?: boolean;
        __bindsLoaded?: boolean;
        __offTaskLoaded?: boolean;
        __devInspectorLoaded?: boolean;

        // Script Handlers (Attached to the window so the Hub can read them)
        __autoLpn?: ScriptHandler;
        __itemCounter?: CounterHandler;
        __binds?: BindsHandler;
        __offTask?: OffTaskHandler;
        __devInspector?: ScriptHandler;
    }
}
