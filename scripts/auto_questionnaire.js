(() => {
    if (window.__autoQuestionnaireLoaded) {
        return;
    }
    window.__autoQuestionnaireLoaded = true;

    // ==========================================
    // 1. CONFIGURATION (Easy to expand)
    // ==========================================
    
    // The universal kill switch for all shortcuts
    const KILL_WORDS = ["tak, kontynuuj", "да, продолжить"]; 

    // Add new keyboard shortcuts and their target word lists here
    const SHORTCUTS = {
        'F1': {
            targets: ["opinia", "мнение", "brak plomby", "не запечатано", "brak", "нет", "polybag", "полиэтиленовый мешок", "nie"]
        },

    };

    // ==========================================
    // 2. STATE MANAGEMENT
    // ==========================================
    let active = false;        // Is the script enabled in the Hub?
    let isRunning = false;     // Is a sequence currently executing?
    let activeConfig = null;   // Which shortcut's config is currently running
    
    let changeObserver = null;
    let fallbackTimer = null;
    let enterTimer = null;

    // Helper: Safely completely stops the loop and resets state
    function stopScript() {
        isRunning = false;
        activeConfig = null;
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);
    }

    // ==========================================
    // 3. CORE LOGIC (The Engine)
    // ==========================================
    function normalizeText(txt) {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    function findButton(textList) {
        // Step 1: Search inside .answer-card specifically for a nested <p>
        const answerCards = document.querySelectorAll('div.answer-card');
        for (let card of answerCards) {
            const paragraphs = card.querySelectorAll('p');
            for (let p of paragraphs) {
                if (p.offsetWidth === 0 || p.offsetHeight === 0) continue;
                
                const pText = normalizeText(p.textContent);
                for (let target of textList) {
                    if (pText === target || (target === 'opinia' && pText.includes(target))) {
                        return p; 
                    }
                }
            }
        }

        // Step 2: Fallback for standard buttons 
        const standardButtons = document.querySelectorAll('button, [role="button"], .awsui-button');
        for (let btn of standardButtons) {
            if (btn.offsetWidth === 0 || btn.offsetHeight === 0) continue;
            
            const btnText = normalizeText(btn.textContent);
            for (let target of textList) {
                if (btnText === target || btnText.includes(target)) {
                    const innerSpan = btn.querySelector('span');
                    return innerSpan ? innerSpan : btn;
                }
            }
        }
        return null;
    }

    function processNext() {
        if (!isRunning || !active || !activeConfig) return;

        // Check for universal Kill Switch FIRST
        const killBtn = findButton(KILL_WORDS);
        if (killBtn) {
            stopScript(); // Job done, leave it on the kill screen
            return; 
        }

        // Check for Hit List for the active shortcut
        const actionBtn = findButton(activeConfig.targets);
        if (actionBtn) {
            actionBtn.click();
            waitForDustToSettle(); 
            return;
        }

        // Bailout if no buttons are found (unfamiliar screen)
        stopScript();
    }

    function waitForDustToSettle() {
        if (changeObserver) changeObserver.disconnect();
        clearTimeout(fallbackTimer);
        clearTimeout(enterTimer);

        let domChanged = false;

        changeObserver = new MutationObserver(() => {
            if (domChanged) return;
            domChanged = true;
            changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
            
            setTimeout(() => {
                if (isRunning) processNext();
            }, 150);
        });

        changeObserver.observe(document.body, { 
            childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] 
        });

        // "Stuck UI" Fix
        enterTimer = setTimeout(() => {
            if (!domChanged) {
                const targetEl = document.activeElement || document.body;
                targetEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
            }
        }, 500);

        // Deadlock Protection
        fallbackTimer = setTimeout(() => {
            if (!domChanged) stopScript();
        }, 3000);
    }

    // ==========================================
    // 4. TRIGGERS & INTEGRATION
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (!active) return;
        
        // Check if the pressed key exists in our SHORTCUTS dictionary
        if (SHORTCUTS[e.key]) {
            e.preventDefault(); 
            
            if (!isRunning) {
                isRunning = true;
                activeConfig = SHORTCUTS[e.key]; // Load the specific target list for this key
                processNext();
            } else {
                // Emergency Stop: Pressing the key while running cancels it
                stopScript();
            }
        }
    });

    window.__autoQuestionnaire = {
        enable: () => { active = true; },
        disable: () => { 
            active = false; 
            stopScript();
        },
        isActive: () => active
    };
})();