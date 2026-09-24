// This empty export is required to tell TypeScript this is a module, 
// allowing us to augment the global scope safely.
export {}; 

declare global {
    // ==========================================
    // 1. CORE HANDLER INTERFACES
    // ==========================================
    
    // The base contract every script MUST follow.
    interface ScriptHandler {
        enable: () => void;
        disable: () => void;
        isActive: () => boolean;
    }

    // A specialized contract for scripts that have settings menus.
    // Making these required here stops the Hub from throwing errors.
    interface SettingsHandler<T> extends ScriptHandler {
        getSettings: () => T;
        updateSettings: (newSettings: Partial<T>) => void;
    }

    interface CounterSettings {
        overlayOpacity: number;
        lunchBreak: number;
        overlayLeft: number | null;
        overlayTop: number | null;
        customStartTime: string | null;
        targetRate?: number;
        doubleCountMode?: boolean;
        scanTimeoutMs?: number;
    }

    // Counter gets SettingsHandler PLUS its own unique count methods
    interface CounterHandler extends SettingsHandler<CounterSettings> {
        getCount: () => number;
        setCount: (newCount: number) => void;
    }

    interface BindsHandler extends ScriptHandler {
        getShortcuts: () => Record<string, string[]>;
        updateShortcuts: (newBinds: Record<string, string[]>) => void;
        getRecordingKey: () => string | null;
        startRecording: (key: string) => void;
        stopRecording: () => void;
    }

    interface OffTaskSettings {
        toteBarcode?: string;
        timeoutMins?: number;
    }

    interface DevInspectorSettings {
        showDetails: boolean;
        showCSS: boolean;
        showCoords: boolean;
    }

    // ==========================================
    // 2. THE WINDOW OBJECT EXTENSIONS
    // ==========================================
    
    interface Window {
        // Branch / Environment info
        __SH_BRANCH?: string;

        // Load Trackers
        __scriptHubLoaded?: boolean;
        __autoLpnLoaded?: boolean;
        __refurbLpnLoaded?: boolean;
        __counterLoaded?: boolean;
        __bindsLoaded?: boolean;
        __offTaskLoaded?: boolean;
        __gravisLoaded?: boolean;
        __devInspectorLoaded?: boolean;

        // Script Handlers
        __autoLpn?: ScriptHandler;
        __refurbLpn?: ScriptHandler;
        __itemCounter?: CounterHandler;
        __binds?: BindsHandler;
        
        // We pass the settings interface directly into the SettingsHandler generic
        __offTask?: SettingsHandler<OffTaskSettings>;
        __devInspector?: SettingsHandler<DevInspectorSettings>;
        __gravis?: ScriptHandler;
    }
}
