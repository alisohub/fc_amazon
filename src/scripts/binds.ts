if (!window.__bindsLoaded) {
    window.__bindsLoaded = true;

    // ==========================================
    // 1. UNIFIED DICTIONARY & CONFIGURATION
    // ==========================================
    
    const KILL_WORDS = ["tak, kontynuuj", "да, продолжить", "так, продовжити"] as const; 

    const PARTIAL_MATCHES = ["opinia", "мнение", "думка"] as const;
    // The unified dictionary mapping Polish primary keys to their translations
    const DICTIONARY: Record<string, string[]> = {
        "opinia": ["opinia", "мнение", "думка"],
        "brak plomby": ["brak plomby", "не запечатано", "пломба відсутня"],
        "brak": ["brak", "нет", "немає"],
        "nie": ["nie", "нет", "ні"],
        "nieprzezroczyste pudełko": ["nieprzezroczyste pudełko", "непрозрачная коробка", "непрозора коробка"],
        "polybag": ["polybag", "полиэтиленовый мешок", "поліетиленовий пакет"]
    };

    const DEFAULT_SHORTCUTS: Record<string, string[]> = {
        'F1': ["opinia", "brak plomby", "nieprzezroczyste pudełko", "brak", "nie"],
        'F7': ["opinia", "brak plomby", "polybag", "brak", "nie"]
    };

    const STORAGE_KEY = 'sh_binds_config';
    let currentShortcuts: Record<string, string[]> = {};

    // Load from memory or fallback to defaults
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            currentShortcuts = JSON.parse(saved);
        } else {
            currentShortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
        }
    } catch (e) {
        currentShortcuts = JSON.parse(JSON.stringify(DEFAULT_SHORTCUTS));
    }

    // ==========================================
    // 2. STATE MANAGEMENT & TARGET COMPILER
    // ==========================================
    let active: boolean = false;
    let isRunning: boolean = false;
    let activeTargets: string[] = []; // The compiled list of strings to search for
    
    let changeObserver: MutationObserver | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let enterTimer: ReturnType<typeof setTimeout> | undefined;

    function stopScript(): void {
        isRunning = false;
        activeTargets = [];
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);
    }

    // Compiles the 1D user sequence into the flat, reversed translation array the engine needs
    function compileTargets(sequence: string[]): string[] {
        const fullList = sequence.map(word => {
            const cleanWord = word.trim().toLowerCase();
            return DICTIONARY[cleanWord] || [cleanWord]; // Fallback to custom word if not in dict
        });
        return fullList.flat().reverse();
    }

    // ==========================================
    // 3. CORE LOGIC (The Engine)
    // ==========================================
    function normalizeText(txt: string | null): string {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function findButton(textList: string[]): HTMLElement | null {
        const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('div.answer-card p'))
            .filter(p => p.offsetWidth > 0 && p.offsetHeight > 0);
            
        const standardButtons = Array.from(document.querySelectorAll<HTMLElement>('button, [role="button"], .awsui-button'))
            .filter(btn => btn.offsetWidth > 0 && btn.offsetHeight > 0);

        for (let target of textList) {
            // Check if this target is in our partial matches config
            const isPartial = PARTIAL_MATCHES.some(pm => target.includes(pm));
            
            for (let p of paragraphs) {
                const pText = normalizeText(p.textContent);
                if (pText === target || (isPartial && pText.includes(target))) return p; 
            }
            
            for (let btn of standardButtons) {
                const btnText = normalizeText(btn.textContent);
                if (btnText === target || (isPartial && btnText.includes(target))) {
                    const innerSpan = btn.querySelector('span');
                    return (innerSpan as HTMLElement) || btn;
                }
            }
        }
        return null; 
    }

    function processNext(): void {
        if (!isRunning || !active || activeTargets.length === 0) return;

        // Spread the readonly KILL_WORDS into a standard string array for the function
        const killBtn = findButton([...KILL_WORDS]);
        if (killBtn) {
            stopScript(); 
            return; 
        }

        const actionBtn = findButton(activeTargets);
        if (actionBtn) {
            actionBtn.click();
            waitForDustToSettle(); 
            return;
        }

        stopScript();
    }

    function waitForDustToSettle(): void {
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);

        let domChanged = false;

        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            
            if (changeObserver) changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
            
            setTimeout(() => { if (isRunning) processNext(); }, 150);
        });

        changeObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] });

        enterTimer = setTimeout(() => {
            if (!domChanged) {
                const targetEl = (document.activeElement as HTMLElement) || document.body;
                targetEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
            }
        }, 500);

        fallbackTimer = setTimeout(() => { if (!domChanged) stopScript(); }, 3000);
    }

    // ==========================================
    // 4. TRIGGERS & INTEGRATION
    // ==========================================
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
        
        if (currentShortcuts[e.key]) {
            e.preventDefault(); 
            
            if (!isRunning) {
                isRunning = true;
                activeTargets = compileTargets(currentShortcuts[e.key]); 
                processNext();
            } else {
                stopScript();
            }
        }
    });

    window.__binds = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; stopScript(); },
        isActive: (): boolean => active,
        getShortcuts: () => currentShortcuts,
        getDictionary: () => Object.keys(DICTIONARY),
        updateShortcuts: (newBinds: Record<string, string[]>): void => {
            currentShortcuts = { ...newBinds };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentShortcuts)); } catch (e) {}
        },
        resetToDefault: (key: string): void => {
            if (DEFAULT_SHORTCUTS[key]) {
                currentShortcuts[key] = [...DEFAULT_SHORTCUTS[key]];
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentShortcuts)); } catch (e) {}
            }
        },
        getDefaults: () => DEFAULT_SHORTCUTS
    };
}
