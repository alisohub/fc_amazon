(() => {
    if (window.__autoQuestionnaireLoaded) {
        return;
    }
    window.__autoQuestionnaireLoaded = true;

    let active = false;
    let isRunning = false;
    let changeObserver = null;
    let fallbackTimer = null;
    let enterTimer = null; 

    // 1. The Hit List & Kill Switch
    const TARGET_WORDS = ["opinia", "brak plomby", "brak", "polybag", "nie"];
    const KILL_WORDS = ["tak, kontynuuj"];

    // Helper: Cleans up text to ignore weird Amazon spacing or capitalization
    function normalizeText(txt) {
        return (txt || '').replace(/\s+/g, ' ').trim().toLowerCase();
    }

    // Helper: Scans the page for the DEEPEST element matching our lists
    function findButton(textList) {
        // Grab everything that could possibly hold the text, including paragraphs and spans
        const elements = Array.from(document.querySelectorAll('button, [role="button"], .awsui-button, .answer-card, p, span'));
        
        for (let target of textList) {
            // Find ALL elements that contain the target text
            const matches = elements.filter(el => {
                if (el.offsetWidth === 0 || el.offsetHeight === 0) return false;
                
                const btnText = normalizeText(el.textContent);
                return btnText === target || btnText.includes(target);
            });
            
            if (matches.length > 0) {
                // Because the browser reads outer containers first and inner elements last,
                // the LAST match in the array is guaranteed to be the absolute deepest <p> or <span>.
                return matches[matches.length - 1];
            }
        }
        return null;
    }

    // Helper: The "Atomic Click" - Fakes exact physical screen coordinates and Pointer Events
    function simulateClick(element) {
        element.scrollIntoView({ block: 'center', behavior: 'instant' });
        element.focus();

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);

        const eventConfig = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: centerX,
            clientY: centerY,
            buttons: 1
        };

        element.dispatchEvent(new PointerEvent('pointerover', eventConfig));
        element.dispatchEvent(new PointerEvent('pointerenter', eventConfig));
        element.dispatchEvent(new PointerEvent('pointerdown', eventConfig));
        element.dispatchEvent(new MouseEvent('mousedown', eventConfig));
        element.dispatchEvent(new PointerEvent('pointerup', eventConfig));
        element.dispatchEvent(new MouseEvent('mouseup', eventConfig));
        element.dispatchEvent(new MouseEvent('click', eventConfig));
    }

    // 2. The Reactor Loop
    function processNext() {
        if (!isRunning || !active) return;

        // Step A: Check for the Kill Switch
        const killBtn = findButton(KILL_WORDS);
        if (killBtn) {
            isRunning = false;
            return; 
        }

        // Step B: Check for the Hit List
        const actionBtn = findButton(TARGET_WORDS);
        if (actionBtn) {
            simulateClick(actionBtn);
            waitForDustToSettle(); 
            return;
        }

        // Step C: Graceful Bailout
        isRunning = false;
    }

    // 3. The Watcher
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
            childList: true, 
            subtree: true, 
            attributes: true, 
            attributeFilter: ['disabled', 'class'] 
        });

        // 4a. The "Stuck UI" Fix
        enterTimer = setTimeout(() => {
            if (!domChanged) {
                const targetEl = document.activeElement || document.body;
                targetEl.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                }));
                targetEl.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                }));
            }
        }, 500);

        // 4b. Deadlock Protection
        fallbackTimer = setTimeout(() => {
            if (!domChanged) {
                changeObserver.disconnect();
                isRunning = false; 
            }
        }, 3000);
    }

    // 5. The Trigger
    document.addEventListener('keydown', (e) => {
        if (!active) return;
        
        if (e.key === 'F1') {
            e.preventDefault(); 
            
            if (!isRunning) {
                isRunning = true;
                processNext();
            } else {
                isRunning = false;
                if (changeObserver) changeObserver.disconnect();
                clearTimeout(fallbackTimer);
                clearTimeout(enterTimer);
            }
        }
    });

    // 6. Hub Integration Handlers
    window.__autoQuestionnaire = {
        enable: () => { active = true; },
        disable: () => { 
            active = false; 
            isRunning = false;
            if (changeObserver) changeObserver.disconnect();
            clearTimeout(fallbackTimer);
            clearTimeout(enterTimer);
        },
        isActive: () => active
    };
})();