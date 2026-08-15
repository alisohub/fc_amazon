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
        counterOption: number;
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

    // specific shape for your Auto Questionnaire binds
    interface ShortcutConfig {
        sequence: string[][];
        targets?: string[]; // The pre-calculated flat array
    }

    // Extended handler just for the questionnaire script
    interface QuestionnaireHandler extends ScriptHandler {
        getShortcuts: () => Record<string, ShortcutConfig>;
    }

    // ==========================================
    // 2. THE WINDOW OBJECT EXTENSIONS
    // ==========================================
    
    interface Window {
        // Branch / Environment info
        __SH_BRANCH?: string;

        // Load Trackers (The ? means they might be undefined initially)
        __scriptHubLoaded?: boolean;
        __autoLpnLoaded?: boolean;
        __autoQuestionnaireLoaded?: boolean;
        __counterLoaded?: boolean;
        __devInspectorLoaded?: boolean;

        // Script Handlers (Attached to the window so the Hub can read them)
        __autoLpn?: ScriptHandler;
        __itemCounter?: CounterHandler;
        __autoQuestionnaire?: QuestionnaireHandler;
        __devInspector?: ScriptHandler;
    }
}
