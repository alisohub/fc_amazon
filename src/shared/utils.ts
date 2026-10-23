import { STORAGE_KEY_DEBUG } from './constants';

export function normalizeText(txt: string | null): string {
    return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

export type DebugScope =
    | 'hub'
    | 'item-counter'
    | 'off-task'
    | 'binds'
    | 'auto-lpn'
    | 'refurb-lpn'
    | 'clear-session'
    | 'gravis';

const DEFAULT_DEBUG_CONFIG: Record<DebugScope, boolean> = {
    'hub': false,
    'item-counter': false,
    'off-task': false,
    'binds': false,
    'auto-lpn': false,
    'refurb-lpn': false,
    'clear-session': false,
    'gravis': false
};

let debugConfig: Record<DebugScope, boolean> = { ...DEFAULT_DEBUG_CONFIG };

try {
    const saved = localStorage.getItem(STORAGE_KEY_DEBUG);
    if (saved) {
        debugConfig = { ...DEFAULT_DEBUG_CONFIG, ...JSON.parse(saved) };
    }
} catch (e) {}

export function isDevEnv(): boolean {
    const branch = window.__SH_BRANCH || 'main';
    return branch === 'development' || branch === 'local';
}

export function getDebugConfig(): Record<DebugScope, boolean> {
    return { ...debugConfig };
}

export function setDebugFlag(scope: DebugScope, enabled: boolean): void {
    debugConfig[scope] = enabled;
    try {
        localStorage.setItem(STORAGE_KEY_DEBUG, JSON.stringify(debugConfig));
    } catch (e) {}
    // Sync Gravis debug flag to the Gravis popup tab if open
    if (scope === 'gravis') {
        window.__gravis?.setDebug?.(enabled);
    }
}

export function isDebugEnabled(scope: DebugScope): boolean {
    return isDevEnv() && Boolean(debugConfig[scope]);
}

export function debugLog(scope: DebugScope, ...args: any[]): void {
    if (!isDebugEnabled(scope)) return;
    console.log(
        `%c[SH:${scope}]`,
        'color: #1a73e8; font-weight: bold;',
        ...args
    );
}
