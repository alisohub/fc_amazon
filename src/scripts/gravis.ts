import { STORAGE_KEY_LPN, STORAGE_KEY_STATION } from "@shared/dom";

if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;

    let active: boolean = false;
    let isProcessing: boolean = false;
    let keyBuffer: string = '';

    async function executeClearSession(): Promise<void> {
        if (isProcessing) return; 
        isProcessing = true;
        try {
        } finally {
            return; 
        }

    }

    function handleKeydown(e: KeyboardEvent): void {
        if (!active) return;

        // 1. Exit early and reset buffer if they press space, numbers, or special keys
        if (e.key.length !== 1 || !/[a-z]/i.test(e.key)) {
            keyBuffer = '';
            return;
        }

        // 2. Exit early if actively typing in an input (prevents scanner misfires)
        const target = e.target as HTMLElement;
        if (target && target.matches('input, textarea, [contenteditable="true"]')) {
            keyBuffer = '';
            return;
        }

        // 3. Append the new key and slice to keep only the last 2 characters
        keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-2);

        // 4. Execute and consume buffer
        if (keyBuffer === 'us') {
            keyBuffer = ''; 
            executeClearSession();
        }
    }

    // Use capturing phase (true) to ensure global interception
    document.addEventListener('keydown', handleKeydown, true);

    window.__gravis = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; keyBuffer = ''; isProcessing = false},
        isActive: (): boolean => active
    };
}
