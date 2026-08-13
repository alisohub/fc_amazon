(() => {
    if (window.__autoQuestionnaireLoaded) {
        return;
    }
    window.__autoQuestionnaireLoaded = true;

    // ==========================================
    // 1. CONFIGURATION (Easy to expand)
    // ==========================================
    
    // The universal kill switch for all shortcuts
    const KILL_WORDS = ["tak, kontynuuj", "да, продолжить", "так, продовжити"]; 
    
    // Words that only need to be partially matched (using .includes)
    const PARTIAL_MATCHES = ["opinia", "мнение", "думка"];

    // Add new keyboard shortcuts and their target word lists here
    const SHORTCUTS = {
        'F1': {
            // ⚠️ PRIORITY ORDER: Put nested/uncovered options FIRST in the list, 
            // and their parent (expanding) buttons LAST.
            targets: [
                "opinia", "мнение", "думка", 
                "brak plomby", "не запечатано", "пломба відсутня", 
                "brak", "нет", "немає", 
                "polybag", "полиэтиленовый мешок", "поліетиленовий пакет", 
                "nie", "ні"
            ]
        },
        // Example for Dziura expanding UI:
        // 'F2': {
        //     targets: ["rozdarcie", "dziura"] // It will ALWAYS click rozdarcie if both are visible
        // }
    };

    // ==========================================
    // 2. STATE MANAGEMENT
    // ==========================================
    let active = false;
    let isRunning = false;
    let activeConfig = null;
    
    let changeObserver = null;
    let fallbackTimer = null;
    let enterTimer = null;

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
        // 1. Gather all potential targets on the screen once
        const paragraphs = Array.from(document.querySelectorAll('div.answer-card p'))
            .filter(p => p.offsetWidth > 0 && p.offsetHeight > 0);
            
        const standardButtons = Array.from(document.querySelectorAll('button, [role="button"], .awsui-button'))
            .filter(btn => btn.offsetWidth > 0 && btn.offsetHeight > 0);

        // 2. PRIORITY LOOP: Iterate through the text targets FIRST
        for (let target of textList) {
            const isPartial = PARTIAL_MATCHES.includes(target);
            
            // Check all paragraphs for THIS specific target
            for (let p of paragraphs) {
                const pText = normalizeText(p.textContent);
                if (pText === target || (isPartial && pText.includes(target))) {
                    return p; 
                }
            }
            
            // Check all standard buttons for THIS specific target
            for (let btn of standardButtons) {
                const btnText = normalizeText(btn.textContent);
                if (btnText === target || (isPartial && btnText.includes(target))) {
                    const innerSpan = btn.querySelector('span');
                    return innerSpan ? innerSpan : btn;
                }
            }
        }
        
        return null; // Return null only if NONE of the targets exist on screen
    }

    function processNext() {
        if (!isRunning || !active || !activeConfig) return;

        // Check for universal Kill Switch FIRST
        const killBtn = findButton(KILL_WORDS);
        if (killBtn) {
            stopScript(); 
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

        enterTimer = setTimeout(() => {
            if (!domChanged) {
                const targetEl = document.activeElement || document.body;
                targetEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
            }
        }, 500);

        fallbackTimer = setTimeout(() => {
            if (!domChanged) stopScript();
        }, 3000);
    }

    // ==========================================
    // 4. TRIGGERS & INTEGRATION
    // ==========================================
    document.addEventListener('keydown', (e) => {
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
        enable: () => { active = true; },
        disable: () => { 
            active = false; 
            stopScript();
        },
        isActive: () => active
    };
})();