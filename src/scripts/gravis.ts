if (!window.__gravisLoaded) {
    window.__gravisLoaded = true;

    let active: boolean = false;
    const STORAGE_KEY = 'lpnForGravis';
    let keyBuffer: string = '';

    function handleKeydown(e: KeyboardEvent): void {
        if (!active) return;

        // 1. Extract and store LPN on Enter
        if (e.key === 'Enter') {
            const input = e.target as HTMLInputElement;
            if (input && input.tagName.toLowerCase() === 'input') {
                const label = (input.getAttribute('aria-label') || '').toLowerCase();
                const isValidLabel = ['rma', 'lpn', 'nlp', 'лпн', 'нлп'].some(keyword => label.includes(keyword));
                
                if (isValidLabel) {
                    const val = input.value?.trim();
                    if (val && /^lpn[a-z0-9]+/i.test(val)) {
                        try {
                            localStorage.setItem(STORAGE_KEY, val);
                        } catch (err) {}
                    }
                }
            }
            keyBuffer = ''; // Reset typing buffer
            return;
        }

        // 2. Track "gr" keyboard shortcut
        if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
            keyBuffer += e.key.toLowerCase();
            if (keyBuffer.length > 2) keyBuffer = keyBuffer.slice(-2);

            if (keyBuffer === 'gr') {
                // Block the shortcut if actively typing in an input (prevents scanner misfires)
                const activeEl = document.activeElement;
                const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

                if (!isInput) {
                    keyBuffer = ''; // Consume the buffer
                    try {
                        const savedLpn = localStorage.getItem(STORAGE_KEY);
                        if (savedLpn) {
                            window.open(`https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis/returnUnit/${savedLpn}`, '_blank');
                        }
                    } catch (err) {}
                }
            }
        } else {
            // Reset buffer if they hit space, numbers, or special characters
            keyBuffer = '';
        }
    }

    // Use capturing phase (true) to ensure global interception
    document.addEventListener('keydown', handleKeydown, true);

    window.__gravis = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; keyBuffer = ''; },
        isActive: (): boolean => active
    };
}
