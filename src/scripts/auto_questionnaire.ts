if (!window.__autoQuestionnaireLoaded) {
    window.__autoQuestionnaireLoaded = true;

    // ==========================================
    // 1. CONFIGURATION (Translation Clusters)
    // ==========================================
    
    const KILL_WORDS: string[] = ["tak, kontynuuj", "да, продолжить", "так, продовжити"]; 

    const OPINIA: string[] = ["opinia", "мнение", "думка"];
    const BRAK_PLOMBY: string[] = ["brak plomby", "не запечатано", "пломба відсутня"];
    const BRAK: string[] = ["brak", "нет", "немає"];
    const NIE: string[] = ["nie", "нет", "ні"];
    
    const BOX: string[] = ["nieprzezroczyste pudełko", "непрозрачная коробка", "непрозора коробка"];
    const POLYBAG: string[] = ["polybag", "полиэтиленовый мешок", "поліетиленовий пакет"];
    
    const PARTIAL_MATCHES: string[] = [...OPINIA];

    // ==========================================
    // 2. SHORTCUTS BINDING
    // ==========================================

    // Use the Record utility type to ensure all keys map to our global ShortcutConfig interface
    const SHORTCUTS: Record<string, ShortcutConfig> = {
        'F1': {
            sequence: [OPINIA, BRAK_PLOMBY, BOX, BRAK, NIE]
        },
        'F7': {
            sequence: [OPINIA, BRAK_PLOMBY, POLYBAG, BRAK, NIE]
        }
    };

    for (let key in SHORTCUTS) {
        SHORTCUTS[key].targets = SHORTCUTS[key].sequence.flat().reverse();
    }

    // ==========================================
    // 3. STATE MANAGEMENT
    // ==========================================
    let active: boolean = false;
    let isRunning: boolean = false;
    let activeConfig: ShortcutConfig | null = null;
    
    let changeObserver: MutationObserver | null = null;
    
    // Type-safe timer definitions
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let enterTimer: ReturnType<typeof setTimeout> | undefined;

    function stopScript(): void {
        isRunning = false;
        activeConfig = null;
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);
    }

    // ==========================================
    // 4. CORE LOGIC (The Engine)
    // ==========================================
    function normalizeText(txt: string | null): string {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function findButton(textList: string[]): HTMLElement | null {
        // Query generic HTMLElements immediately to avoid casting later
        const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('div.answer-card p'))
            .filter(p => p.offsetWidth > 0 && p.offsetHeight > 0);
            
        const standardButtons = Array.from(document.querySelectorAll<HTMLElement>('button, [role="button"], .awsui-button'))
            .filter(btn => btn.offsetWidth > 0 && btn.offsetHeight > 0);

        for (let target of textList) {
            const isPartial: boolean = PARTIAL_MATCHES.includes(target);
            
            for (let p of paragraphs) {
                const pText = normalizeText(p.textContent);
                if (pText === target || (isPartial && pText.includes(target))) {
                    return p; 
                }
            }
            
            for (let btn of standardButtons) {
                const btnText = normalizeText(btn.textContent);
                if (btnText === target || (isPartial && btnText.includes(target))) {
                    const innerSpan = btn.querySelector('span');
                    // Return the inner span if it exists, otherwise the button itself
                    return (innerSpan as HTMLElement) || btn;
                }
            }
        }
        
        return null; 
    }

    function processNext(): void {
        if (!isRunning || !active || !activeConfig || !activeConfig.targets) return;

        const killBtn = findButton(KILL_WORDS);
        if (killBtn) {
            stopScript(); 
            return; 
        }

        const actionBtn = findButton(activeConfig.targets);
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

        let domChanged: boolean = false;

        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            
            if (changeObserver) changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
            
            setTimeout(() => {
                if (isRunning) processNext();
            }, 150);
        });

        changeObserver.observe(document.body, { 
            childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] 
        });

        enterTimer = setTimeout(() => {
            if (!domChanged) {
                // Ensure document.activeElement resolves to an HTMLElement safely
                const targetEl = (document.activeElement as HTMLElement) || document.body;
                targetEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
            }
        }, 500);

        fallbackTimer = setTimeout(() => {
            if (!domChanged) stopScript();
        }, 3000);
    }

    // ==========================================
    // 5. TRIGGERS & INTEGRATION
    // ==========================================
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
        
        if (SHORTCUTS[e.key]) {
            e.preventDefault(); 
            
            if (!isRunning) {
                isRunning = true;
                activeConfig = SHORTCUTS[e.key]; 
                processNext();
            } else {
                stopScript();
            }
        }
    });

    window.__autoQuestionnaire = {
        enable: (): void => { active = true; },
        disable: (): void => { 
            active = false; 
            stopScript();
        },
        isActive: (): boolean => active,
        getShortcuts: () => SHORTCUTS
    };
}
