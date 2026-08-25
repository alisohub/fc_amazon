if (!window.__bindsLoaded) {
    window.__bindsLoaded = true;

    const STORAGE_KEY = 'sh_binds_config';
    
    // Start completely fresh with empty arrays ONLY for F1 through F7
    let currentShortcuts: Record<string, string[]> = {
        'F1': [], 'F2': [], 'F3': [], 'F4': [], 'F5': [], 'F6': [], 'F7': []
    };

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            currentShortcuts = { ...currentShortcuts, ...JSON.parse(saved) };
        }
    } catch (e) {}

    let active: boolean = false;
    let isRunning: boolean = false;
    let activeTargets: string[] = []; 
    let recordingKey: string | null = null; 
    
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

    function compileTargets(sequence: string[]): string[] {
        return sequence.map(word => word.trim().toLowerCase()).filter(w => w.length > 0).reverse();
    }

    function normalizeText(txt: string | null): string {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // ==========================================
    // LIVE RECORDING LOGIC
    // ==========================================
    document.addEventListener('click', (e: MouseEvent) => {
        if (!active || !recordingKey) return;
        
        const clickedElement = e.target as HTMLElement;
        if (clickedElement.closest('#sh-root')) return; 
        
        let targetP: HTMLElement | null = null;

        if (clickedElement.tagName.toLowerCase() === 'p') {
            targetP = clickedElement;
        } else {
            const children = clickedElement.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].tagName.toLowerCase() === 'p') {
                    targetP = children[i] as HTMLElement;
                    break;
                }
            }

            if (!targetP) {
                const grandparent = clickedElement.parentElement?.parentElement;
                if (grandparent) {
                    const uncleChildren = grandparent.children;
                    for (let i = 0; i < uncleChildren.length; i++) {
                        if (uncleChildren[i].tagName.toLowerCase() === 'p') {
                            targetP = uncleChildren[i] as HTMLElement;
                            break;
                        }
                    }
                }
            }
        }

        // Only record the click if the <p> actually belongs to an answer card
        if (targetP && targetP.closest('.answer-card')) {
            const text = normalizeText(targetP.textContent);
            if (text && currentShortcuts[recordingKey].length < 30) {
                currentShortcuts[recordingKey].push(text);
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentShortcuts)); } catch (e) {}
                
                // If it reaches the 30 step limit, auto-stop recording
                if (currentShortcuts[recordingKey].length >= 30) {
                    recordingKey = null;
                }
                
                window.dispatchEvent(new CustomEvent('sh-binds-update')); 
            }
        }
    }, true);

    // ==========================================
    // PLAYBACK LOGIC
    // ==========================================
    function findAnswer(textList: string[]): { element: HTMLElement, matchedText: string } | null {
        // Exclusively search inside .answer-card elements
        const paragraphs = Array.from(document.querySelectorAll<HTMLElement>('.answer-card p'))
            .filter(p => p.offsetWidth > 0 && p.offsetHeight > 0);

        for (let target of textList) {
            for (let p of paragraphs) {
                const pText = normalizeText(p.textContent);
                // 100% strict exact matching only
                if (pText === target) {
                    return { element: p, matchedText: target }; 
                }
            }
        }
        return null; 
    }

    function processNext(): void {
        if (!isRunning || !active || activeTargets.length === 0) {
            stopScript();
            return;
        }

        const actionMatch = findAnswer(activeTargets);
        if (actionMatch) {
            const matchIndex = activeTargets.indexOf(actionMatch.matchedText);
            if (matchIndex > -1) activeTargets.splice(matchIndex, 1);
            actionMatch.element.click();
            waitForDustToSettle(); 
            return;
        }
        
        // Stops gracefully if the paragraph is absent
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

    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (!active) return;
        
        // Strictly only accept F1 through F7
        const isFKey = /^F[1-7]$/.test(e.key);
        if (!isFKey) return;

        if (recordingKey) {
            e.preventDefault();
            if (e.key === recordingKey) {
                recordingKey = null; 
                window.dispatchEvent(new CustomEvent('sh-binds-update'));
            }
            return;
        }
        
        if (currentShortcuts[e.key] && currentShortcuts[e.key].length > 0) {
            e.preventDefault(); 
            if (!isRunning) {
                isRunning = true;
                activeTargets = compileTargets(currentShortcuts[e.key]); 
                processNext();
            } else {
                stopScript();
            }
        }
    }, true);

    window.__binds = {
        enable: (): void => { active = true; },
        disable: (): void => { active = false; stopScript(); recordingKey = null; window.dispatchEvent(new CustomEvent('sh-binds-update')); },
        isActive: (): boolean => active,
        getShortcuts: () => currentShortcuts,
        updateShortcuts: (newBinds: Record<string, string[]>): void => {
            currentShortcuts = { ...newBinds };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentShortcuts)); } catch (e) {}
        },
        getRecordingKey: () => recordingKey,
        startRecording: (key: string): void => {
            stopScript();
            recordingKey = key;
            currentShortcuts[key] = []; 
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(currentShortcuts)); } catch (e) {}
            window.dispatchEvent(new CustomEvent('sh-binds-update'));
        },
        stopRecording: (): void => {
            recordingKey = null;
            window.dispatchEvent(new CustomEvent('sh-binds-update'));
        }
    };
}
